#!/usr/bin/env python3
"""Run the 88 fixed, locally exported submissions against public examples only.

This is not a LeetCode judge and does not use hidden tests. Input text is decoded
as data (JSON or literal Python containers), never evaluated as code. Only the
fixed files under public/code are compiled and executed.
"""
from __future__ import annotations

import ast
import bisect
import collections
import copy
import functools
import hashlib
import heapq
import html
import inspect
import itertools
import json
import math
import platform
import re
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple, Union

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "src" / "data.ts"
CODE_DIR = ROOT / "public" / "code"
DATASET_FILE = Path("E:/Projects/leetcode-hot100-export-20261125/dataset.jsonl")
REPORT_FILE = ROOT / ".tmp" / "example-validation.json"

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


PRELUDE = '''from __future__ import annotations
import bisect
import collections
import functools
import heapq
import itertools
import math
from collections import Counter, defaultdict, deque
from math import inf
from typing import Any, Dict, List, Optional, Set, Tuple, Union
'''

# LeetCode exposes these constructor/graph-helper fields but the submitted method
# does not receive them. The graph itself is built before selecting call args.
HELPER_PARAMS = {"intersectVal", "skipA", "skipB", "pos"}
VOID_OUTPUT_PARAMS = {283: 0, 189: 0, 48: 0, 73: 0, 114: 0}
FLOAT_TOLERANCE = 1e-5


class ExampleError(ValueError):
    pass


def clean_html(value: str) -> str:
    value = re.sub(r"<(?:br|/p|/pre|/div|/li)[^>]*>", "\n", value)
    value = html.unescape(re.sub(r"<[^>]+>", " ", value))
    return " ".join(value.split())


def extract_statement_examples(source: str) -> List[Dict[str, str]]:
    """Extract labelled examples, including older <pre> labels without colons."""
    text = clean_html(source)
    patterns = [
        r"\bInput\s*[:：]?\s*(.*?)\s*\bOutput\s*[:：]?\s*(.*?)"
        r"(?=\s*(?:Explanation\s*[:：]?|Example\s+\d+\s*[:：]|Constraints\s*[:：]|$))",
        r"输入\s*[:：]?\s*(.*?)\s*输出\s*[:：]?\s*(.*?)"
        r"(?=\s*(?:解释\s*[:：]?|示例\s*\d+\s*[:：]|提示\s*[:：]?|$))",
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text)
        if matches:
            return [{"input": i.strip(), "output": o.strip()} for i, o in matches]
    return []


def load_problems() -> Tuple[List[Dict[str, Any]], Dict[int, Dict[str, Any]]]:
    text = DATA_FILE.read_text(encoding="utf-8")
    match = re.search(r"export\s+const\s+problems\s*:\s*Problem\[\]\s*=\s*", text)
    if not match:
        raise RuntimeError("Could not locate the problems array in src/data.ts")
    payload = text[match.end():].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    problems = json.loads(payload)
    rows = {
        int(row["problem_id"]): row
        for row in map(json.loads, DATASET_FILE.read_text(encoding="utf-8").splitlines())
    }
    if len(problems) != 88 or len({p["id"] for p in problems}) != 88:
        raise RuntimeError("Expected exactly 88 unique displayed problems")
    return problems, rows


def scan_container(text: str, start: int) -> int:
    """Return the end of a quoted string or balanced container."""
    pairs = {"[": "]", "{": "}", "(": ")"}
    if text[start] in "'\"":
        quote = text[start]
        i = start + 1
        while i < len(text):
            if text[i] == "\\":
                i += 2
            elif text[i] == quote:
                return i + 1
            else:
                i += 1
        raise ExampleError("Unterminated quoted literal")
    if text[start] not in pairs:
        i = start
        while i < len(text) and not text[i].isspace() and text[i] != ",":
            i += 1
        return i
    stack = [pairs[text[start]]]
    i = start + 1
    while i < len(text) and stack:
        char = text[i]
        if char in "'\"":
            i = scan_container(text, i)
            continue
        if char in pairs:
            stack.append(pairs[char])
        elif char == stack[-1]:
            stack.pop()
        i += 1
    if stack:
        raise ExampleError("Unbalanced container")
    return i


def decode_literal(text: str) -> Any:
    """Decode JSON/Python literal data without eval or executing input text."""
    text = text.strip()
    if not text:
        raise ExampleError("Empty literal")
    if text.casefold() in {"no cycle", "无环", "none", "null"}:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            # literal_eval accepts only literals; calls, names, and expressions
            # such as __import__ are rejected. This supports older single quotes.
            return ast.literal_eval(text)
        except (ValueError, SyntaxError) as exc:
            raise ExampleError(f"Unparseable literal: {text[:100]}") from exc


def split_top_level(text: str, delimiter: str = ",") -> List[str]:
    parts, start, stack = [], 0, []
    pairs = {"[": "]", "{": "}", "(": ")"}
    i = 0
    while i < len(text):
        char = text[i]
        if char in "'\"":
            i = scan_container(text, i)
            continue
        if char in pairs:
            stack.append(pairs[char])
        elif stack and char == stack[-1]:
            stack.pop()
        elif char == delimiter and not stack:
            parts.append(text[start:i].strip())
            start = i + 1
        i += 1
    if stack:
        raise ExampleError("Unbalanced top-level value")
    parts.append(text[start:].strip())
    return parts


def parse_assignments(text: str) -> Dict[str, Any]:
    values: Dict[str, Any] = {}
    for part in split_top_level(text):
        match = re.fullmatch(r"([A-Za-z_]\w*)\s*=\s*(.+)", part, re.S)
        if not match:
            raise ExampleError(f"Expected name = value, got: {part[:100]}")
        name, literal = match.groups()
        if name in values:
            raise ExampleError(f"Duplicate argument {name}")
        values[name] = decode_literal(literal)
    return values


def decode_sequence(text: str) -> List[Any]:
    values, i = [], 0
    while i < len(text):
        while i < len(text) and text[i].isspace():
            i += 1
        if i == len(text):
            break
        end = scan_container(text, i)
        values.append(decode_literal(text[i:end]))
        i = end
    return values


def canonical_data(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=repr)


def parse_input_values(text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Accept named, unnamed, and mixed positional/named public inputs."""
    params = metadata["params"]
    parts = split_top_level(text)
    assignment = re.compile(r"([A-Za-z_]\w*)\s*=\s*(.+)", re.S)
    values: Dict[str, Any] = {}
    positional: List[Any] = []
    for part in parts:
        match = assignment.fullmatch(part)
        if match:
            name, literal = match.groups()
            if name in values:
                raise ExampleError(f"Duplicate argument {name}")
            values[name] = decode_literal(literal)
        else:
            positional.extend(decode_sequence(part))
    remaining = [p["name"] for p in params if p["name"] not in values]
    if len(positional) > len(remaining):
        raise ExampleError("Too many unnamed public input values")
    for name, value in zip(remaining, positional):
        values[name] = value
    if metadata.get("name") == "mergeTwoLists":
        values["list1"] = values.get("list1", values.get("l1"))
        values["list2"] = values.get("list2", values.get("l2"))
        values.pop("l1", None)
        values.pop("l2", None)
    return values


def input_key(pid: int, text: str, metadata: Dict[str, Any]) -> str:
    try:
        if metadata.get("systemdesign"):
            return canonical_data(decode_sequence(text))
        return canonical_data(parse_input_values(text, metadata))
    except ExampleError:
        return "raw:" + " ".join(text.split())


def collect_examples(problem: Dict[str, Any], row: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Merge display examples with reliably labelled statement examples."""
    metadata = row["method_metadata"]
    display = problem.get("examples", [])
    statement = extract_statement_examples(row.get("statement_en_html", ""))
    if not statement:
        statement = extract_statement_examples(row.get("statement_html", ""))
    merged: List[Dict[str, Any]] = []
    seen: Set[str] = set()
    for source, examples in (("src/data.ts", display), ("original statement_html", statement)):
        for example in examples:
            key = input_key(problem["id"], example["input"], metadata)
            if key in seen:
                continue
            seen.add(key)
            merged.append({
                "input": example["input"],
                "output": example["output"],
                "explanation": example.get("explanation", ""),
                "source": source,
            })
    return merged


def parse_expected_output(pid: int, text: str) -> Any:
    if pid == 160:
        match = re.search(r"Intersected at ['\"](.*?)['\"]", text)
        if match:
            return decode_literal(match.group(1))
        if "No intersection" in text:
            return None
    if pid == 142:
        if re.search(r"\bnull\b", text, re.I):
            return None
        match = re.search(r"(?:索引为|index\s+)\s*(-?\d+)", text, re.I)
        if match:
            return int(match.group(1))
    return decode_literal(text)


def convert_value(value: Any, type_name: str) -> Any:
    if type_name == "ListNode":
        if not isinstance(value, list):
            raise ExampleError("ListNode input is not an array")
        head = None
        for item in reversed(value):
            head = ListNode(item, head)
        return head
    if type_name == "TreeNode":
        if not isinstance(value, list):
            raise ExampleError("TreeNode input is not an array")
        return build_tree(value)
    return value


def build_tree(values: List[Any]) -> Optional[TreeNode]:
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue = collections.deque([root])
    index = 1
    # LeetCode's compact serialization consumes child slots for non-null nodes
    # only; null entries never acquire children of their own.
    while queue and index < len(values):
        node = queue.popleft()
        if index < len(values) and values[index] is not None:
            node.left = TreeNode(values[index])
            queue.append(node.left)
        index += 1
        if index < len(values) and values[index] is not None:
            node.right = TreeNode(values[index])
            queue.append(node.right)
        index += 1
    return root


def serialize_list(head: Optional[ListNode]) -> List[Any]:
    values, seen = [], set()
    while head is not None:
        if id(head) in seen:
            raise ExampleError("Submission returned a cyclic serialized list")
        seen.add(id(head))
        values.append(head.val)
        head = head.next
    return values


def serialize_tree(root: Optional[TreeNode]) -> List[Any]:
    if root is None:
        return []
    values = []
    queue = collections.deque([root])
    while queue:
        node = queue.popleft()
        if node is None:
            values.append(None)
        else:
            values.append(node.val)
            queue.extend((node.left, node.right))
    while values and values[-1] is None:
        values.pop()
    return values


def link_cycle(head: Optional[ListNode], pos: int) -> Optional[ListNode]:
    if head is None or pos < 0:
        return None
    nodes = []
    node = head
    while node is not None:
        nodes.append(node)
        node = node.next
    if pos >= len(nodes):
        raise ExampleError(f"Cycle position {pos} is outside the list")
    nodes[-1].next = nodes[pos]
    return nodes[pos]


def build_intersection(
    intersect_val: int, list_a: List[Any], list_b: List[Any], skip_a: int, skip_b: int
) -> Tuple[Optional[ListNode], Optional[ListNode], Optional[ListNode]]:
    head_a = convert_value(list_a, "ListNode")
    head_b = convert_value(list_b, "ListNode")
    if intersect_val == 0:
        return head_a, head_b, None

    def suffix_values(head: Optional[ListNode], skip: int) -> List[Any]:
        node = head
        for _ in range(skip):
            if node is None:
                raise ExampleError("Intersection skip is outside a public list")
            node = node.next
        values = []
        while node is not None:
            values.append(node.val)
            node = node.next
        return values

    def attach_suffix(head: Optional[ListNode], skip: int, shared: ListNode) -> None:
        node = head
        for _ in range(skip):
            node = node.next
        while node.next is not None:
            node = node.next
        node.next = shared

    suffix_a = suffix_values(head_a, skip_a)
    suffix_b = suffix_values(head_b, skip_b)
    if not suffix_a or suffix_a != suffix_b or suffix_a[0] != intersect_val:
        raise ExampleError("Invalid public intersection helper fields")
    shared = None
    for value in reversed(suffix_a):
        shared = ListNode(value, shared)
    attach_suffix(head_a, skip_a, shared)
    attach_suffix(head_b, skip_b, shared)
    return head_a, head_b, shared


def execute_design(
    problem: Dict[str, Any], metadata: Dict[str, Any], namespace: Dict[str, Any],
    input_text: str, expected: Any, on_start: Any,
) -> Tuple[Any, Any]:
    sequence = decode_sequence(input_text)
    if len(sequence) != 2:
        raise ExampleError("Design example must contain operations and argument arrays")
    operations, arguments = sequence
    if not isinstance(operations, list) or not isinstance(arguments, list):
        raise ExampleError("Design operations/arguments are not arrays")
    if len(operations) != len(arguments) or not operations:
        raise ExampleError("Design operation and argument counts differ")
    class_name = metadata["classname"]
    cls = namespace.get(class_name)
    if not isinstance(cls, type):
        raise ExampleError(f"Missing design class {class_name}")
    constructor = metadata["constructor"]["params"]
    if operations[0] != class_name or arguments[0] != [] or constructor:
        raise ExampleError("Unexpected design constructor example")
    methods = {method["name"]: method for method in metadata["methods"]}
    on_start()
    obj = cls()
    actual = [None]
    for operation, raw_args in zip(operations[1:], arguments[1:]):
        if operation not in methods:
            raise ExampleError(f"Unknown design operation {operation}")
        method = methods[operation]
        if not isinstance(raw_args, list) or len(raw_args) != len(method["params"]):
            raise ExampleError(f"Wrong argument count for {operation}")
        args = [convert_value(v, p["type"]) for v, p in zip(raw_args, method["params"])]
        actual.append(getattr(obj, operation)(*args))
    return actual, expected


def valid_balanced_bst(root: Optional[TreeNode], nums: List[int]) -> Tuple[bool, str]:
    inorder: List[Any] = []
    visiting: Set[int] = set()

    def walk(node: Optional[TreeNode], low: Any, high: Any) -> Tuple[bool, int]:
        if node is None:
            return True, 0
        if id(node) in visiting:
            return False, 0
        visiting.add(id(node))
        if low is not None and node.val <= low or high is not None and node.val >= high:
            return False, 0
        left_ok, left_height = walk(node.left, low, node.val)
        inorder.append(node.val)
        right_ok, right_height = walk(node.right, node.val, high)
        visiting.remove(id(node))
        ok = left_ok and right_ok and abs(left_height - right_height) <= 1
        return ok, 1 + max(left_height, right_height)

    ok, _ = walk(root, None, None)
    if not ok:
        return False, "result is not a valid balanced binary search tree"
    if inorder != nums:
        return False, "result does not preserve the sorted input inorder sequence"
    return True, "valid height-balanced BST; alternate valid shapes accepted"


def exact_equal(actual: Any, expected: Any) -> Tuple[bool, str]:
    if isinstance(expected, bool) or isinstance(actual, bool):
        ok = type(actual) is bool and actual is expected
    elif expected is None:
        ok = actual is None
    elif isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        ok = actual == expected
    elif type(actual) is not type(expected):
        ok = False
    elif isinstance(expected, list):
        ok = len(actual) == len(expected) and all(exact_equal(a, e)[0] for a, e in zip(actual, expected))
    else:
        ok = actual == expected
    return ok, "exact structured comparison"


def compare(problem_id: int, actual: Any, expected: Any, context: Dict[str, Any]) -> Tuple[bool, str]:
    if problem_id == 4:
        ok = isinstance(actual, (int, float)) and not isinstance(actual, bool) and abs(actual - expected) <= FLOAT_TOLERANCE
        return ok, f"double comparison with absolute tolerance {FLOAT_TOLERANCE:g}"
    if problem_id == 295:
        if not isinstance(actual, list) or len(actual) != len(expected):
            return False, f"design result length mismatch; float tolerance {FLOAT_TOLERANCE:g}"
        for value, target in zip(actual, expected):
            if target is None:
                if value is not None:
                    return False, "null design return mismatch"
            elif not isinstance(value, (int, float)) or isinstance(value, bool) or abs(value - target) > FLOAT_TOLERANCE:
                return False, "design float comparison failed"
        return True, f"design null checks and float tolerance {FLOAT_TOLERANCE:g}"
    if problem_id == 108:
        ok, reason = valid_balanced_bst(actual, context["args"][0])
        return ok, reason
    if problem_id in {142, 160}:
        ok = actual is context["identity_expected"]
        return ok, "node identity comparison against the public graph"
    if problem_id == 1:
        return sorted(actual) == sorted(expected), "two indices accepted in either order"
    if problem_id in {15, 39}:
        canonical_actual = sorted(sorted(item) for item in actual)
        canonical_expected = sorted(sorted(item) for item in expected)
        return canonical_actual == canonical_expected, "combination order and outer order ignored"
    if problem_id == 49:
        canonical_actual = sorted(sorted(group) for group in actual)
        canonical_expected = sorted(sorted(group) for group in expected)
        return canonical_actual == canonical_expected, "group and outer order ignored"
    if problem_id in {17, 22, 46, 51, 78, 347, 438}:
        return sorted(actual) == sorted(expected), "outer result order ignored"
    if problem_id == 131:
        return sorted(actual) == sorted(expected), "partition order ignored; segment order preserved"
    return exact_equal(actual, expected)


def jsonable(value: Any) -> Any:
    if isinstance(value, TreeNode):
        return {"tree": serialize_tree(value)}
    if isinstance(value, ListNode):
        try:
            return {"list": serialize_list(value)}
        except ExampleError:
            return {"cyclic_list_node": value.val}
    if isinstance(value, dict):
        return {str(k): jsonable(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [jsonable(v) for v in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return repr(value)


def compact(value: Any, limit: int = 700) -> str:
    text = json.dumps(jsonable(value), ensure_ascii=False, default=repr)
    return text if len(text) <= limit else text[:limit] + "..."


def check_problem(problem: Dict[str, Any], row: Dict[str, Any]) -> Dict[str, Any]:
    pid = problem["id"]
    metadata = row["method_metadata"]
    examples = collect_examples(problem, row)
    result: Dict[str, Any] = {
        "id": pid,
        "title": problem["titleEn"],
        "slug": problem["slug"],
        "code_file": str(CODE_DIR / Path(problem["codeFile"]).name),
        "examples_available": len(examples),
        "examples_attempted": 0,
        "examples_passed": 0,
        "examples_failed": 0,
        "examples_skipped": 0,
        "examples": [],
    }
    source_path = Path(result["code_file"])
    source = source_path.read_text(encoding="utf-8")
    result["code_sha256"] = hashlib.sha256(source.encode()).hexdigest()
    result["matches_data_ts"] = source == problem["code"]
    result["matches_original_dataset"] = source == row["latest_submission"]["code"]
    documented_adaptation = (
        pid == 207
        and source == "from collections import defaultdict, deque\n\n" + row["latest_submission"]["code"]
    )
    result["matches_documented_adaptation"] = documented_adaptation
    if not result["matches_data_ts"] or not (
        result["matches_original_dataset"] or documented_adaptation
    ):
        result["load_error"] = "Displayed source differs from src/data.ts or the documented original"
    else:
        try:
            namespace: Dict[str, Any] = {
                "__name__": "__public_example__", "ListNode": ListNode, "TreeNode": TreeNode,
            }
            exec(compile(PRELUDE + "\n" + source, str(source_path), "exec"), namespace)
            class_name = metadata.get("classname", "Solution")
            cls = namespace.get(class_name)
            if not isinstance(cls, type):
                raise ExampleError(f"Missing class {class_name}")
            if not metadata.get("systemdesign"):
                method_name = metadata["name"]
                method = getattr(cls, method_name, None)
                if not callable(method):
                    raise ExampleError(f"Missing method {class_name}.{method_name}")
        except Exception as exc:
            result["load_error"] = f"{type(exc).__name__}: {exc}"

    if "load_error" in result:
        result["examples_skipped"] = len(examples)
        for index, example in enumerate(examples, 1):
            result["examples"].append({
                "index": index, "status": "skipped", "source": example["source"],
                "input": example["input"], "output": example["output"],
                "reason": result["load_error"],
            })
        return result

    for index, example in enumerate(examples, 1):
        detail: Dict[str, Any] = {
            "index": index, "source": example["source"],
            "input": example["input"], "output": example["output"],
        }
        try:
            expected = parse_expected_output(pid, example["output"])
            if metadata.get("systemdesign"):
                result["examples_attempted"] += 1
                actual, _ = execute_design(
                    problem, metadata, namespace, example["input"], expected,
                    lambda: detail.update(_attempt_started=True),
                )
                context: Dict[str, Any] = {}
            else:
                raw_args = parse_input_values(example["input"], metadata)
                params = metadata["params"]
                missing = [p["name"] for p in params if p["name"] not in raw_args]
                if missing:
                    raise ExampleError(f"Missing input arguments: {', '.join(missing)}")
                all_args = [convert_value(raw_args[p["name"]], p["type"]) for p in params]
                args_by_name = {p["name"]: value for p, value in zip(params, all_args)}
                args = [args_by_name[p["name"]] for p in params if p["name"] not in HELPER_PARAMS]
                context = {"args": args, "identity_expected": None}
                if pid == 141:
                    args_by_name["head"] = convert_value(raw_args["head"], "ListNode")
                    link_cycle(args_by_name["head"], raw_args["pos"])
                    args = [args_by_name["head"]]
                elif pid == 142:
                    head = convert_value(raw_args["head"], "ListNode")
                    context["identity_expected"] = link_cycle(head, raw_args["pos"])
                    args = [head]
                elif pid == 160:
                    head_a, head_b, shared = build_intersection(
                        raw_args["intersectVal"], raw_args["listA"], raw_args["listB"],
                        raw_args["skipA"], raw_args["skipB"],
                    )
                    context["identity_expected"] = shared
                    args = [head_a, head_b]
                elif pid == 236:
                    nodes = {}
                    queue = collections.deque([args[0]]) if args[0] is not None else collections.deque()
                    while queue:
                        node = queue.popleft()
                        nodes[node.val] = node
                        queue.extend(child for child in (node.left, node.right) if child is not None)
                    if args[1] not in nodes or args[2] not in nodes:
                        raise ExampleError("LCA public p/q values are absent from the tree")
                    args[1], args[2] = nodes[args[1]], nodes[args[2]]
                method = getattr(namespace[class_name], metadata["name"])
                signature = inspect.signature(method)
                positional = [
                    p for p in signature.parameters.values()
                    if p.kind in (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD)
                ][1:]  # inspect.signature on the unbound method includes self.
                if len(args) != len(positional):
                    raise ExampleError(
                        f"Method expects {len(positional)} arguments after excluding helpers; got {len(args)}"
                    )
                result["examples_attempted"] += 1
                detail["_attempt_started"] = True
                returned = getattr(namespace[class_name](), metadata["name"])(*args)
                return_type = metadata["return"]["type"]
                if return_type == "void":
                    output_spec = metadata.get("output", {})
                    output_param = output_spec.get("paramindex") if isinstance(output_spec, dict) else None
                    if output_param is None:
                        output_param = VOID_OUTPUT_PARAMS.get(pid)
                    if output_param is None:
                        raise ExampleError("No public in-place output parameter configured")
                    actual = args[output_param]
                    if pid == 114:
                        actual = serialize_tree(actual)
                elif return_type == "ListNode":
                    if pid == 142:
                        actual = returned
                    elif pid == 160:
                        actual = returned
                    else:
                        actual = serialize_list(returned)
                elif return_type == "TreeNode":
                    if pid == 108:
                        actual = returned
                    elif pid == 236:
                        actual = returned.val if returned is not None else None
                    else:
                        actual = serialize_tree(returned)
                else:
                    actual = returned
            passed, comparator = compare(pid, actual, expected, context)
            detail.update({
                "status": "passed" if passed else "failed", "comparator": comparator,
                "expected": compact(expected), "actual": compact(actual),
            })
            if passed:
                result["examples_passed"] += 1
            else:
                result["examples_failed"] += 1
                detail["reason"] = "Public output did not match"
        except Exception as exc:
            # Parse/setup failures are skipped, not misreported as wrong answers.
            if not detail.pop("_attempt_started", False):
                result["examples_skipped"] += 1
                detail["status"] = "skipped"
                detail["reason"] = f"{type(exc).__name__}: {exc}"
            else:
                result["examples_failed"] += 1
                detail["status"] = "failed"
                detail["reason"] = f"{type(exc).__name__}: {exc}"
                detail["traceback"] = traceback.format_exc(limit=4).strip()
        finally:
            detail.pop("_attempt_started", None)
            if "status" not in detail:
                result["examples_skipped"] += 1
                detail["status"] = "skipped"
                detail["reason"] = "Example did not complete"
        result["examples"].append(detail)
    return result


def main() -> int:
    problems, rows = load_problems()
    results = [check_problem(problem, rows[problem["id"]]) for problem in problems]
    available = sum(r["examples_available"] for r in results)
    attempted = sum(r["examples_attempted"] for r in results)
    passed = sum(r["examples_passed"] for r in results)
    failed = sum(r["examples_failed"] for r in results)
    skipped = sum(r["examples_skipped"] for r in results)
    report = {
        "scope": "Fixed local public examples only; not hidden tests and not a new LeetCode verdict.",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "runtime": {
            "python": platform.python_version(), "executable": sys.executable,
            "platform": platform.platform(),
        },
        "sources": {
            "display_data": str(DATA_FILE), "original_dataset": str(DATASET_FILE),
            "submissions": str(CODE_DIR), "output": str(REPORT_FILE),
        },
        "aggregate": {
            "problems_total": len(results),
            "problems_with_examples": sum(r["examples_available"] > 0 for r in results),
            "problems_with_all_attempted_examples_passed": sum(
                r["examples_available"] > 0 and r["examples_attempted"] == r["examples_available"]
                and r["examples_passed"] == r["examples_attempted"] for r in results
            ),
            "examples_available": available, "examples_attempted": attempted,
            "examples_passed": passed, "examples_failed": failed, "examples_skipped": skipped,
            "source_files_matching_data_and_dataset": sum(
                r.get("matches_data_ts") and (
                    r.get("matches_original_dataset") or r.get("matches_documented_adaptation")
                ) for r in results
            ),
        },
        "problems": results,
    }
    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report["aggregate"], ensure_ascii=False, indent=2))
    print(f"Report: {REPORT_FILE}")
    for result in results:
        if result["examples_failed"] or result["examples_skipped"] or "load_error" in result:
            reasons = [
                f"#{e['index']} {e['status']}: {e.get('reason', '')}"
                for e in result["examples"] if e["status"] != "passed"
            ]
            print(f"{result['id']} {result['title']}: " + "; ".join(reasons))
    return 1 if failed or skipped else 0


if __name__ == "__main__":
    raise SystemExit(main())
