export function quoteHref(service?:string){const params=new URLSearchParams();if(service)params.set('service',service);return `/quote${params.size?`?${params.toString()}`:''}`}
