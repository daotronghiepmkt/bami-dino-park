/* v3: background music, livelier sounds, dino reactions, care FX, Guard specials without mini-game */

/* ---------- more sounds ---------- */
SFX.miss=()=>{noise(.3,.12,'bandpass',1200,3500);tone(500,.2,'sine',.08,300,.05)};
SFX.impact=(id,crit)=>{
  const g={splash:'w',bubble:'w',snow:'i',icecream:'i',zap:'z',sun:'z',star:'z',rainbow:'z',leaf:'p',twist:'p',tail:'p',pillow:'p',tickle:'p',sneeze:'p',roar:'r',honey:'s',banana:'s'}[id]||'t';
  if(id==='special'){ noise(.7,.45,'lowpass',1400,80); tone(110,.5,'sawtooth',.18,40); tone(880,.3,'square',.06,1760,.05) }
  else if(g==='w'){ noise(.35,.25,'highpass',2500,600); tone(700,.08,'sine',.12,1300,.05) }
  else if(g==='i'){ [1568,2093,2637].forEach((f,i)=>tone(f,.12,'triangle',.08,null,i*.04)); noise(.15,.12,'highpass',6000) }
  else if(g==='z'){ for(let i=0;i<4;i++) tone(1200+Math.random()*800,.04,'square',.06,300,i*.035); noise(.2,.1,'highpass',4000) }
  else if(g==='p'){ noise(.3,.2,'bandpass',700,2500); tone(400,.15,'sine',.08,250) }
  else if(g==='r'){ tone(200,.3,'sawtooth',.12,90); noise(.3,.12,'lowpass',800,200) }
  else if(g==='s'){ tone(300,.25,'sine',.15,120); noise(.15,.15,'lowpass',500) }
  else { tone(150,.14,'square',.16,55); noise(.12,.25,'lowpass',1800) }
  if(crit){ tone(1760,.18,'square',.07,null,.05); tone(2349,.25,'square',.07,null,.12) }
};
SFX.yum=()=>{tone(523,.12,'sine',.18,700,.45);tone(784,.2,'sine',.18,1046,.6)};
SFX.blegh=()=>{tone(220,.35,'sawtooth',.1,110);noise(.3,.15,'bandpass',400)};
SFX.squeak=()=>{tone(1200,.08,'square',.06,1600);tone(1300,.1,'square',.06,1700,.12)};
SFX.giggle=()=>{[1046,1175,1046,1319,1175].forEach((f,i)=>tone(f,.07,'sine',.13,f*1.1,i*.08))};
SFX.sing=()=>{[659,784,880,784,1046].forEach((f,i)=>tone(f,.16,'triangle',.14,null,i*.16))};
SFX.dance=()=>{[523,659,523,784,659,1046].forEach((f,i)=>{tone(f,.09,'square',.07,null,i*.11);tone(f/4,.09,'triangle',.12,null,i*.11)})};
SFX.lullaby=()=>{[784,659,587,523,587,659].forEach((f,i)=>tone(f,.4,'sine',.1,null,i*.35))};
SFX.wake=()=>{[523,659,784,1046,1319].forEach((f,i)=>tone(f,.14,'triangle',.14,null,i*.08))};
SFX.chirp=()=>{tone(2600,.06,'sine',.05,3200);tone(2800,.08,'sine',.05,3600,.1)};
SFX.heartbeat=()=>{tone(988,.12,'sine',.12,1319);tone(1319,.25,'sine',.12,1568,.14)};
function playReact(s,d){ ({roar:()=>SFX.roar(d),hug:SFX.heartbeat,munch:SFX.munch,snore:SFX.snore,splash:SFX.splash,sing:SFX.sing,dance:SFX.dance,giggle:SFX.giggle,boing:SFX.boing,fanfare:SFX.fanfare}[s]||SFX.pop)() }
function critFx(side){ floatTxt(side,'CRITICAL!','#FFCD03'); const ar=$('#arena'); if(ar){ anim(ar,'quake',350); const f=document.createElement('div'); f.className='flash y'; ar.appendChild(f); setTimeout(()=>f.remove(),400) } }

/* ---------- background music (chiptune loops) ---------- */
const MUS={
 park:{bpm:108,mel:[72,0,76,0,79,0,76,0,77,0,81,0,79,77,76,0,74,0,77,0,81,0,79,0,76,74,72,0,74,0,0,0],bass:[48,48,53,53,55,55,48,43],drum:0},
 battle:{bpm:152,mel:[69,0,69,72,0,69,74,0,72,0,71,0,69,0,67,0,69,0,69,72,0,74,76,0,77,76,74,72,71,0,69,0],bass:[45,45,41,41,43,43,45,40],drum:1},
 guard:{bpm:126,mel:[67,0,71,74,0,71,72,0,74,0,76,74,72,71,69,0,67,0,71,74,0,79,78,0,76,74,72,71,69,0,67,0],bass:[43,43,48,48,50,50,43,38],drum:1},
 drive:{bpm:140,mel:[72,74,76,79,0,76,79,0,81,79,76,74,72,0,74,0,76,79,81,84,0,81,79,0,76,74,72,74,72,0,0,0],bass:[48,48,53,53,55,55,53,55],drum:1}
};
let musBus=null,musTrack='park',musStep=0,musNext=0,musTimer=null;
const mtof=n=>440*Math.pow(2,(n-69)/12);
function musNote(f,t,dur,type,vol){ const a=AC,o=a.createOscillator(),g=a.createGain(); o.type=type; o.frequency.value=f; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(g).connect(musBus); o.start(t); o.stop(t+dur+.02) }
function musHit(t,kick){ const a=AC; if(kick){ const o=a.createOscillator(),g=a.createGain(); o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(45,t+.12); g.gain.setValueAtTime(.22,t); g.gain.exponentialRampToValueAtTime(.0001,t+.15); o.connect(g).connect(musBus); o.start(t); o.stop(t+.16) }
  else { const len=Math.floor(a.sampleRate*.04),b=a.createBuffer(1,len,a.sampleRate),ch=b.getChannelData(0); for(let i=0;i<len;i++) ch[i]=Math.random()*2-1; const s=a.createBufferSource(); s.buffer=b; const fl=a.createBiquadFilter(); fl.type='highpass'; fl.frequency.value=7000; const g=a.createGain(); g.gain.setValueAtTime(.05,t); g.gain.exponentialRampToValueAtTime(.0001,t+.04); s.connect(fl).connect(g).connect(musBus); s.start(t) } }
function musTick(){ if(!AC||!musTrack||!musBus) return; const tr=MUS[musTrack],st=60/tr.bpm/2;
  if(musNext<AC.currentTime) musNext=AC.currentTime+.05;
  while(musNext<AC.currentTime+.3){ const i=musStep%tr.mel.length,n=tr.mel[i];
    if(n){ musNote(mtof(n),musNext,st*.85,'square',.04); musNote(mtof(n+12),musNext,st*.5,'triangle',.015) }
    if(i%2===0) musNote(mtof(tr.bass[(i/2|0)%tr.bass.length]),musNext,st*1.7,'triangle',.09);
    if(tr.drum){ if(i%4===0) musHit(musNext,1); if(i%2===1) musHit(musNext,0) } else if(i%8===0) musHit(musNext,1);
    musNext+=st; musStep++ } }
function startMus(){ if(musTimer||!musTrack||!DB.settings.music||document.hidden) return; try{ ac() }catch(e){ return } if(!musBus){ musBus=AC.createGain(); musBus.gain.value=.6; musBus.connect(AC.destination) } musNext=AC.currentTime+.1; musTimer=setInterval(musTick,70) }
function stopMus(){ clearInterval(musTimer); musTimer=null }
function setMusic(name){ if(name===musTrack&&musTimer) return; musTrack=name; musStep=0; stopMus(); if(AC) startMus() }
DB.settings.music=DB.settings.music!==false;
document.addEventListener('pointerdown',()=>{ if(!musTimer) startMus() });
document.addEventListener('visibilitychange',()=>{ if(document.hidden) stopMus(); else startMus() });
const renderV2=render; render=function(a){ renderV2(a); setMusic({battle:'battle',rank:'battle',guard:'guard'}[screen]||'park') };
window.drive=(o=>function(k){ o(k); if(RN) setMusic('drive') })(window.drive);

function openSettings(){
  const s=DB.settings,row=(ic,l,k)=>`<div class="setrow">${ic} ${l} <button class="brick" style="--c:${s[k]?'#00A84F':'#9BA19D'}" onclick="DB.settings.${k}=!DB.settings.${k};save();${k==='music'?'DB.settings.music?startMus():stopMus();':''}openSettings()">${s[k]?'ON':'OFF'}</button></div>`;
  showCard(`<h2>⚙️ Grown-ups</h2>${row('🎵','Music','music')}${row('🔊','Sounds','sound')}${row('🗣️','Voice','voice')}
   <div class="setrow">💾 Backup all players <button class="brick" style="--c:#0057A6" onclick="backup()">Save file</button></div>
   <div class="setrow">📂 Restore backup <button class="brick" style="--c:#0057A6" onclick="$('#rf').click()">Open file</button><input type="file" id="rf" accept=".json,application/json" style="display:none" onchange="restore(this)"></div>
   ${P?`<div class="setrow">🗑️ Delete player "${esc(P.name)}" <button class="brick" style="--c:#E3000B" onclick="delPlayer()">Delete</button></div>`:''}
   <p style="font-size:13px;color:#666;text-align:left">Progress is saved in this browser. Tip: add this page to the Home Screen so the browser keeps the save, and make a backup file now and then.</p>
   <button class="brick" style="--c:#9BA19D" onclick="closeCard()">Close</button>`);
}

/* ---------- dino reactions (emoji bubble + line + sound) ---------- */
function bubble(el,e,t){ if(!el) return; el.querySelectorAll(':scope>.dbub').forEach(x=>x.remove()); const b=document.createElement('div'); b.className='dbub'; b.innerHTML=`<b>${e}</b>${t?`<span>${esc(t)}</span>`:''}`; el.appendChild(b); setTimeout(()=>b.remove(),2200) }
function dinoLine(d){
  ensureDino(d); const f=P.families.find(x=>x.id===d.family),mates=f?P.dinos.filter(x=>x.family===f.id&&x.id!==d.id):[],sp=SP[d.species],pool=[];
  if(d.hunger<50) pool.push(['😋',"I'm hungry! Feed me please!",'munch'],['🍖','My tummy says grrr!','munch']);
  if(d.energy<50) pool.push(['😴',"I'm sleepy... yaaawn!",'snore']);
  if(d.clean<50) pool.push(['🛁','I need a bath! Splash!','splash']);
  pool.push(['😄',`Hi ${P.name}!`,'roar'],['🥰',`I love you, ${P.name}!`,'hug'],['🎵','La la la! I love to sing!','sing'],['💃','Dance time! Wiggle wiggle!','dance'],['🦖','ROAR! I am big and strong!','roar'],['😂','Hee hee! That tickles!','giggle'],['🤩',`I am a ${sp.name}!`,'boing'],['🍽️',`I eat ${sp.diet.join(' and ')}!`,'munch']);
  if(f) pool.push(['🏠',`I love the ${f.name}!`,'hug'],['🛋️','Home sweet home!','hug']);
  if(mates.length){ const m=rnd(mates); pool.push(['🤝',`${m.name} is my best friend!`,'hug'],['🫶','I love my family!','hug'],['🙈',`Let's play hide and seek, ${m.name}!`,'giggle']) }
  if(d.size==='baby') pool.push(['🍼','I am a baby dino! Goo goo!','giggle']);
  if(d.st.w>0) pool.push(['🏆',`I won ${d.st.w} ${d.st.w===1?'battle':'battles'}!`,'fanfare']);
  if(d.acc&&d.acc.head!=='none') pool.push(['😎','Do you like my hat?','boing']);
  if(d.happy>=90) pool.push(['🌈','I am super happy today!','sing']);
  return rnd(pool);
}
function dinoReact(d,el,lead){ if(!d) return; const [e,t,s]=dinoLine(d); playReact(s,d); if(el){ bubble(el,e,t); anim(el.querySelector('svg')||el,s==='dance'?'dance':'jump',700) } say((lead?lead+' ':'')+t,200) }
function famPick(id){ const d=getD(id),was=famSel===id; famSel=was?null:id; SFX.pop(); keepScroll(()=>render()); const el=document.querySelector(`.fd[onclick*="${id}"]`); if(!was) dinoReact(d,el); if(famSel) setTimeout(()=>{ if(famSel===id) say('Now tap a house!') },2600) }
function memTap(id){ const el=document.querySelector(`.hmem[onclick*="${id}"]`); dinoReact(getD(id),el) }
function tapBig(){ const d=getSel(); if(!d) return; dinoReact(d,$('#dbig')) }

/* ---------- care with lively FX ---------- */
function careFx(e,t,list,cls){ const el=$('#dbig'); bubble(el,e,t); if(cls) anim(el,cls,700); if(list) burst(list,7,50,32) }
function feed(kind){ const d=getSel(); if(busy||!d) return; const sp=SP[d.species],em={meat:'🍖',fish:'🐟',leaves:'🥬'}[kind];
  if(sp.diet.includes(kind)){ d.hunger=clamp(d.hunger+30); d.happy=clamp(d.happy+5); SFX.munch(); SFX.yum(); careFx(rnd(['😋','🤤','😍']),rnd(['Yum yum!','Yummy!','More please!','So good!']),[em,em,'❤️','✨'],'munch'); bigText('YUM!'); say(`Yum yum! ${d.name} loves ${kind}!`) }
  else { SFX.blegh(); careFx('🤢','Yuck!',null,'shake'); bigText('YUCK!','#A5CA18'); say(`Yuck! ${d.name} does not eat ${kind}. ${sp.name} eats ${sp.diet.join(' and ')}!`) }
  careDone(d) }
function bath(){ const d=getSel(); if(busy||!d) return; d.clean=clamp(d.clean+40); d.happy=clamp(d.happy+5); SFX.splash(); setTimeout(SFX.squeak,350); setTimeout(()=>{for(let i=0;i<5;i++) tone(800+Math.random()*900,.06,'sine',.12,1600,i*.09)},600);
  careFx(rnd(['😆','🫧','😁']),rnd(['Splish splash!','Bubbles!','So clean!']),['🫧','💧','🫧','🦆','🧼'],'shake'); bigText('SPLASH!','#5AB4E5'); say(`Splish splash! ${d.name} is so clean!`); careDone(d) }
function sleepD(){ const d=getSel(); if(busy||!d) return; busy=true; $('#stage').classList.add('night'); $('#dbig').innerHTML=dinoSVG(d,{sleep:true}); bubble($('#dbig'),'😴','Zzz...'); SFX.lullaby(); say(`Good night, ${d.name}! Sweet dreams!`); setTimeout(SFX.snore,2100); burst(['💤','⭐','🌙','💤'],8,50,28);
  setTimeout(()=>{ d.energy=clamp(d.energy+45); busy=false; if(screen!=='care') return; $('#stage').classList.remove('night'); $('#dbig').innerHTML=dinoSVG(d); SFX.wake(); anim($('#dbig'),'jump'); bubble($('#dbig'),'🌞','Good morning!'); burst(['☀️','✨'],5,50,30); say(`Good morning, ${d.name}!`); careDone(d) },3400) }
function playD(){ const d=getSel(); if(busy||!d) return; if(d.energy<15){ bubble($('#dbig'),'🥱','Too sleepy...'); SFX.snore(); say(`${d.name} is too sleepy. Let's sleep first!`); anim($('#dbig'),'shake'); return }
  d.happy=clamp(d.happy+25); d.energy=clamp(d.energy-8); d.hunger=clamp(d.hunger-5); const toy=rnd(['⚽','🎈','🪁','🏀','🪀']); SFX.boing(); setTimeout(SFX.giggle,300); careFx(rnd(['🤸','😆','🥳']),rnd(['Wheee!','Again! Again!','So much fun!']),[toy,toy,'✨','🎉'],rnd(['jump','dance','spin'])); bigText('WHEEE!'); say('Wheee! So much fun!'); careDone(d) }
function hugD(){ const d=getSel(); if(busy||!d) return; d.happy=clamp(d.happy+15); SFX.hug(); setTimeout(SFX.heartbeat,400); careFx(rnd(['🥰','🤗','😊']),rnd([`I love you, ${P.name}!`,'Big hug!','Best friends!']),['❤️','💖','💛','💕'],'munch'); say(`I love you, ${d.name}!`); careDone(d) }

/* ---------- Forest Guard: tap a glowing dino to use its special (no mini-game) ---------- */
window.gCards=(o=>function(f){ o(f); if(!GD) return; GD.cards.forEach(c=>{ if(!c.unit) return; const r=c.sp>=100; if(r&&!c.unit.el.classList.contains('ready')){ SFX.chirp(); tone(1319,.15,'triangle',.1,1760); say(`${c.d.name} is ready! Tap ${c.d.name}!`) } c.unit.el.classList.toggle('ready',r) }) })(window.gCards);
window.gPlace=(o=>function(r,c){ const n=GD?GD.units.length:0; o(r,c); if(!GD||GD.units.length===n) return; const u=GD.units[GD.units.length-1]; u.el.onpointerdown=e=>{ e.stopPropagation(); const i=GD.cards.indexOf(u.card); if(u.card.sp>=100) gSpecial(i); else { bubble(u.el,'⏳',''); say(`${u.d.name} is charging up!`) } } })(window.gPlace);
function gSpecial(i){ const G=GD; if(!G||G.over) return; const c=G.cards[i]; if(!c||!c.unit||c.sp<100) return; c.sp=0; c.unit.el.classList.remove('ready'); gCards(true);
  const sp=skS(c.d.sk.sp),u=c.unit; SFX.vip(); bubble(u.el,sp.e,''); gMsg(`${sp.e} ${sp.n}!`); say(`${c.d.name}! ${sp.n}!`); const f=$('#gf'); if(f){ const fl=document.createElement('div'); fl.className='flash y'; f.appendChild(fl); setTimeout(()=>fl.remove(),450) }
  setTimeout(()=>gApply(u,sp,'Great'),350) }
