/* Forest Guard: 3-lane defense. Grabby Bots want the dino eggs; dinos send them home (no one gets hurt). */
let GD=null,gRaf=null; const GT={team:[],lv:0};
const BOT={bot:{hp:60,spd:3.4,dps:9},zoom:{hp:40,spd:6,dps:6},big:{hp:170,spd:2.1,dps:15}};
const GX=[21,39,57], GCOST=50, LANE=33.333;
function botSVG(t){
  const c=t==='big'?'#7a7f87':t==='zoom'?'#E3000B':'#F57D20',dk=shade(c,-.35); let s='';
  s+=`<line x1="12" y1="40" x2="2" y2="14" stroke="#8B5A2B" stroke-width="2.5"/><circle cx="2" cy="10" r="8" fill="rgba(255,255,255,.35)" stroke="#8B5A2B" stroke-width="1.5"/><path d="M-6 10 H10 M2 2 V18 M-3 4 L7 16 M-3 16 L7 4" stroke="#8B5A2B" stroke-width=".7"/>`;
  if(t==='big') s+=R(4,24,52,28,c,dk,4)+R(-6,34,10,20,'#FFCD03','#b38f00',2)+R(14,6,32,20,'#cfd5db','#7a7f87',4)+R(17,11,26,8,'#1d2b5a',null,3)+Cc(25,15,2.4,'#7CF')+Cc(35,15,2.4,'#7CF')+R(4,52,52,10,'#2A2A2A',null,5)+[10,22,34,46].map(x=>Cc(x+2,57,4,'#555')).join('');
  else { s+=R(14,26,32,26,c,dk,4)+R(18,8,24,18,'#cfd5db','#7a7f87',4)+R(21,13,18,7,'#1d2b5a',null,3)+Cc(26,16.5,2,'#7CF')+Cc(34,16.5,2,'#7CF')+`<line x1="30" y1="8" x2="30" y2="2" stroke="#555" stroke-width="1.5"/>`+Cc(30,2,2.5,'#E3000B')+R(22,34,16,8,shade(c,.35),null,2);
    s+=t==='zoom'?Cc(30,58,8,'#2A2A2A')+Cc(30,58,3,'#ccc')+`<path d="M50 30 H62 M48 40 H62 M50 50 H62" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>`:Cc(21,57,7,'#2A2A2A')+Cc(39,57,7,'#2A2A2A')+Cc(21,57,2.5,'#ccc')+Cc(39,57,2.5,'#ccc') }
  s+=`<path d="M25 22 Q30 25 35 22" stroke="#7CF" stroke-width="1.5" fill="none"/>`;
  return `<svg class="bsvg" viewBox="-8 0 72 66" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}
function rGuard(m){
  if(!P.dinos.length) return emptyState(m,'You have no dinos yet!');
  P.dinos.forEach(ensureDino);
  GT.team=GT.team.filter(id=>getD(id)).slice(0,5); if(!GT.team.length) GT.team=P.dinos.slice(0,5).map(d=>d.id);
  if(!GT.lv||GT.lv>P.guard.lv) GT.lv=P.guard.lv;
  const team=GT.team.map(getD), lvs=Array.from({length:P.guard.lv},(_,i)=>i+1).slice(-8);
  m.innerHTML=`<div class="ghero">${sceneSVG('jungle')}<div class="ghero-in"><div class="ghero-t">🌲 Forest Guard</div><div class="ghero-s">The Grabby Bots want the dino eggs! 🥚<br>Your dinos send them home.</div><div class="ghero-bots"><div>${botSVG('bot')}</div><div>${botSVG('zoom')}</div><div>${botSVG('big')}</div></div></div></div>
   <h3 class="gh">1️⃣ Pick your team (${team.length}/5)</h3>
   <div class="fdinos">${P.dinos.map(d=>`<div class="fd ${GT.team.includes(d.id)?'sel':''}" onclick="gTeam('${d.id}')">${dinoSVG(d)}<span>${esc(d.name)}</span><span class="mini">⭐${d.glv+1}</span></div>`).join('')}</div>
   <h3 class="gh">2️⃣ Power up with 🪙 coins <small>(you have 🪙 ${P.coins})</small></h3>
   <div class="ups">${team.map(d=>`<div class="up"><div class="upd">${dinoSVG(d)}</div><div class="upi"><b>${esc(d.name)}</b> ⭐ Lv ${d.glv+1}${HERB.includes(d.species)?' · 🍃 makes leaves':''}<div class="skrow">${skIcons(d)}</div></div>${d.glv>=5?'<span class="max">MAX</span>':`<button class="brick" style="--c:#b38f00;font-size:15px;padding:8px 10px" onclick="gUp('${d.id}')">⬆️ 🪙${40*(d.glv+1)}</button>`}</div>`).join('')}
    <div class="up"><div class="upd" style="font-size:40px;text-align:center">🍃</div><div class="upi"><b>Start leaves</b> ${100+50*P.guard.leafUp}</div>${P.guard.leafUp>=3?'<span class="max">MAX</span>':`<button class="brick" style="--c:#b38f00;font-size:15px;padding:8px 10px" onclick="gLeafUp()">⬆️ 🪙${80*(P.guard.leafUp+1)}</button>`}</div></div>
   <h3 class="gh">3️⃣ Pick a level <small>(best: ${P.guard.best||0})</small></h3>
   <div class="chips">${lvs.map(l=>`<button class="brick ${GT.lv===l?'on':''}" style="--c:${l===P.guard.lv?'#E3000B':'#0057A6'};min-width:54px" onclick="GT.lv=${l};SFX.click();say('Level ${l}');keepScroll(()=>render())">${l}</button>`).join('')}</div>
   <div class="row" style="padding:12px 8px 26px"><button class="brick" style="--c:#00733a;font-size:28px;padding:16px 34px" onclick="startGuard()">🌲 START!</button></div>`;
}
function gTeam(id){ const i=GT.team.indexOf(id),d=getD(id); if(i>=0) GT.team.splice(i,1); else { if(GT.team.length>=5){ say('Your team is full! Five dinos.'); SFX.count(); return } GT.team.push(id); SFX.roar(d); say(`${d.name} joins the team!`) } keepScroll(()=>render()) }
function gUp(id){ const d=getD(id),c=40*(d.glv+1); if(d.glv>=5) return; if(P.coins<c){ say('You need more coins! Play battles, trips and Forest Guard to get coins!'); SFX.yuck(); return } P.coins-=c; d.glv++; save(); updateHeader(); SFX.star(); confetti(); say(`${d.name} is stronger! Level ${d.glv+1}!`); keepScroll(()=>render()) }
function gLeafUp(){ const c=80*(P.guard.leafUp+1); if(P.guard.leafUp>=3) return; if(P.coins<c){ say('You need more coins!'); SFX.yuck(); return } P.coins-=c; P.guard.leafUp++; save(); updateHeader(); SFX.star(); say('More leaves to start!'); keepScroll(()=>render()) }

function startGuard(){
  const team=GT.team.map(getD).filter(Boolean); if(!team.length) return; stopLoops(); screen='guard'; closeCard();
  const lv=GT.lv||P.guard.lv;
  GD={lv,leaves:100+50*P.guard.leafUp,t:0,units:[],bots:[],proj:[],drops:[],cards:team.map(d=>({d,cd:0,sp:0,unit:null})),sel:null,spawned:0,total:5+3*lv,next:8,eggs:3,mama:[1,1,1],sent:0,coins:0,over:false,paused:false,last:0,leafT:5,wave:false,ck:'',cardT:0,nid:0};
  $('#main').innerHTML=`<div class="ghud"><span class="gl">🍃 <b id="gLv">${GD.leaves}</b></span><div class="gprog"><i id="gP"></i><b>🚩</b></div><span id="gE">🥚🥚🥚</span></div>
   <div class="gfield" id="gf">${[0,1,2].map(r=>`<div class="glane ${r%2?'alt':''}" style="top:${r*LANE}%"></div><div class="gnest" style="top:${r*LANE}%"><span>🪺</span><span class="mama" id="mm${r}">🦕</span></div>${GX.map((x,c)=>`<div class="gcell" id="gc${r}_${c}" style="left:${x-9}%;top:${r*LANE}%" onpointerdown="gPlace(${r},${c})"></div>`).join('')}`).join('')}<div class="gmsg" id="gM"></div></div>
   <div class="gcards" id="gcs"></div><p class="center" style="margin:4px 8px 18px;font-size:15px">👆 Tap a dino card, then tap a spot. 🍃 Leaf-eaters make leaves. Tap falling 🍃!</p>`;
  gCards(true); gHud(); gMsg(`Level ${lv}`); say('Forest Guard! Tap a dino card, then tap a spot!');
  gRaf=requestAnimationFrame(gStep);
}
function gMsg(t){ const e=$('#gM'); if(!e) return; e.textContent=t; anim(e,'show',2200) }
function gHud(){ if(!GD||!$('#gLv')) return; $('#gLv').textContent=Math.floor(GD.leaves); $('#gP').style.width=(GD.spawned/GD.total*100)+'%'; $('#gE').textContent='🥚'.repeat(Math.max(0,GD.eggs))+'🪹'.repeat(3-Math.max(0,GD.eggs)) }
function gCards(force){
  const G=GD,box=$('#gcs'); if(!G||!box) return;
  const key=G.cards.map((c,i)=>[G.sel===i,!!c.unit,Math.ceil(c.cd),Math.floor(c.sp/10),G.leaves>=GCOST,G.leaves>=100].join()).join('|');
  if(!force&&key===G.ck) return; G.ck=key;
  box.innerHTML=G.cards.map((c,i)=>{ const off=!c.unit&&(c.cd>0||G.leaves<GCOST); return `<div class="gcard ${G.sel===i?'sel':''} ${off?'off':''} ${c.unit?'onf':''}" onpointerdown="gSelect(${i})">${dinoSVG(c.d)}<div class="nm">${esc(c.d.name)}</div><div class="cost">${c.unit?'🟢 On field':'🍃 '+GCOST}</div><div class="gsp"><i style="width:${c.sp}%"></i></div>${c.cd>0?`<div class="cdv">${Math.ceil(c.cd)}</div>`:''}${c.unit&&c.sp>=100?`<button class="gsbtn" onpointerdown="event.stopPropagation();gSpecial(${i})">✨<br>${skS(c.d.sk.sp).e}</button>`:''}${c.unit&&c.sp<100&&G.leaves>=100?`<button class="gbuy" onpointerdown="event.stopPropagation();gBuy(${i})">⚡100🍃</button>`:''}</div>` }).join('');
}
function gSelect(i){ const G=GD; if(!G||G.over) return; const c=G.cards[i],d=c.d;
  if(c.unit){ say(`${d.name} is on the field!`); return } if(c.cd>0){ say(`${d.name} is resting. Wait!`); return } if(G.leaves<GCOST){ say('Need more leaves! Tap the falling leaves!'); SFX.count(); return }
  G.sel=G.sel===i?null:i; $('#gf').classList.toggle('placing',G.sel!==null); SFX.pop(); if(G.sel!==null) say(`${d.name}! Tap a spot!`); gCards(true) }
function gPlace(r,c){ const G=GD; if(!G||G.sel===null||G.over) return; if(G.units.some(u=>u.r===r&&u.c===c)){ say('That spot is taken!'); return }
  const card=G.cards[G.sel],d=card.d,f=FIGHT[d.species]||FIGHT.trex; G.leaves-=GCOST; G.sel=null; $('#gf').classList.remove('placing');
  const el=document.createElement('div'); el.className='gunit hopin'; el.style.left=GX[c]+'%'; el.style.top=(r*LANE+3)+'%'; el.innerHTML=`<div class="ghp"><i></i></div>${dinoSVG(d)}`; $('#gf').appendChild(el);
  const u={d,card,r,c,x:GX[c],max:100*f.hp*(1+.1*d.glv),atk:f.atk*(1+.2*d.glv),spd:f.spd,cd:.6,el,leafT:8,shield:0,buff:0,herb:HERB.includes(d.species)}; u.hp=u.max;
  G.units.push(u); card.unit=u; SFX.roar(d); say(`Go, ${d.name}!`); gCards(true); gHud();
  document.querySelectorAll('.gcell').forEach(e=>e.classList.toggle('used',G.units.some(x=>'gc'+x.r+'_'+x.c===e.id)));
}
function addDrop(x,y,val){ const G=GD,f=$('#gf'); if(!G||!f) return; const id=++G.nid; const el=document.createElement('div'); el.className='gdrop'; el.textContent='🍃'; el.style.left=x+'%'; el.style.top=y+'%'; el.onpointerdown=e=>{e.stopPropagation();gCollect(id,true)}; f.appendChild(el); G.drops.push({id,el,val,life:4.5}) }
function gCollect(id,tap){ const G=GD; if(!G) return; const d=G.drops.find(x=>x.id===id); if(!d||d.done) return; d.done=1; G.leaves+=d.val; d.el.classList.add('got'); setTimeout(()=>d.el.remove(),500); if(tap){SFX.coin();} else tone(700,.06,'triangle',.05); gHud(); gCards() }
function spawnBot(){ const G=GD,lv=G.lv; let t='bot'; const r=Math.random(); if(lv>=3&&r<.18+lv*.01) t='big'; else if(lv>=2&&r<.45) t='zoom'; const b0=BOT[t],mul=1+.18*(lv-1);
  const row=Math.floor(Math.random()*3), el=document.createElement('div'); el.className='gbot'; el.style.top=(row*LANE+4)+'%'; el.style.left='104%'; el.innerHTML=`<div class="ghp"><i></i></div>${botSVG(t)}`; $('#gf').appendChild(el);
  G.bots.push({t,r:row,x:104,hp:b0.hp*mul,max:b0.hp*mul,spd:b0.spd,dps:b0.dps*(1+.08*(lv-1)),el,stun:0,slow:0}); if(G.spawned===0) say('Here come the Grabby Bots!') }
function gStep(ts){ if(!GD) return; const dt=Math.min(.05,(ts-(GD.last||ts))/1000); GD.last=ts; if(!GD.paused&&!GD.over) gUpdate(dt); if(GD){ GD.cardT+=dt; if(GD.cardT>.2){GD.cardT=0;gCards();gHud()} gRaf=requestAnimationFrame(gStep) } }
function gUpdate(dt){
  const G=GD; G.t+=dt;
  if(G.spawned<G.total){ G.next-=dt; if(G.next<=0){ spawnBot(); G.spawned++; const late=G.spawned/G.total>.7; if(late&&!G.wave){G.wave=true;gMsg('🚨 Big wave!');say('A big wave is coming!')} G.next=late?1.5+Math.random()*1.2:Math.max(2.4,6.5-G.lv*.35)+Math.random()*1.5 } }
  G.leafT-=dt; if(G.leafT<=0){ G.leafT=6.5; addDrop(18+Math.random()*70,6+Math.random()*70,25) }
  for(const d of G.drops){ if(d.done) continue; d.life-=dt; if(d.life<=0) gCollect(d.id,false) } G.drops=G.drops.filter(d=>!d.done);
  for(const u of G.units){ u.cd-=dt; if(u.shield>0)u.shield-=dt; u.card.sp=Math.min(100,u.card.sp+dt*5);
    if(u.herb){ u.leafT-=dt; if(u.leafT<=0){ u.leafT=10; addDrop(u.x,u.r*LANE+6,25) } }
    if(u.cd<=0&&G.bots.some(b=>b.r===u.r&&b.x>u.x-3&&b.x<100)){ u.cd=1.5/u.spd+Math.random()*.3; uAttack(u) } }
  for(const p of G.proj){ p.x+=55*dt; p.el.style.left=p.x+'%'; const b=G.bots.filter(b=>!b.gone&&b.r===p.r&&b.x>=p.x-2&&b.x<=p.x+4).sort((a,c)=>a.x-c.x)[0]; if(b){p.done=1;p.el.remove();bHit(b,p.dmg,p.fx)} else if(p.x>106){p.done=1;p.el.remove()} }
  G.proj=G.proj.filter(p=>!p.done);
  for(const b of G.bots){ if(b.gone) continue; if(b.stun>0){ b.stun-=dt; b.el.classList.add('dizzy'); continue } b.el.classList.remove('dizzy'); if(b.slow>0) b.slow-=dt;
    const u=G.units.find(u=>u.r===b.r&&b.x-u.x>0&&b.x-u.x<9);
    if(u){ u.hp-=b.dps*dt*(u.shield>0?.5:1); if(Math.random()<dt*2.5) anim(u.el,'shake',300); if(u.hp<=0) unitHome(u) }
    else { b.x-=b.spd*dt*(b.slow>0?.5:1); if(b.x<9) breach(b) }
    if(!b.gone){ b.el.style.left=b.x+'%'; b.el.firstChild.firstChild.style.width=Math.max(0,b.hp/b.max*100)+'%' } }
  G.bots=G.bots.filter(b=>!b.gone);
  for(const u of G.units) u.el.firstChild.firstChild.style.width=Math.max(0,u.hp/u.max*100)+'%';
  for(const c of G.cards) if(c.cd>0) c.cd-=dt;
  if(!G.over&&G.spawned>=G.total&&!G.bots.length) gEnd(true);
}
function uAttack(u){ const G=GD,sk=skN(rnd(u.d.sk.n)); anim(u.el,'lunge-r',200);
  if(sk.t==='heal'){ G.units.filter(x=>x.r===u.r).forEach(x=>x.hp=Math.min(x.max,x.hp+15)); gFloat(u.x,u.r*LANE+8,'💚'); return }
  if(sk.t==='shield'){ u.shield=4; gFloat(u.x,u.r*LANE+8,'🛡️'); return }
  if(sk.t==='buff'){ u.buff=2; gFloat(u.x,u.r*LANE+8,'💪'); return }
  const el=document.createElement('div'); el.className='gproj'; el.textContent=sk.e; el.style.top=(u.r*LANE+16)+'%'; el.style.left=(u.x+4)+'%'; $('#gf').appendChild(el);
  G.proj.push({r:u.r,x:u.x+4,dmg:sk.p*1.5*u.atk*(u.buff>0?1.5:1),fx:sk.t,el}); if(u.buff>0)u.buff--; }
function gFloat(x,y,t,c){ const f=$('#gf'); if(!f) return; const e=document.createElement('div'); e.className='gfloat'; e.textContent=t; if(c) e.style.color=c; e.style.left=x+'%'; e.style.top=y+'%'; f.appendChild(e); setTimeout(()=>e.remove(),900) }
let gBonkT=0;
function bHit(b,dmg,fx){ if(b.gone) return; b.hp-=dmg; anim(b.el,'shake',250); if(fx==='stun') b.stun=1; if(fx==='slow') b.slow=2.5; const now=Date.now(); if(now-gBonkT>120){SFX.bonk();gBonkT=now} if(b.hp<=0) botHome(b) }
function botHome(b){ const G=GD; if(b.gone) return; b.gone=1; G.sent++; G.coins+=2; b.el.classList.add('byebot'); gFloat(b.x,b.r*LANE+4,'Bye! 👋'); SFX.pop(); setTimeout(()=>b.el.remove(),800) }
function unitHome(u){ const G=GD; G.units=G.units.filter(x=>x!==u); u.el.classList.add('runhome'); setTimeout(()=>u.el.remove(),700); u.card.unit=null; u.card.cd=6; say(`${u.d.name} runs home to rest!`); document.getElementById('gc'+u.r+'_'+u.c)?.classList.remove('used'); gCards(true) }
function breach(b){ const G=GD,r=b.r;
  if(G.mama[r]){ G.mama[r]=0; const mm=$('#mm'+r); if(mm) mm.classList.add('mamarun'); SFX.roar({species:'brachio'}); say('Mama Dino to the rescue!'); G.bots.filter(x=>x.r===r).forEach(botHome); return }
  b.gone=1; b.el.classList.add('byebot'); setTimeout(()=>b.el.remove(),800); G.eggs--; SFX.yuck(); gHud();
  if(G.eggs<=0) gEnd(false); else say('Oh no! A bot took an egg! Protect the others!') }
function gBuy(i){ const G=GD,c=G.cards[i]; if(!c.unit||G.leaves<100||c.sp>=100) return; G.leaves-=100; c.sp=100; SFX.coin(); say('Special ready!'); gCards(true); gHud() }
function gSpecial(i){ const G=GD; if(!G||G.paused||G.over) return; const c=G.cards[i]; if(!c.unit||c.sp<100) return; G.paused=true; c.sp=0; gCards(true); const sp=skS(c.d.sk.sp),u=c.unit;
  vipIntro(c.d,sp,()=>skillGame(sp,g=>{ if(g==='Perfect'){c.d.st.perf++;save()} gApply(u,sp,g) }),false) }
function gApply(u,sp,g){ const G=GD; if(!G) return; const m=GR[g].m,all=['meteor','thunder','quake','tsunami','meatrain','iceage','megaroar'].includes(sp.id),lanes=all?[0,1,2]:[u.r],f=$('#gf');
  if(f){ const W=f.clientWidth,H=f.clientHeight; lanes.forEach(r=>{ for(let k=0;k<3;k++) rainFx(sp.e,f,W*(.45+k*.2),H*(r*LANE+18)/100,{Miss:1,Bad:2,Cool:3,Great:4,Perfect:5}[g]) }); anim(f,'shake',500) } SFX.boom();
  setTimeout(()=>{ if(!GD) return; G.paused=false;
    G.bots.filter(b=>lanes.includes(b.r)).forEach(b=>{ if(sp.t==='heal') bHit(b,20*m); else { if(sp.t==='stun'||sp.t==='freeze') b.stun=2+2*m; bHit(b,sp.p*3*m*u.atk*(all?.7:1)) } });
    if(sp.t==='heal') G.units.forEach(x=>{x.hp=Math.min(x.max,x.hp+x.max*.6*m);gFloat(x.x,x.r*LANE+8,'💚')});
  },900) }
function gEnd(win){ const G=GD; if(!G||G.over) return; G.over=true; const lv=G.lv; let coins=G.coins;
  if(win){ coins+=20+10*lv; P.guard.lv=Math.max(P.guard.lv,Math.min(30,lv+1)); P.guard.best=Math.max(P.guard.best||0,lv); G.cards.forEach(c=>{c.d.st.gw++;c.d.happy=clamp(c.d.happy+10)}); GT.lv=Math.min(P.guard.lv,lv+1) }
  save(); addCoins(coins); if(win){ addStar(1); SFX.fanfare(); confetti(); say(`Hooray! The forest is safe! You sent ${G.sent} bots home!`); G.cards.forEach(c=>checkVIP(c.d)) } else { SFX.bye(); say("The bots took the eggs. Let's try again! Power up your dinos with coins!") }
  setTimeout(()=>{ if(screen!=='guard') return; showCard(`<h2>${win?'🌲 Forest saved!':'🥚 Try again!'}</h2><div class="row">${G.cards.map(c=>`<div style="width:64px">${dinoSVG(c.d)}</div>`).join('')}</div>
    <p class="sub">🤖 ${G.sent} bots sent home<br>🪙 +${coins}${win?' · ⭐ +1':''}</p><div class="row">${win?`<button class="brick" style="--c:#E3000B" onclick="closeCard();startGuard()">▶️ Level ${GT.lv}</button>`:`<button class="brick" style="--c:#E3000B" onclick="closeCard();startGuard()">🔁 Again</button>`}<button class="brick" style="--c:#b38f00" onclick="closeCard();go('guard')">⬆️ Power up</button><button class="brick" style="--c:#00A84F" onclick="closeCard();go('park')">🌳 Park</button></div>`) },1400);
}
