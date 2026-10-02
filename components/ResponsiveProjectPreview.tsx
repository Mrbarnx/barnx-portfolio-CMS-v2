'use client';

import { useEffect, useRef, useState } from 'react';

type Size = 'phone' | 'tablet' | 'desktop';
const widths: Record<Size, number> = { phone: 390, tablet: 820, desktop: 1440 };

export function ResponsiveProjectPreview({ live, title }: { live: string; title: string }) {
  const [size, setSize] = useState<Size>('desktop');
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mobile, setMobile] = useState(false);
  const launchButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const close = () => {
    setExpanded(false);
    setOpen(false);
    window.setTimeout(() => launchButton.current?.focus(), 0);
  };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 620px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (expanded) setExpanded(false);
      else close();
    };
    document.addEventListener('keydown', onKeyDown);
    if (expanded || mobile) document.body.classList.add('projectPreviewOpen');
    closeButton.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('projectPreviewOpen');
    };
  }, [expanded, mobile, open]);

  if (!open) return <div className="responsivePreviewLauncher">
    <div>
      <span>LIVE PROJECT</span>
      <strong>Explore the working experience</strong>
      <p>Open the project inside Barnx. The original project address stays out of view.</p>
    </div>
    <button ref={launchButton} type="button" onClick={() => setOpen(true)}>View interactive preview</button>
  </div>;

  return <div className={`responsivePreview isOpen${expanded ? ' isExpanded' : ''}`} role={expanded || mobile ? 'dialog' : undefined} aria-modal={expanded || mobile ? true : undefined} aria-label={`${title} interactive preview`}>
    <div className="responsivePreviewToolbar">
      <div>
        <span>INTERACTIVE PREVIEW</span>
        <strong>{title}</strong>
      </div>
      <div className="responsivePreviewActions">
        <div className="previewSizeControls" aria-label="Preview size">
          {(['phone','tablet','desktop'] as Size[]).map(item=><button type="button" className={size===item?'active':''} onClick={()=>setSize(item)} aria-pressed={size===item} key={item}>{item}</button>)}
        </div>
        <button className="previewExpand" type="button" onClick={() => setExpanded(value => !value)}>{expanded ? 'Exit full screen' : 'Full screen'}</button>
        <button className="previewClose" ref={closeButton} type="button" onClick={close} aria-label="Close interactive preview">×</button>
      </div>
    </div>
    <div className={`responsivePreviewStage ${size}`}>
      <iframe style={{maxWidth:widths[size]}} src={live} title={`${title} interactive experience`} sandbox="allow-forms allow-scripts allow-same-origin allow-popups" referrerPolicy="no-referrer"/>
    </div>
  </div>;
}
