'use client';

export function ConfirmDeleteButton({action,label,className}:{action:(data:FormData)=>Promise<void>;label:string;className?:string}) {
  return <button
    className={className}
    type="submit"
    formAction={action}
    formNoValidate
    onClick={(event)=>{if(!window.confirm(`Delete ${label}? This cannot be undone.`))event.preventDefault();}}
  >Delete {label}</button>;
}
