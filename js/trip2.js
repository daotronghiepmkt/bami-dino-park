/* Truck v2: richer scenes, jump-the-obstacles trip runner, best scores */
let RN=null;
function rTruck(m){
  if(!P.dinos.length) return emptyState(m,'You have no dinos yet!');
  if(T.phase==='run'||T.phase==='driving') T.phase='load';
  T.loaded=T.loaded.filter(id=>getD(id)); if(!DEST[T.at]) T.at='park';
  if(!T.type){ m.innerHTML=`<h2>Pick a truck!</h2><div class="grid" style="grid-template-columns:1fr 1fr;max-width:640px;margin:0 auto">
    <button class="tile" onclick="pickTruck('monster')">${truckSVG('monster')}<b>Monster Truck</b></button><button class="tile" onclick="pickTruck('tow')">${truckSVG('tow')}<b>Tow Truck</b></button></div>${tripBoard()}`; say('Pick a truck!'); return }
  const seats=T.type==='tow'?[[6,48],[27,48],[48,48]]:[[0,70],[17,70],[34,70],[51,70]], sw=T.type==='tow'?25:21;
  const field=P.dinos.filter(d=>!T.loaded.includes(d.id)).slice(0,10), dst=DEST[T.at], L=T.last;
  m.innerHTML=`<div class="tscene" id="tscene">${sceneSVG(T.at)}
    ${T.phase==='load'?field.map((d,i)=>`<div class="fieldd" style="left:${4+(i%5)*19}%;top:${44+Math.floor(i/5)*20}%" onclick="catchD('${d.id}')">${dinoSVG(d)}</div>`).join(''):''}
    <div class="truck ${T.phase==='arrived'?'drivein':''}" id="truck">${truckSVG(T.type)}${T.loaded.map((id,i)=>`<div class="seat ${i===T.loaded.length-1&&T.justIn?'hopin':''}" style="left:${seats[i][0]}%;bottom:${seats[i][1]}%;width:${sw}%">${dinoSVG(getD(id))}</div>`).join('')}${T.type==='tow'?`<div class="towdriver" onclick="tapDriver()">${kidSVG(P,{head:1})}</div>`:`<div class="driver" onclick="tapDriver()">${kidSVG(P,{seat:1})}</div>`}</div></div>
   ${T.phase==='arrived'&&L?`<div class="tres"><div class="tres-t">${L.ok?'🎉':'🚧'} ${dst[0]} ${dst[1]}!</div><div class="tres-r"><span>🏁 <b>${L.score}</b></span><span>🪙 +${L.earned}</span><span>⭐ +1</span></div>${L.isBest?'<div class="newbest">🏆 NEW BEST!</div>':''}</div>`:''}
   <div class="hint">${T.phase==='load'?(T.loaded.length?`🚚 ${T.loaded.length} / ${seats.length} dinos. Where to go? (You are at the ${dst[1]})`:`👆 Tap a dino to put it on the truck! (You are at the ${dst[1]})`):`🎉 We are at the ${dst[1]}!`}</div>
   <div class="row" style="padding-bottom:12px">${T.phase==='load'&&T.loaded.length?Object.entries(DEST).filter(([k])=>k!==T.at).map(([k,v])=>`<button class="brick" style="--c:${k==='park'?'#00A84F':'#0057A6'}" onclick="drive('${k}')">${v[0]} ${v[1]}</button>`).join(''):''}
   ${T.phase==='arrived'?`<button class="brick" style="--c:#00A84F;font-size:22px" onclick="unload()">🚪 Get out!</button><button class="brick" style="--c:#0057A6" onclick="T.phase='load';render()">🚚 Drive on</button>`:''}
   ${T.phase==='load'?`<button class="brick" style="--c:#9BA19D" onclick="T.type=null;T.loaded=[];render()">🔄 Other truck</button>`:''}</div>${tripBoard()}`;
  T.justIn=false;
}
function tripBoard(){
  const L=(P.trips||[]).slice(0,5); if(!L.length) return '';
  const best=Object.keys(DEST).map(k=>{const s=P.trips.filter(x=>x.dest===k).map(x=>x.score); return s.length?`<span>${DEST[k][0]} ${Math.max(...s)}</span>`:''}).join('');
  return `<div class="board"><h3>🏁 Best trips</h3>${L.map((x,i)=>`<div class="bl"><span>${['🥇','🥈','🥉','4.','5.'][i]} ${DEST[x.dest]?DEST[x.dest][0]+' '+DEST[x.dest][1]:''} ${x.truck==='tow'?'🚒':'🛻'}</span><b>${x.score}</b></div>`).join('')}<div class="bests">${best}</div></div>`;
}
function unload(){ SFX.boing(); say(`Everybody out! Let's play at the ${DEST[T.at][1]}!`); T.loaded=[]; T.phase='load'; render() }
function nestSVG(svg,x,y,w,h){ return svg.replace(/^<svg /,`<svg x="${x}" y="${y}" width="${w}" height="${h}" `) }
function truckImgURL(){
  const tow=T.type==='tow',tH=tow?110:120,top=150-tH,seats=tow?[[6,48],[27,48],[48,48]]:[[0,70],[17,70],[34,70],[51,70]],sw=tow?25:21;
  let s=nestSVG(truckSVG(T.type),0,top,200,tH);
  T.loaded.forEach((id,i)=>{ const d=getD(id); if(!d) return; const w=sw*2*(d.size==='baby'?.7:1),h=w*112/132,yb=top+tH*(1-seats[i][1]/100); s+=nestSVG(dinoSVG(d),seats[i][0]*2+(sw*2-w)/2,yb-h,w,h) });
  if(tow){ const w=28,h=w*48/50; s+=nestSVG(kidSVG(P,{head:1}),153,top+tH*.48-h,w,h) } else { const w=34,h=w*82/60; s+=nestSVG(kidSVG(P,{seat:1}),142,top+tH*.42-h,w,h) }
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="400" height="300">${s}</svg>`);
}
function drive(k){
  if(T.phase!=='load'||!T.loaded.length) return; T.dest=k; T.phase='run';
  const m=$('#main'); m.innerHTML=`<div class="runwrap" id="rw"><canvas id="rc"></canvas><div class="rhud"><span id="rH">❤️❤️❤️</span><span id="rS">🏁 0</span><span id="rC">🪙 0</span></div><div class="rprog"><i id="rP"></i><b>${DEST[k][0]}</b><em id="rTk">🚚</em></div><div class="rtip" id="rT">👆 Tap to jump!</div></div>
   <div class="row"><button class="brick" style="--c:#00A84F;font-size:30px;flex:1;max-width:520px;padding:18px" onpointerdown="event.preventDefault();rJump()">⬆️ JUMP!</button></div><p class="center" style="font-size:15px;margin:2px 8px 16px">Jump over things! Grab the 🪙 coins! Tap twice for a double jump.</p>`;
  const rw=$('#rw'),cv=$('#rc'),dpr=Math.min(2,window.devicePixelRatio||1),W=rw.clientWidth,H=rw.clientHeight; cv.width=W*dpr; cv.height=H*dpr; const ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
  rw.addEventListener('pointerdown',e=>{e.preventDefault();rJump()});
  const img=new Image(); img.src=truckImgURL(); const tw=Math.min(W*.36,240);
  RN={k,W,H,ctx,img,tw,th:tw*.75,x:W*.05,y:0,vy:0,jumps:0,t:0,dur:40,off:0,obs:[],coins:[],dust:[],hearts:3,inv:0,score:0,coinN:0,jumped:0,so:2.2,sc:1.2,over:false,thm:TH[k]||TH.park,started:false,last:0,raf:0,flakes:Array.from({length:30},()=>({x:Math.random()*W,y:Math.random()*H,v:20+Math.random()*30}))};
  SFX.honk(); setTimeout(SFX.vroom,300); say(`Beep beep! ${P.name} drives to the ${DEST[k][1]}! Tap to jump!`);
  setTimeout(()=>{ if(!RN) return; RN.started=true; const tip=$('#rT'); if(tip) tip.textContent='' },1800);
  RN.raf=requestAnimationFrame(rStep);
}
function rJump(){ const Q=RN; if(!Q||Q.over) return; if(!Q.started){Q.started=true; const tip=$('#rT'); if(tip) tip.textContent=''} if(Q.jumps<2){ Q.vy=Q.H*1.25*(Q.jumps?.8:1); Q.jumps++; SFX.jump() } }
function rStep(t){ const Q=RN; if(!Q||Q.over) return; const dt=Math.min(.05,(t-(Q.last||t))/1000); Q.last=t; if(Q.started) rUpdate(dt); if(RN) rDraw(); if(RN&&!RN.over) RN.raf=requestAnimationFrame(rStep) }
function rUpdate(dt){
  const Q=RN,{W,H}=Q,gy=H*.84,g=H*2.4;
  Q.t+=dt; const prog=Math.min(1,Q.t/Q.dur),spd=W*(.32+.2*prog); Q.off+=spd*dt;
  if(Q.y>0||Q.vy>0){ Q.vy-=g*dt; Q.y+=Q.vy*dt; if(Q.y<=0){Q.y=0;Q.vy=0;Q.jumps=0; for(let i=0;i<5;i++) Q.dust.push({x:Q.x+Q.tw*.3+Math.random()*Q.tw*.5,y:gy,vx:-40-Math.random()*60,vy:-20-Math.random()*40,l:.5})} }
  if(Q.inv>0) Q.inv-=dt;
  if(Q.t<Q.dur-2.5){
    Q.so-=dt; if(Q.so<=0){ Q.obs.push({x:W+40,e:rnd(Q.thm.ob),s:H*.095,pass:0,hit:0}); Q.so=1.75+Math.random()*1.2-prog*.4 }
    Q.sc-=dt; if(Q.sc<=0){ const n=3+Math.floor(Math.random()*3),hh=H*(.08+Math.random()*.24); for(let i=0;i<n;i++) Q.coins.push({x:W+30+i*34,h:hh+Math.sin(i/(n-1)*Math.PI)*H*.06,got:0}); Q.sc=1.5+Math.random()*1.2 }
  }
  for(const o of Q.obs) o.x-=spd*dt; for(const c of Q.coins) c.x-=spd*dt;
  for(const d of Q.dust){d.x+=d.vx*dt;d.y+=d.vy*dt;d.l-=dt}
  Q.obs=Q.obs.filter(o=>o.x>-60); Q.coins=Q.coins.filter(c=>c.x>-40&&!c.got); Q.dust=Q.dust.filter(d=>d.l>0);
  const tx1=Q.x+Q.tw*.22,tx2=Q.x+Q.tw*.8,tb=gy-Q.y,ttop=tb-Q.th*.8;
  for(const o of Q.obs){
    const ox1=o.x-o.s*.25,ox2=o.x+o.s*.25,otop=gy-o.s*.62;
    if(!o.hit&&Q.inv<=0&&ox2>tx1&&ox1<tx2&&tb>otop){ o.hit=1; Q.hearts--; Q.inv=1.5; SFX.bonk(); anim($('#rw'),'shake',400); $('#rH').textContent='❤️'.repeat(Math.max(0,Q.hearts))+'🤍'.repeat(3-Math.max(0,Q.hearts)); say(Q.hearts>0?'Bump! Careful!':''); if(Q.hearts<=0){ rFinish(false); return } }
    if(!o.pass&&o.x<tx1-o.s*.4){ o.pass=1; if(!o.hit){Q.jumped++;Q.score+=5} }
  }
  for(const c of Q.coins){ const cy=gy-c.h; if(c.x>tx1&&c.x<tx2&&cy>ttop-12&&cy<tb){ c.got=1; Q.coinN++; Q.score+=10; SFX.coin() } }
  if(Q.thm===TH.snow) for(const f of Q.flakes){ f.y+=f.v*dt; f.x-=spd*dt*.2; if(f.y>H){f.y=-5;f.x=Math.random()*W} if(f.x<0) f.x+=W }
  $('#rS').textContent='🏁 '+(Q.score+Math.floor(Q.t*5)); $('#rC').textContent='🪙 '+Q.coinN; $('#rP').style.width=(prog*100)+'%'; $('#rTk').style.left=(prog*100)+'%';
  if(Q.t>=Q.dur) rFinish(true);
}
function rDraw(){
  const Q=RN,{ctx,W,H}=Q,th=Q.thm,gy=H*.84,k=Q.k;
  const gr=ctx.createLinearGradient(0,0,0,gy); gr.addColorStop(0,th.sky[0]); gr.addColorStop(1,th.sky[1]); ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
  const circ=(x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()};
  if(th.sun){ circ(W*.84,H*.15,H*.1,'rgba(255,228,92,.3)'); circ(W*.84,H*.15,H*.065,'#FFE45C') }
  const peaks=(col,sp,hf,wd,cap)=>{ const o=(Q.off*sp)%wd; ctx.fillStyle=col; for(let x=-o-wd;x<W+wd;x+=wd){ ctx.beginPath(); ctx.moveTo(x,gy); ctx.lineTo(x+wd*.5,gy-H*hf); ctx.lineTo(x+wd,gy); ctx.fill(); if(cap){ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(x+wd*.5,gy-H*hf);ctx.lineTo(x+wd*.38,gy-H*hf*.75);ctx.lineTo(x+wd*.62,gy-H*hf*.75);ctx.fill();ctx.fillStyle=col} } };
  if(k==='beach'){ ctx.fillStyle=th.far; ctx.fillRect(0,gy-H*.3,W,H*.3); ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=2; for(let r=0;r<3;r++){ ctx.beginPath(); for(let x=0;x<=W;x+=10){ const y=gy-H*(.25-r*.07)+Math.sin((x+Q.off*.2+r*40)/20)*3; x?ctx.lineTo(x,y):ctx.moveTo(x,y) } ctx.stroke() } }
  else if(k==='volcano'){ const vx=W*.7-(Q.off*.04)%(W*1.6)+W*.5; ctx.fillStyle=th.far; ctx.beginPath(); ctx.moveTo(vx-W*.35,gy); ctx.lineTo(vx-W*.06,gy-H*.5); ctx.lineTo(vx+W*.06,gy-H*.5); ctx.lineTo(vx+W*.35,gy); ctx.fill(); ctx.fillStyle='#ff5a1f'; ctx.fillRect(vx-W*.06,gy-H*.5,W*.12,H*.03); for(let i=0;i<3;i++){ const p=((Q.t*.4+i/3)%1); circ(vx+Math.sin(i)*10,gy-H*.52-p*H*.3,8+p*24,`rgba(150,130,120,${.7-p*.7})`) } peaks('#8a5a3e',.15,.18,W*.4) }
  else if(k==='snow'){ peaks(th.far,.1,.42,W*.55,1); peaks('#dfe9f4',.2,.24,W*.4,1) }
  else if(k==='jungle'){ ctx.fillStyle=th.far; const o=(Q.off*.15)%80; for(let x=-o-80;x<W+80;x+=80){ circ(x,gy-H*.18,H*.2,th.far) } ctx.strokeStyle='#2d9a3e'; ctx.lineWidth=3; const ov=(Q.off*.6)%120; for(let x=-ov;x<W;x+=120){ ctx.beginPath(); ctx.moveTo(x,0); ctx.quadraticCurveTo(x+10,H*.15,x,H*.25+Math.sin(x)*10); ctx.stroke() } }
  else { peaks(th.far,.1,.35,W*.5) }
  ctx.fillStyle=th.mid; const ho=(Q.off*.3)%(W*.6); for(let x=-ho-W*.3;x<W+W*.6;x+=W*.6){ ctx.beginPath(); ctx.ellipse(x,gy,W*.32,H*.13,0,Math.PI,0); ctx.fill() }
  ctx.font=`${Math.round(H*.085)}px ${EMO}`; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.globalAlpha=.75; const dO=(Q.off*.35)%(W*.45); th.deco.forEach((e,i)=>{ for(let x=-dO+i*W*.15;x<W+W*.45;x+=W*.45) ctx.fillText(e,x,gy-H*.09) }); ctx.globalAlpha=1;
  ctx.fillStyle=th.gr; ctx.fillRect(0,gy,W,H-gy); ctx.fillStyle=th.dk; ctx.fillRect(0,gy,W,4); const so=Q.off%24; ctx.globalAlpha=.35; for(let x=-so;x<W+24;x+=24){ circ(x,gy+14,5,th.dk); circ(x+12,gy+34,5,th.dk) } ctx.globalAlpha=1;
  for(const c of Q.coins){ const cy=gy-c.h,r=H*.03; circ(c.x,cy,r,'#b38f00'); circ(c.x,cy,r*.82,'#FFCD03'); ctx.fillStyle='#fff8c8'; ctx.fillRect(c.x-r*.15,cy-r*.5,r*.3,r) }
  ctx.font=`${Math.round(H*.095)}px ${EMO}`; for(const o of Q.obs){ ctx.globalAlpha=o.hit?.4:1; ctx.fillStyle='rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(o.x,gy+4,o.s*.42,o.s*.1,0,0,Math.PI*2); ctx.fill(); if(!o.hit&&o.x<W*.85&&o.x>Q.x+Q.tw){ ctx.fillStyle='rgba(227,0,11,.85)'; ctx.font=`bold ${Math.round(H*.05)}px sans-serif`; ctx.fillText('!',o.x,gy-o.s*.95); ctx.font=`${Math.round(H*.095)}px ${EMO}` } ctx.fillText(o.e,o.x,gy+o.s*.08) } ctx.globalAlpha=1;
  for(const d of Q.dust) circ(d.x,d.y,4*d.l*2,`rgba(255,255,255,${d.l})`);
  if(!(Q.inv>0&&Math.floor(Q.inv*10)%2)&&Q.img.complete){ const bob=Q.y>0?0:Math.sin(Q.t*28)*1.5, tilt=Q.y>0?-.06:0; ctx.save(); ctx.translate(Q.x+Q.tw/2,gy-Q.y-Q.th/2+bob); ctx.rotate(tilt); ctx.drawImage(Q.img,-Q.tw/2,-Q.th/2,Q.tw,Q.th); ctx.restore() }
  if(th===TH.snow){ ctx.fillStyle='#fff'; for(const f of Q.flakes){ ctx.beginPath(); ctx.arc(f.x,f.y,2.5,0,Math.PI*2); ctx.fill() } }
}
function rFinish(ok){
  const Q=RN; if(!Q||Q.over) return; Q.over=true; cancelAnimationFrame(Q.raf); const k=Q.k;
  const score=Q.score+Math.floor(Q.t*5)+(ok?50:0)+Math.max(0,Q.hearts)*20, earned=Q.coinN+Math.round(score/25);
  const prevBest=Math.max(0,...(P.trips||[]).filter(x=>x.dest===k).map(x=>x.score)), isBest=score>prevBest;
  P.trips.push({dest:k,score,truck:T.type,date:Date.now()}); P.trips.sort((a,b)=>b.score-a.score); P.trips=P.trips.slice(0,20);
  T.loaded.forEach(id=>{ const d=getD(id); if(d){ ensureDino(d); d.st.trips++; d.st.tripBest=Math.max(d.st.tripBest,score); d.happy=clamp(d.happy+10) } });
  RN=null; T.at=k; T.phase='arrived'; T.last={score,earned,isBest,ok}; save();
  if(ok){ SFX.fanfare(); say(`We are at the ${DEST[k][1]}! Hooray! ${score} points!`) } else { SFX.honk(); say(`Bumpy road! But we made it to the ${DEST[k][1]}!`) }
  render(); confetti(); addCoins(earned); addStar(1); T.loaded.forEach(id=>checkVIP(getD(id)));
}
