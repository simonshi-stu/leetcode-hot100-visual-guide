from __future__ import annotations

import ast
import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = Path('E:/Projects/leetcode-hot100-export-20261125')
OUT = ROOT / 'src' / 'data.ts'
CODE_OUT = ROOT / 'public' / 'code'
REPORT = ROOT / '.tmp' / 'code-validation.json'


def clean(value: str) -> str:
    return html.unescape(re.sub(r'<[^>]+>', '', value)).replace('\xa0', ' ').strip()


def parse_examples(statement_html: str):
    text = clean(re.sub(r'<img[^>]*>', '', re.sub(r'<(?:br|/p|/pre|/div|/li)[^>]*>', '\n', statement_html)))
    text = ' '.join(text.split())
    segments = re.split(r'示例\s*\d+\s*[:：]?', text)[1:]
    examples = []
    for segment in segments:
        segment = re.split(r'提示\s*[:：]?', segment, maxsplit=1)[0]
        parts = re.split(r'解释\s*[:：]?', segment, maxsplit=1)
        match = re.search(r'输入\s*[:：]?\s*(.*?)\s*输出\s*[:：]?\s*(.*)$', parts[0])
        if match:
            examples.append({
                'input': match.group(1).strip(),
                'output': match.group(2).strip(),
                'explanation': parts[1].strip() if len(parts) > 1 else '',
            })
    return examples


def parse_constraints(statement_html: str):
    tail = re.split(r'<strong[^>]*>提示', statement_html, maxsplit=1)
    if len(tail) == 1:
        tail = re.split(r'<strong[^>]*>Constraints', statement_html, maxsplit=1, flags=re.I)
    if len(tail) == 1:
        return []
    return [clean(item) for item in re.findall(r'<li>(.*?)</li>', tail[1], re.S) if clean(item)]


def main():
    rows = [json.loads(line) for line in (DATA / 'dataset.jsonl').read_text(encoding='utf-8').splitlines()]
    refs = {r['sample_id']: r for r in map(json.loads, (DATA / 'references.jsonl').read_text(encoding='utf-8').splitlines())}
    CODE_OUT.mkdir(parents=True, exist_ok=True)
    problems, checks = [], []
    for row in rows:
        pid = row['problem_id']
        submission = row['latest_submission']
        ref = refs[row['sample_id']]
        source_files = list((DATA / 'solutions').glob(f'{int(pid):04d}-*.py'))
        assert len(source_files) == 1, pid
        source = source_files[0].read_text(encoding='utf-8')
        original_hash = hashlib.sha256(source.encode()).hexdigest()
        assert source == submission['code'] == ref['code'], f'code mismatch {pid}'
        assert original_hash == ref['code_sha256'], f'hash mismatch {pid}'
        assert submission['submission_id'] == ref['submission_id']
        code = source
        adaptation = ''
        if pid == '200':
            adaptation = 'Python3 教学版：算法与注释保持原样。历史语言标记为 Python；原代码可在 Python3 解析运行，dfs 内局部 nr、nc 的重新赋值不影响调用者维度，因此未改写。'
        elif pid == '207':
            adaptation = 'Python3 教学版：基于历史 Python 提交，仅在开头补充 from collections import defaultdict, deque。当前实现仍为 Kahn 拓扑排序；文件后半部分不可达的旧 DFS 注释原样保留。'
            code = 'from collections import defaultdict, deque\n\n' + code
        ast.parse(code, filename=f'{pid}.py')
        filename = f'{int(pid):04d}-{row["slug"]}.py'
        (CODE_OUT / filename).write_text(code, encoding='utf-8', newline='')
        display_hash = hashlib.sha256(code.encode()).hexdigest()
        difficulties = {'Easy': '简单', 'Medium': '中等', 'Hard': '困难'}
        problems.append({
            'id': int(pid), 'title': row['title'], 'titleEn': row['title_en'], 'slug': row['slug'],
            'category': row['category'], 'difficulty': row['difficulty'], 'difficultyZh': difficulties[row['difficulty']],
            'url': row['problem_url'], 'submittedAt': submission['submitted_at'],
            'historicalLanguage': submission['language'], 'displayLanguage': 'Python3', 'code': code,
            'codeFile': f'code/{filename}', 'originalHash': original_hash, 'displayHash': display_hash,
            'adapted': pid in {'200', '207'}, 'adaptation': adaptation,
            'examples': parse_examples(row['statement_html']), 'constraints': parse_constraints(row['statement_html']),
        })
        checks.append({'id': int(pid), 'sourceExact': True, 'originalHash': original_hash, 'displayHash': display_hash,
                       'python3Syntax': True, 'adapted': pid in {'200', '207'}})
    assert len(problems) == 88 and len({p['id'] for p in problems}) == 88
    OUT.write_text('export const problems: Problem[] = ' + json.dumps(problems, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    REPORT.write_text(json.dumps({'count': len(checks), 'checks': checks}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Generated {len(problems)} problems; all original hashes exact; all displayed code parses as Python3.')


if __name__ == '__main__':
    main()
