import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBooking} from '../js/business.js';
const valid={name:'Test Customer',phone:'(903) 879-2012',email:'test@example.com',vehicle:'Ford F150',address:'Fairfield Texas',service:'full',date:'2026-10-20',requestId:'12345678-1234-4234-8234-123456789abc'};
test('normalizes phone and accepts optional email and date',()=>{assert.equal(validateBooking(valid,'2026-10-07').phone,'9038792012');assert.doesNotThrow(()=>validateBooking({...valid,email:'',date:''},'2026-10-07'));});
for(const [field,value] of [['name',{}],['phone','9035551234\r\nBcc:test'],['email','bad'],['service','premium'],['date','2026-02-30'],['date','2026-10-01'],['requests','x'.repeat(2001)],['requestId','not-a-uuid'],['address','']])test(`rejects invalid ${field}`,()=>assert.throws(()=>validateBooking({...valid,[field]:value},'2026-10-07')));
