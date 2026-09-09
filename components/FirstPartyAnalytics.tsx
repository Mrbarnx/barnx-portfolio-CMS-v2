'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const uuid = () => crypto.randomUUID();
const sessionTimeoutMs = 30 * 60 * 1000;

function persistentId(key: string) {
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = uuid();
  localStorage.setItem(key, created);
  return created;
}

function activeSessionId() {
  const now = Date.now();
  const previousId = localStorage.getItem('barnx_session');
  const lastActive = Number(localStorage.getItem('barnx_session_last_active') ?? 0);
  const sessionId = previousId && now - lastActive < sessionTimeoutMs ? previousId : uuid();
  localStorage.setItem('barnx_session', sessionId);
  localStorage.setItem('barnx_session_last_active', String(now));
  return sessionId;
}

export function FirstPartyAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.doNotTrack === '1' || pathname.startsWith('/admin')) return;
    const visitorId = persistentId('barnx_visitor');
    let referrerHost = '';
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch { referrerHost = ''; }
    const send = (eventName: string, target?: string) => fetch('/api/analytics', {
      method: 'POST', headers: { 'content-type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ visitorId, sessionId: activeSessionId(), eventName, pathname, target, referrerHost }),
    }).catch(() => undefined);
    send(pathname.startsWith('/projects/') ? 'project_open' : pathname.startsWith('/barnx-studio/') ? 'resource_open' : 'page_view');

    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (anchor.hasAttribute('download') || /\.(pdf|md|docx|zip|json)$/i.test(href)) send('download', href);
      else if (/^https?:\/\//.test(href) && !href.startsWith(location.origin)) send('external_click', href);
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, [pathname]);

  return null;
}
