'use client';

import { useState } from 'react';

type Size = 'phone' | 'tablet' | 'desktop';
const widths: Record<Size, number> = { phone: 390, tablet: 820, desktop: 1440 };

export function ResponsiveProjectPreview({ live, title }: { live: string; title: string }) {
  const [size, setSize] = useState<Size>('desktop');
  return <div className="responsivePreview">
    <div className="previewSizeControls" aria-label="Preview size">
      {(['phone','tablet','desktop'] as Size[]).map(item=><button type="button" className={size===item?'active':''} onClick={()=>setSize(item)} aria-pressed={size===item} key={item}>{item}</button>)}
    </div>
    <div className={`responsivePreviewStage ${size}`}>
      <iframe style={{maxWidth:widths[size]}} src={live} title={`${title} interactive experience`} sandbox="allow-forms allow-scripts allow-same-origin allow-popups" referrerPolicy="no-referrer"/>
    </div>
  </div>;
}
