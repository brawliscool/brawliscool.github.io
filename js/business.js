export const business = Object.freeze({name:'Nova Detailing', phone:'(903) 879-2012', email:'ajmobiledetailingtx@gmail.com', location:'Fairfield, TX 75840', hours:'Mon–Sat: 8:00 AM–6:00 PM', packages:[{id:'refresh',name:'Nova Refresh Detail',price:90},{id:'full',name:'Nova Full Detail',price:130},{id:'complete',name:'Nova Complete Detail',price:180}]});
export function validateBooking(input, today = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date())) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid submission.');
  const limits={name:80,phone:30,email:254,vehicle:120,address:240,service:20,date:10,requests:2000,website:200};
  const result={};
  for (const [key,max] of Object.entries(limits)) {
    if (input[key] !== undefined && typeof input[key] !== 'string') throw new Error('Invalid field type.');
    result[key]=(input[key] || '').trim();
    if(result[key].length>max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result[key])) throw new Error('Invalid field length or characters.');
  }
  if(result.name.length<2 || /[\r\n]/.test(result.name)) throw new Error('Enter your full name.');
  if(!/^[+\d\s().-]+$/.test(result.phone)) throw new Error('Enter a valid US phone number.');
  result.phone=result.phone.replace(/\D/g,'').replace(/^1(?=\d{10}$)/,'');
  if(!/^[2-9]\d{2}[2-9]\d{6}$/.test(result.phone)) throw new Error('Enter a valid US phone number.');
  if(result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error('Enter a valid email address.');
  if(result.vehicle.length<2 || result.address.length<5) throw new Error('Enter your vehicle and service address.');
  if(!business.packages.some(p=>p.id===result.service)) throw new Error('Choose a detailing package.');
  if(result.date && (!/^\d{4}-\d{2}-\d{2}$/.test(result.date) || !Number.isFinite(Date.parse(result.date)) || new Date(result.date).toISOString().slice(0,10)!==result.date || result.date<today || result.date>`${Number(today.slice(0,4))+1}${today.slice(4)}`)) throw new Error('Choose a date within the next year.');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId || '')) throw new Error('Invalid request ID.');
  return {...result,request_id:input.requestId};
}
