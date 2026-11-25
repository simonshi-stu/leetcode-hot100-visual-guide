import type { ReactNode } from 'react';

type IconName = 'arrow' | 'search' | 'play' | 'pause' | 'reset' | 'copy' | 'check' | 'external' | 'focus' | 'chevron' | 'download';

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    reset: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>,
    copy: <><rect x="8" y="8" width="11" height="12" rx="1" /><path d="M16 8V4H5v12h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6H5V6h6" /></>,
    focus: <><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /><circle cx="12" cy="12" r="3" /></>,
    chevron: <path d="m8 5 7 7-7 7" />,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 20h16" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
