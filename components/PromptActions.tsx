'use client';

import { useState } from 'react';

export function PromptActions({prompt,download}:{prompt:string;download:string}){
  const [copied,setCopied]=useState(false);

  const copyPrompt=async()=>{
    try{
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(()=>setCopied(false),1800);
    }catch{
      setCopied(false);
    }
  };

  return <div className="promptActions">
    <button className="button black" type="button" onClick={copyPrompt}>{copied?'Copied ✓':'Copy prompt'}</button>
    {download?<a className="button" href={download} target="_blank" rel="noreferrer">Preview file ↗</a>:null}
    {download?<a className="button" href={download} download>Download file ↓</a>:null}
  </div>;
}
