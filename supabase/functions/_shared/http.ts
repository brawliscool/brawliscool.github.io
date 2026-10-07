export const origins = ['https://ajdetailing.store','https://www.ajdetailing.store','https://brawliscool.github.io'];
export function response(req: Request, body: unknown, status=200, extra: Record<string,string>={}) {
 const origin=req.headers.get('origin') || '';
 return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin',...(origins.includes(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS',...extra}});
}
export async function payload(req: Request) {
 if(!origins.includes(req.headers.get('origin') || '')) throw new Error('origin');
 if(!req.headers.get('content-type')?.startsWith('application/json')) throw new Error('content');
 const reader=req.body?.getReader(); if(!reader) throw new Error('body');
 const chunks: Uint8Array[]=[]; let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();throw new Error('size');}chunks.push(value);}
 const bytes=new Uint8Array(size); let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
