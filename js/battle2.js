/* Battle v2: watch the fight, cheer, VIP specials with timing grades, 60s timer, K.O, ranking */
let BT=null,btRaf=null;
function rBattle(m){
  if(P.dinos.length<2) return emptyState(m,'You need two dinos to play battle!');
  P.dinos.forEach(ensureDino);
  if(!getD(B.a)) B.a=getD(sel)?sel:null; if(!getD(B.b)||B.b===B.a) B.b=null;
  const slot=(id,flip)=>{const d=getD(id); if(!d) return 'Tap a dino 👇'; return `<div style="${flip?'transform:scaleX(-1)':''}">${dinoSVG(d)}</div><span>${esc(d.name)}</span><div class="skrow">${skIcons(d)}</div>`};
  m.innerHTML=`<div class="corners"><div class="corner" style="background:#00A84F">🟢 You<div class="slot">${slot(B.a)}</div></div><div class="vs">VS</div><div class="corner" style="background:#E3000B">🔴 ${B.mode==='cpu'?'Computer':'Friend'}<div class="slot">${slot(B.b,1)}</div></div></div>
   <div class="row"><button class="brick" style="--c:${B.mode==='cpu'?'#0057A6':'#9BA19D'}" onclick="B.mode='cpu';say('Play with the computer');render()">🤖 vs Computer</button><button class="brick" style="--c:${B.mode==='2p'?'#0057A6':'#9BA19D'}" onclick="B.mode='2p';say('Two players');render()">👫 2 Players</button></div>
   <div class="fdinos" style="padding:8px">${P.dinos.map(d=>`<div class="fd ${d.id===B.a||d.id===B.b?'sel':''}" onclick="bPick('${d.id}')">${dinoSVG(d)}<span>${esc(d.name)}</span><span class="mini">🏆${d.st.w}</span></div>`).join('')}</div>
   <div class="row" style="padding-bottom:24px"><button class="brick" style="--c:#E3000B;font-size:28px;padding:14px 26px" ${B.a&&B.b?'':'disabled'} onclick="startFight()">💥 BATTLE!</button><button class="brick" style="--c:#b38f00;font-size:20px" onclick="go('rank')">🏆 Ranking</button></div>`;
}
function mkF(d,side){ ensureDino(d); const f=FIGHT[d.species]||FIGHT.trex,bb=d.size==='baby',bonus=1+Math.min(.2,d.st.w*.01); const max=Math.round(260*f.hp*(bb?.9:1)*bonus);
  return {d,side,hp:max,max,atk:f.atk*bonus,spd:f.spd*(bb?1.15:1),bar:0,cd:.8+Math.random(),stun:0,slow:0,shield:0,buff:0,frozen:0,said:false,ct:0} }
function startFight(){
  const A=getD(B.a),Bd=getD(B.b); if(!A||!Bd) return; stopLoops(); screen='battle'; closeCard();
  BT={a:mkF(A,'a'),b:mkF(Bd,'b'),t:60,running:false,paused:false,over:false,last:0,ten:false};
  const spA=skS(A.sk.sp),spB=skS(Bd.sk.sp);
  $('#main').innerHTML=`<div class="arena2" id="arena"><div class="ground baseplate"></div><div class="deco" style="left:44%;top:8%;font-size:46px;opacity:.85">🌋</div><div class="deco" style="left:6%;top:22%;font-size:40px">🌴</div><div class="deco" style="right:6%;top:24%;font-size:36px">🌴</div>
   <div class="abar"><div class="hpw"><b>${esc(A.name)}</b><div class="hp"><i id="hpA"></i></div><div class="spb" id="sbA"><i id="spA"></i></div></div><div class="timer" id="tmr">60</div><div class="hpw r"><b>${esc(Bd.name)}</b><div class="hp"><i id="hpB"></i></div><div class="spb" id="sbB"><i id="spB"></i></div></div></div>
   <div class="fighter2" id="fa" onpointerdown="cheer('a')"><div class="inner">${dinoSVG(A)}</div></div>
   <div class="fighter2 flipX" id="fb" onpointerdown="cheer('b')"><div class="inner">${dinoSVG(Bd)}</div></div><div class="count" id="count"></div></div>
   <div class="spbtns"><button class="brick spbtn" id="btnA" onclick="useSpecial('a')"><span class="spe">${spA.e}</span><span>${spA.n}</span><small id="pctA">0%</small></button>${B.mode==='2p'?`<button class="brick spbtn" id="btnB" onclick="useSpecial('b')"><span class="spe">${spB.e}</span><span>${spB.n}</span><small id="pctB">0%</small></button>`:''}</div>
   <p class="center" style="font-size:16px;margin:4px 8px 20px">✨ The bar fills up when dinos hit and get hit. When it is full, press the gold button!</p>`;
  updBT(); let n=3; const cd=()=>{ const c=$('#count'); if(!c||!BT) return; if(n>0){c.textContent=n;SFX.count();say(String(n));n--;setTimeout(cd,900)} else {c.textContent='FIGHT!';SFX.go();say('Fight!');BT.running=true;BT.last=0;setTimeout(()=>{if($('#count'))$('#count').textContent=''},700)} };
  cd(); btRaf=requestAnimationFrame(btStep);
}
function btStep(t){
  if(!BT) return; const dt=Math.min(.05,(t-(BT.last||t))/1000); BT.last=t;
  if(BT.running&&!BT.paused&&!BT.over){
    BT.t-=dt;
    for(const s of ['a','b']){ const F=BT[s]; if(F.shield>0) F.shield-=dt; if(F.frozen>0){F.frozen-=dt; if(F.frozen<=0) fEl(s).classList.remove('frozen'); continue} F.cd-=dt; if(F.cd<=0) act(s); if(BT.over) break }
    if(!BT.over&&BT.t<=10&&!BT.ten){BT.ten=true;say('Ten seconds!')}
    if(!BT.over&&BT.t<=0){BT.t=0;endFight('time')}
    if(BT&&!BT.over&&B.mode==='cpu'&&BT.b.bar>=100&&!BT.paused) cpuSpecial();
  }
  if(BT){ updBT(); btRaf=requestAnimationFrame(btStep) }
}
const fEl=s=>$(s==='a'?'#fa':'#fb');
function fCenter(s){ const ar=$('#arena').getBoundingClientRect(),r=fEl(s).getBoundingClientRect(); return {x:r.left-ar.left+r.width/2,y:r.top-ar.top+r.height*.45} }
function floatTxt(s,t,c){ if(!$('#arena')) return; const p=fCenter(s); const e=document.createElement('div'); e.className='ftxt'; e.textContent=t; if(c) e.style.color=c; e.style.left=p.x+'px'; e.style.top=(p.y-40)+'px'; $('#arena').appendChild(e); setTimeout(()=>e.remove(),1000) }
function skLabel(s,t){ if(!$('#arena')) return; const p=fCenter(s); const e=document.createElement('div'); e.className='sklbl'; e.textContent=t; e.style.left=p.x+'px'; e.style.top=(p.y-70)+'px'; $('#arena').appendChild(e); setTimeout(()=>e.remove(),1100) }
function act(s){
  const F=BT[s],E=BT[s==='a'?'b':'a']; F.cd=(1.4/F.spd)*(F.slow>0?1.5:1)+Math.random()*.3; if(F.slow>0)F.slow--;
  if(F.stun>0){F.stun--; floatTxt(s,'💫 Dizzy!','#FFCD03'); anim(fEl(s),'shake',400); return}
  const sk=skN(rnd(F.d.sk.n)); anim(fEl(s),s==='a'?'lunge-r':'lunge-l',200); skLabel(s,sk.e+' '+sk.n);
  if(sk.t==='heal'){ heal(F,sk.p); F.bar=Math.min(100,F.bar+12); SFX.hug(); return }
  if(sk.t==='shield'){ F.shield=4; shieldFx(s); F.bar=Math.min(100,F.bar+12); SFX.pop(); return }
  if(sk.t==='buff'){ F.buff=2; floatTxt(s,'💪 Power up!','#F57D20'); F.bar=Math.min(100,F.bar+12); SFX.boing(); return }
  throwProj(s,sk.e,()=>{ if(!BT||BT.over) return; const r=Math.random(); if(r<.07){ floatTxt(E.side,'MISS!','#dfe6ec'); SFX.miss(); anim(fEl(E.side),'dodge',450); F.bar=Math.min(100,F.bar+8); return }
    const crit=r>.88; const dmg=sk.p*.9*F.atk*(F.buff>0?1.4:1)*(.85+Math.random()*.3)*(crit?1.8:1); if(F.buff>0)F.buff--;
    if(sk.t==='stun') E.stun=1; if(sk.t==='slow'){E.slow=2;floatTxt(E.side,'🐌 Slow!','#5AB4E5')}
    F.bar=Math.min(100,F.bar+14); E.bar=Math.min(100,E.bar+10); if(crit) critFx(E.side); hitF(E,dmg,sk.id,crit) });
}
function throwProj(s,e,cb){ const ar=$('#arena'); if(!ar) return; const a=fCenter(s),b=fCenter(s==='a'?'b':'a'),dx=b.x-a.x; const p=document.createElement('div'); p.className='proj'; p.textContent=e; p.style.left=a.x+'px'; p.style.top=a.y+'px'; ar.appendChild(p); SFX.whoosh();
  const an=p.animate([{transform:'translate(-50%,-50%) translate(0,0) rotate(0deg)'},{transform:`translate(-50%,-50%) translate(${dx/2}px,-55px) rotate(180deg)`},{transform:`translate(-50%,-50%) translate(${dx}px,0) rotate(360deg)`}],{duration:520});
  an.onfinish=()=>{p.remove();cb()} }
function shieldFx(s){ const el=fEl(s); if(!el) return; const sh=document.createElement('div'); sh.className='shieldfx'; el.appendChild(sh); setTimeout(()=>sh.remove(),4000); floatTxt(s,'🛡️ Shield!','#5AB4E5') }
function heal(F,v){ v=Math.round(v); F.hp=Math.min(F.max,F.hp+v); floatTxt(F.side,'+'+v+' 💚','#00A84F') }
function hitF(E,dmg,sid,crit){ if(!BT||BT.over) return; if(E.shield>0) dmg*=.5; dmg=Math.max(1,Math.round(dmg)); E.hp=Math.max(0,E.hp-dmg); floatTxt(E.side,(crit?'💥 -':'-')+dmg,crit?'#FFCD03':'#E3000B'); anim(fEl(E.side),'shake',420); sid?SFX.impact(sid,crit):SFX.bonk(); if(E.hp<=0) endFight(E.side==='a'?'b':'a',true) }
function updBT(){
  if(!BT||!$('#hpA')) return; const q=(id,v)=>{const e=$(id); if(e) e.style.width=v+'%'};
  q('#hpA',BT.a.hp/BT.a.max*100); q('#hpB',BT.b.hp/BT.b.max*100); q('#spA',BT.a.bar); q('#spB',BT.b.bar);
  $('#sbA').classList.toggle('full',BT.a.bar>=100); $('#sbB').classList.toggle('full',BT.b.bar>=100);
  const tm=$('#tmr'); tm.textContent=Math.ceil(BT.t); tm.classList.toggle('low',BT.t<=10);
  for(const s of ['a','b']){ const b=$(s==='a'?'#btnA':'#btnB'); if(!b) continue; const F=BT[s],ready=F.bar>=100&&BT.running&&!BT.paused&&!BT.over; b.classList.toggle('ready',ready); const pc=$(s==='a'?'#pctA':'#pctB'); if(pc) pc.textContent=ready?'READY!':Math.floor(F.bar)+'%';
    if(ready&&!F.said){F.said=true;say('Special ready! Press the gold button!')} if(!ready&&F.bar<100) F.said=false }
}
function cheer(s){ if(!BT||!BT.running||BT.over) return; const F=BT[s],now=Date.now(); if(now-F.ct<700) return; F.ct=now; SFX.roar(F.d) }
function useSpecial(s){
  if(!BT||!BT.running||BT.paused||BT.over) return; const F=BT[s]; if(F.bar<100){ say('Not yet! Cheer to fill the bar!'); return }
  BT.paused=true; F.bar=0; updBT(); const sp=skS(F.d.sk.sp);
  vipIntro(F.d,sp,()=>skillGame(sp,g=>{ if(g==='Perfect'){F.d.st.perf++;save()} doSpecial(s,sp,g) }),false);
}
function cpuSpecial(){ const F=BT.b; BT.paused=true; F.bar=0; const sp=skS(F.d.sk.sp),g=wPick(); vipIntro(F.d,sp,()=>{ gradeText(g); setTimeout(()=>doSpecial('b',sp,g),600) },true) }
function doSpecial(s,sp,g){
  if(!BT||BT.over){ if(BT) BT.paused=false; return } const F=BT[s],E=BT[s==='a'?'b':'a'],m=GR[g].m,ar=$('#arena'); if(!ar) return;
  const p=fCenter(E.side); rainFx(sp.e,ar,p.x,p.y,{Miss:3,Bad:5,Cool:8,Great:11,Perfect:15}[g]); SFX.boom(); anim(ar,'quake',500);
  if(g==='Perfect'){ const fl=document.createElement('div'); fl.className='flash'; ar.appendChild(fl); setTimeout(()=>fl.remove(),500) }
  setTimeout(()=>{ if(!BT||BT.over) return; BT.paused=false;
    if(sp.t==='heal'){ heal(F,sp.p*m*2.2); hitF(E,sp.p*1.2*m*F.atk,'special',m>=1.1) }
    else if(sp.t==='stun'){ if(m>=.8){E.stun=2;floatTxt(E.side,'💫 Dizzy!','#FFCD03')} hitF(E,sp.p*2.4*m*F.atk,'special',m>=1.1) }
    else if(sp.t==='freeze'){ E.frozen=1+2*m; fEl(E.side).classList.add('frozen'); hitF(E,sp.p*2.4*m*F.atk,'special',m>=1.1) }
    else hitF(E,sp.p*2.4*m*F.atk,'special',m>=1.1);
  },1000);
}
function endFight(w,ko){
  if(!BT||BT.over) return; BT.over=true; BT.running=false;
  if(w==='time'){ const pa=BT.a.hp/BT.a.max,pb=BT.b.hp/BT.b.max; w=Math.abs(pa-pb)<.005?'draw':(pa>pb?'a':'b'); }
  const A=BT.a.d,Bd=BT.b.d; A.st.b++; Bd.st.b++; let coins=0,W=null,L=null;
  if(w==='draw'){A.st.dr++;Bd.st.dr++;coins=5}
  else { W=BT[w].d; L=BT[w==='a'?'b':'a'].d; W.st.w++; L.st.l++; if(ko) W.st.ko++; coins=B.mode==='2p'?10:(w==='a'?15+(ko?10:0):3);
    W.happy=clamp(W.happy+10); fEl(w==='a'?'b':'a').classList.add(w==='a'?'flyout-r':'flyout-l'); setTimeout(()=>SFX.roar(W),300) }
  A.energy=clamp(A.energy-10); Bd.energy=clamp(Bd.energy-10); save();
  bigText(ko?'K.O!':'TIME UP!',ko?'#FFCD03':'#fff'); say(ko?'K.O!':'Time up!');
  const winText=w==='draw'?"It's a draw!":`${W.name} wins${ko?' by K.O':''}!`;
  setTimeout(()=>{ if(screen!=='battle') return; SFX.fanfare(); confetti(); addCoins(coins); if(w==='a'||(B.mode==='2p'&&w!=='draw')) addStar(1); [A,Bd].forEach(checkVIP); say(winText+(w==='draw'?' Good game!':' Great job!'));
    const crown=d=>dinoSVG(Object.assign({},d,{acc:Object.assign({},d.acc,{head:'crown'})}));
    showCard(w==='draw'?`<h2>🤝 Draw!</h2><div class="row"><div style="width:140px">${dinoSVG(A)}</div><div style="width:140px;transform:scaleX(-1)">${dinoSVG(Bd)}</div></div><p class="sub">Same power! Good game!</p>`
      :`<h2>🏆 ${esc(W.name)} wins!</h2>${ko?'<div class="kob">K.O!</div>':'<div class="kob t">⏰ Time up</div>'}<div class="bigwrap" style="width:200px">${crown(W)}</div><p class="sub">${esc(L.name)}: "Good game!" 🤗</p>`
      +`<p class="sub">🪙 +${coins}</p><div class="row"><button class="brick" style="--c:#E3000B" onclick="closeCard();startFight()">🔁 Again</button><button class="brick" style="--c:#0057A6" onclick="closeCard();go('battle')">🦖 New dinos</button><button class="brick" style="--c:#b38f00" onclick="closeCard();go('rank')">🏆 Ranking</button><button class="brick" style="--c:#00A84F" onclick="closeCard();go('park')">🌳 Park</button></div>`);
  },1900);
}

/* ---------- ranking podium ---------- */
const bPts=d=>d.st.w*3+d.st.dr+d.st.ko*2;
function rRank(m){
  P.dinos.forEach(ensureDino);
  const L=[...P.dinos].sort((a,b)=>bPts(b)-bPts(a)||b.st.w-a.st.w||b.st.ko-a.st.ko||a.st.l-b.st.l);
  const played=L.filter(d=>d.st.b>0);
  const top=played.slice(0,3), order=[1,0,2], col=['#FFCD03','#C0C6CC','#CD7F32'], hts=[130,96,72], md=['🥇','🥈','🥉'];
  const pod=order.map(i=>{const d=top[i]; if(!d) return '<div class="pod"></div>'; const shown=i===0?Object.assign({},d,{acc:Object.assign({},d.acc,{head:'crown'})}):d;
    return `<div class="pod"><div class="pdino" onclick="SFX.roar(getD('${d.id}'));say('${d.name.replace(/[^\w ]/g,'')}')">${dinoSVG(shown)}</div><b>${esc(d.name)}</b><div class="pp">${bPts(d)} pts</div><div class="blk" style="background:${col[i]};height:${hts[i]}px">${md[i]}<span>${i+1}</span></div></div>`}).join('');
  m.innerHTML=`<h2>🏆 Dino Ranking</h2>${played.length?`<div class="podium">${pod}</div>`:'<div class="empty"><div class="e">🏟️</div><p>Play battles to get on the podium!</p></div>'}
   <table class="rtable"><tr><th>#</th><th></th><th>Name</th><th>🏆W</th><th>🤝D</th><th>L</th><th>💥KO</th><th>Pts</th></tr>${L.map((d,i)=>`<tr><td>${i+1}</td><td style="width:52px">${dinoSVG(d)}</td><td style="text-align:left"><b>${esc(d.name)}</b><br><small>${SP[d.species].name}</small></td><td>${d.st.w}</td><td>${d.st.dr}</td><td>${d.st.l}</td><td>${d.st.ko}</td><td><b>${bPts(d)}</b></td></tr>`).join('')}</table>
   <p class="center" style="font-size:14px;color:#666;margin:-10px 8px 10px">Win = 3 pts · K.O bonus = 2 pts · Draw = 1 pt</p>
   <div class="row" style="padding-bottom:24px"><button class="brick" style="--c:#E3000B" onclick="go('battle')">💥 Battle</button></div>`;
  if(top[0]) say(`Number one is ${top[0].name}!`);
}
