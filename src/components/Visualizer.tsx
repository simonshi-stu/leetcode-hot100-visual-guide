import { useEffect, useState, type KeyboardEvent } from 'react';
import type { Guide } from '../model';
import { useReducedMotion } from '../hooks';
import { Icon } from './Icons';
import { FamilyRenderer } from './Visualizers';

export function Visualizer({ guide }: { guide: Guide }) {
  const frames = guide.viz.frames;
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const reducedMotion = useReducedMotion();
  const frame = frames[frameIndex];

  useEffect(() => {
    setFrameIndex(0);
    setPlaying(false);
  }, [guide.id]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => {
        if (current >= frames.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1350 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, frames.length, reducedMotion]);

  const go = (next: number) => {
    setPlaying(false);
    setFrameIndex(Math.max(0, Math.min(frames.length - 1, next)));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(target.tagName)) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(frameIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(frameIndex + 1); }
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(frames.length - 1); }
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); go(0); }
    if (event.code === 'Space') {
      event.preventDefault();
      if (!reducedMotion) setPlaying((value) => !value);
    }
  };

  return (
    <div className="visualizer" tabIndex={0} onKeyDown={onKeyDown} role="region" aria-label={`${guide.title}交互式算法图解。方向键切换帧，空格播放或暂停，R 重置。`}>
      <div className="viz-topline"><span className="eyebrow">INTERACTIVE FIGURE / {guide.familyZh}</span><span>FRAME {String(frameIndex + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span></div>
      <div className="viz-frame" aria-live="polite" aria-atomic="true">
        <div className="frame-copy"><span>{String(frameIndex + 1).padStart(2, '0')}</span><div><h3>{frame.title}</h3><p>{frame.detail}</p></div></div>
        <FamilyRenderer family={guide.family} state={frame.state} data={guide.viz.data} id={guide.id} />
        <p className="frame-note"><strong>本帧注释</strong>{frame.state.note || '观察图中的当前状态与代码动作。'}</p>
      </div>
      <div className="viz-controls">
        <div className="transport"><button type="button" onClick={() => go(0)} aria-label="重置到第一帧" title="重置（R）"><Icon name="reset" /></button><button type="button" onClick={() => go(frameIndex - 1)} disabled={frameIndex === 0} aria-label="上一帧">上一步</button><button className="play-button" type="button" onClick={() => setPlaying((value) => !value)} disabled={reducedMotion || frames.length < 2} aria-label={playing ? '暂停播放' : '播放全部帧'}>{playing ? <Icon name="pause" /> : <Icon name="play" />}<span>{playing ? '暂停' : '播放'}</span></button><button type="button" onClick={() => go(frameIndex + 1)} disabled={frameIndex === frames.length - 1} aria-label="下一帧">下一步</button></div>
        <label className="speed-control"><span>速度</span><select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option></select></label>
      </div>
      <label className="frame-slider"><span className="sr-only">选择动画帧</span><input type="range" min={0} max={frames.length - 1} value={frameIndex} onChange={(event) => go(Number(event.target.value))} /></label>
      <div className="viz-keyboard"><span><kbd>←</kbd><kbd>→</kbd> 切换帧</span><span><kbd>Space</kbd> 播放 / 暂停</span><span><kbd>R</kbd> 重置</span>{reducedMotion && <span className="reduced-note">已遵循系统“减少动态效果”，自动播放关闭。</span>}</div>
    </div>
  );
}
