'use strict';
const rocketArt=new Image(),padArt=new Image();
rocketArt.src='./assets/rocket-parts.svg?v=1';
padArt.src='./assets/launchpad.svg?v=1';
const spriteIndex={pod:0,tank:1,engine:2,boost:3,wing:4,leg:5};

moduleDraw=function(c,k,x,y,z,a=0){
  c.save();c.translate(x,y);c.rotate(a);
  c.shadowColor=P[k].col;c.shadowBlur=Math.max(5,z*.16);
  if(rocketArt.complete&&rocketArt.naturalWidth){
    const sx=spriteIndex[k]*120;
    let w=z*.92,h=z*1.05;
    if(k==='wing'){w=z*.95;h=z*.95}
    if(k==='leg'){w=z*1.08;h=z*1.02}
    c.drawImage(rocketArt,sx,0,120,120,-w/2,-h/2,w,h);
  }else{
    c.fillStyle=P[k].col;c.fillRect(-z*.3,-z*.45,z*.6,z*.9);
  }
  c.restore();
};

rocket=function(x,y,s=1,a=ship.a){
  const cells=[];grid.forEach((row,r)=>row.forEach((k,c)=>k&&cells.push({k,r,c})));
  if(!cells.length)return;
  const minR=Math.min(...cells.map(p=>p.r)),maxR=Math.max(...cells.map(p=>p.r));
  const minC=Math.min(...cells.map(p=>p.c)),maxC=Math.max(...cells.map(p=>p.c));
  const u=20*s,w=(maxC-minC+1)*u,h=(maxR-minR+1)*u;
  ctx.save();ctx.translate(x,y);ctx.rotate(a);
  // Unified dark silhouette makes separate modules read as one spacecraft.
  ctx.fillStyle='#07111dcc';ctx.strokeStyle='#dff8ff88';ctx.lineWidth=Math.max(1.2,s*1.3);
  ctx.beginPath();ctx.roundRect(-w/2+u*.18,-h/2+u*.12,w-u*.36,h-u*.24,u*.25);ctx.fill();ctx.stroke();
  // Center plumbing and structural rail.
  ctx.strokeStyle='#55d9ff66';ctx.lineWidth=Math.max(1,s*1.4);ctx.beginPath();ctx.moveTo(0,-h/2+u*.25);ctx.lineTo(0,h/2-u*.2);ctx.stroke();
  cells.forEach(p=>moduleDraw(ctx,p.k,(p.c-minC+.5)*u-w/2,(p.r-minR+.5)*u-h/2,u*1.02));
  // Small navigation lights.
  ctx.fillStyle='#ff5f70';ctx.beginPath();ctx.arc(-w*.25,-h*.18,2.1*s,0,7);ctx.fill();
  ctx.fillStyle='#65e4ff';ctx.beginPath();ctx.arc(w*.25,-h*.18,2.1*s,0,7);ctx.fill();
  ctx.restore();
};

const originalLaunchDraw=launchDraw;
launchDraw=function(){
  const low=ship.alt<28000;
  if(low&&padArt.complete&&padArt.naturalWidth){
    ctx.drawImage(padArt,0,0,cv.w,cv.h);
    const fade=Math.min(1,ship.alt/28000);
    ctx.fillStyle=`rgba(2,6,17,${fade*.78})`;ctx.fillRect(0,0,cv.w,cv.h);
    star(Math.max(0,(ship.alt-12000)/30000));
    const x=cv.w/2+Math.max(-cv.w*.28,Math.min(cv.w*.28,ship.x*.05));
    const y=cv.h*.64;particlesAt(x,y,.065);rocket(x,y,1.28);
  }else originalLaunchDraw();
};

planet=function(x,y,r,col){
  const g=ctx.createRadialGradient(x-r*.32,y-r*.34,r*.08,x,y,r);
  g.addColorStop(0,'#ffffff');g.addColorStop(.12,col);g.addColorStop(.72,col);g.addColorStop(1,'#07101d');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r*.96,0,7);ctx.clip();
  ctx.globalAlpha=.18;ctx.fillStyle='#07101d';
  for(let i=0;i<9;i++){const ang=i*2.17,rr=r*(.18+(i%4)*.17),cx=x+Math.cos(ang)*rr,cy=y+Math.sin(ang)*rr*.7,cr=r*(.035+(i%3)*.018);ctx.beginPath();ctx.ellipse(cx,cy,cr*1.5,cr,ang,0,7);ctx.fill()}
  ctx.restore();ctx.globalAlpha=1;
};

rocketArt.onload=()=>{drawBuilder();};
padArt.onload=()=>{};
