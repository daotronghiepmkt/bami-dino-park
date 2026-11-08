/* v2 screens: park, dress, family + house detail, Bami wardrobe, header, wiring. Loaded last. */
const MENU2=[['🥚','New Dino','adopt','#FFCD03'],['🍖','Care','care','#F57D20'],['🎨','Dress Up','dress','#8E4FB5'],['💥','Battle','battle','#E3000B'],['🌲','Guard','guard','#00733a'],['🏠','Family','family','#0057A6'],['🚚','Truck','truck','#2A2A2A'],['👕','Bami','kid','#5AB4E5'],['🏆','Ranking','rank','#b38f00'],['👋','Bye Bye','bye','#00A84F']];
let parkFx=null;

function updateHeader(){
  $('#hHome').style.visibility=P?'visible':'hidden'; $('#hPlayer').style.display=P?'flex':'none';
  if(P) $('#hPlayer').innerHTML=`<span class="av">${kidSVG(P,{head:1})}</span>${esc(P.name)}`;
  $('#hStars').style.display=P?'flex':'none'; $('#hCoins').style.display=P?'flex':'none';
  $('#hStars').textContent='⭐ '+(P?P.stars:0); $('#hCoins').textContent='🪙 '+(P?P.coins||0:0);
  document.body.classList.toggle('inplay',!!P);
}
function stopLoops(){
  if(raf) cancelAnimationFrame(raf); raf=null; clearInterval(cpuTimer); B.running=false;
  if(btRaf) cancelAnimationFrame(btRaf); btRaf=null; BT=null;
  if(RN){ RN.over=true; cancelAnimationFrame(RN.raf) } RN=null;
  if(gRaf) cancelAnimationFrame(gRaf); gRaf=null; GD=null;
  clearInterval(parkFx); parkFx=null; document.querySelectorAll('.vip,.sg').forEach(e=>e.remove());
}
function newDino(k){ const sp=SP[k]; return ensureDino({id:uid(),species:k,name:rnd(NAMES),color:sp.c,accent:sp.a,pattern:sp.p,hat:'none',size:'big',hunger:80,clean:80,energy:80,happy:80,family:null,born:Date.now()}) }
function careDone(d){
  ensureDino(d); d.st.care++; save(); updMeters(d);
  if(['hunger','clean','energy','happy'].every(k=>d[k]>=90)&&Date.now()-(d.superAt||0)>60000){ d.superAt=Date.now(); d.st.sh++; save(); setTimeout(()=>{confetti();say(`${d.name} is super happy! You get a star!`);addStar(1);checkVIP(d)},1200) }
  checkVIP(d);
}

/* ---------- park ---------- */
function rPark(m){
  m.style.overflow='hidden';
  const hr=new Date().getHours(),night=hr>=19||hr<6, fams=(P.families||[]).slice(0,3);
  const fl=[[6,4,'🌷'],[18,26,'🌼'],[44,6,'🍄'],[64,30,'🌷'],[80,8,'🌼'],[92,22,'🪨'],[30,40,'🌿'],[56,44,'🌸'],[88,40,'🌿'],[12,46,'🪨']];
  m.innerHTML=`<div class="col"><div class="scene ${night?'night':''}" id="scene">
   ${night?`<div class="moon" onclick="say('Good night, moon!')">🌙</div>${[[10,6],[24,12],[40,4],[58,10],[70,3],[86,14],[50,18]].map(([x,y],i)=>`<span class="twk" style="left:${x}%;top:${y}%;animation-delay:${i*.3}s">✦</span>`).join('')}`:`<div class="sun" onclick="tapSun()"><i></i></div>`}
   <div class="deco cloud" style="top:3%;font-size:46px">☁️</div><div class="deco cloud" style="top:12%;font-size:32px;animation-delay:-20s">☁️</div>
   <div class="fly" style="top:9%">🐦</div><div class="fly" style="top:15%;animation-delay:-9s;font-size:16px">🐦</div>
   <svg class="mtn" viewBox="0 0 400 60" preserveAspectRatio="none"><polygon points="0,60 0,34 24,34 24,22 52,22 52,10 80,10 80,26 110,26 110,16 140,16 140,30 170,30 170,8 200,8 200,24 236,24 236,14 266,14 266,32 300,32 300,18 330,18 330,28 362,28 362,12 400,12 400,60" fill="${night?'#3a4a7a':'#8fb3d6'}"/><polygon points="0,60 0,44 40,44 40,36 90,36 90,46 140,46 140,38 200,38 200,48 260,48 260,40 320,40 320,50 400,50 400,60" fill="${night?'#2c3a63':'#a9c8e6'}"/></svg>
   <div class="volc" id="volc" onclick="tapVolcano()"><svg viewBox="0 0 100 70"><polygon points="4,70 38,12 62,12 96,70" fill="#7a4a2a" stroke="#4a2614" stroke-width="1.5"/><polygon points="38,12 62,12 58,22 53,16 49,27 45,16 41,22" fill="#ff5a1f"/><path d="M50 26 Q46 44 40 56" stroke="#ff7a1f" stroke-width="3.5" fill="none"><animate attributeName="opacity" values="1;.4;1" dur="1.5s" repeatCount="indefinite"/></path></svg><div class="puff" style="left:44%;top:0"></div><div class="puff" style="left:52%;top:-4%;animation-delay:-1.5s"></div></div>
   ${fams.map((f,i)=>`<div class="minih" style="left:${22+i*16}%" onclick="event.stopPropagation();go('house','${f.id}')">${houseSVG(f)}</div>`).join('')}
   <div class="deco" style="left:2%;top:17%;font-size:56px">🌴</div><div class="deco" style="left:14%;top:23%;font-size:36px">🌳</div><div class="deco" style="right:30%;top:23%;font-size:34px">🌲</div>
   <div class="ground"></div>
   <div class="lake" onclick="tapLake()"><svg viewBox="0 0 120 46"><ellipse cx="60" cy="23" rx="58" ry="21" fill="#4fb3ea" stroke="#2f8fd8" stroke-width="3"/><ellipse cx="48" cy="18" rx="30" ry="8" fill="#8fd3ff" opacity=".7"/><ellipse cx="90" cy="30" rx="7" ry="3" fill="#3aa04a"/><ellipse cx="28" cy="30" rx="6" ry="2.6" fill="#3aa04a"/><circle cx="90" cy="28" r="1.6" fill="#F49AC1"/><ellipse cx="62" cy="26" rx="6" ry="2" fill="none" stroke="#fff" stroke-width="1"><animate attributeName="rx" values="2;14" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2.5s" repeatCount="indefinite"/></ellipse></svg><span class="duck">🦆</span></div>
   ${fl.map(([x,y,e])=>`<div class="deco" style="left:${x}%;bottom:${y}%;font-size:22px;z-index:2">${e}</div>`).join('')}
   <div class="nest" onclick="SFX.pop();say('A dino egg! Let\\'s hatch it!');go('adopt')">🪺<small>Hatch!</small></div>
   <div class="bfly" style="left:58%;bottom:36%">🦋</div><div class="bfly" style="left:22%;bottom:24%;animation-delay:-3s">🦋</div>
   ${P.dinos.length?'':`<div class="empty" style="position:absolute;inset:40% 0 0;z-index:95"><button class="brick" style="--c:#FFCD03;--t:#222;font-size:24px" onclick="go('adopt')">🥚 Get your first dino!</button></div>`}
  </div><div class="menu">${MENU2.map(([ic,l,s,c])=>{const lab=s==='kid'?P.name:l;return `<button class="brick" style="--c:${c};--t:${txt(c)}" onclick="menuGo('${s}','${lab.replace(/[^\w ]/g,'')}')"><span class="ic">${ic}</span>${esc(lab)}</button>`}).join('')}</div></div>`;
  startWander();
  parkFx=setInterval(()=>{ if(Math.random()<.5) fishJump() },4500);
}
function tapSun(){ SFX.boing(); anim($('.sun'),'jump'); say('Hello, sunshine!') }
function tapVolcano(){ const v=$('#volc'); SFX.rumble(); anim(v,'erupt',900); setTimeout(SFX.boom,400); bigText('BOOM!','#ff7a1f'); burst(['🔥','🪨','💨','✨'],8,82,18); say('Rumble rumble! The volcano says hello!') }
function tapLake(){ SFX.splash(); fishJump(); fishJump(); say('Splash! The fish say hi!') }
function fishJump(){ const l=$('.lake'); if(!l) return; const f=document.createElement('span'); f.className='fishjump'; f.textContent=rnd(['🐟','🐠','🐟']); f.style.left=(15+Math.random()*55)+'%'; l.appendChild(f); setTimeout(()=>f.remove(),1100) }
function tapParkDino(id){
  const d=getD(id); if(!d) return; ensureDino(d); sel=id; SFX.roar(d);
  const w=walkers.find(x=>x.d&&x.d.id===id); if(w){anim(w.el.firstChild.firstChild,'jump');w.pause=2}
  say(`Hi! I am ${d.name}, the ${SP[d.species].name}!`,500);
  showCard(`<div class="bigwrap" style="width:200px">${dinoSVG(d)}</div><div class="dname">${esc(d.name)}</div><div class="dkind">${SP[d.species].name} · 🏆 ${d.st.w} wins · 🚚 ${d.st.trips} trips</div><div class="skrow big">${skIcons(d)}</div>
   <div class="row"><button class="brick" style="--c:#F57D20" onclick="closeCard();go('care')">🍖 Care</button><button class="brick" style="--c:#8E4FB5" onclick="closeCard();go('dress')">🎨 Dress</button><button class="brick" style="--c:#E3000B" onclick="closeCard();B.a='${d.id}';go('battle')">💥 Battle</button><button class="brick" style="--c:#00A84F" onclick="closeCard();go('bye')">👋 Bye</button></div>
   <button class="brick" style="--c:#9BA19D" onclick="closeCard()">✖ Close</button>`);
}

/* ---------- dress up ---------- */
function rDress(m){
  const d=getSel(); if(!d) return emptyState(m,'You have no dinos yet!'); ensureDino(d);
  const tabs=[['color','🎨 Color'],['spots','✨ Spots'],['head','👑 Hats'],['face','🕶️ Face'],['neck','🧣 Neck'],['back','🎒 Back'],['size','📏 Size'],['name','🔤 Name'],['skills','⚡ Skills']];
  if(!tabs.some(t=>t[0]===dTab)) dTab='color';
  let panel='';
  if(dTab==='color') panel=`<div class="sw">${COLORS.map(([n,h])=>`<button style="background:${h}" class="${d.color===h?'sel':''}" onclick="setProp('color','${h}','${n}!')"></button>`).join('')}</div>`;
  if(dTab==='spots') panel=`<div class="chips">${[['none','No spots'],['spots','Spots'],['stripes','Stripes']].map(([v,l])=>`<button class="brick ${d.pattern===v?'on':''}" style="--c:#F57D20" onclick="setProp('pattern','${v}','${l}!')">${l}</button>`).join('')}</div><p class="sub">Spots and plates color</p><div class="sw">${COLORS.map(([n,h])=>`<button style="background:${h}" class="${d.accent===h?'sel':''}" onclick="setProp('accent','${h}','${n}!')"></button>`).join('')}</div>`;
  if(ACC[dTab]){ const n=ACC[dTab].filter(x=>x[3]).length;
    panel=`<p class="sub" style="font-size:15px">🌟 VIP items: ${n} — unlock them by playing!</p><div class="chips items">${ACC[dTab].map(([id,ic,lb,vip])=>{const lock=vip&&!d.vip[id]; return `<button class="brick it ${vip?'vipi':''} ${lock?'lock':''} ${d.acc[dTab]===id?'on':''}" onclick="setAcc('${dTab}','${id}')"><span class="iic">${lock?'🔒':ic}</span><span class="ilb">${lb}</span>${vip?'<i class="vtag">VIP</i>':''}${lock?`<span class="req">${VIPS[id].t}</span>`:''}</button>`}).join('')}</div>`; }
  if(dTab==='size') panel=`<div class="chips"><button class="brick ${d.size==='big'?'on':''}" style="--c:#0057A6;font-size:26px" onclick="setProp('size','big','Big dino!')">🦖 Big</button><button class="brick ${d.size==='baby'?'on':''}" style="--c:#F49AC1;font-size:22px" onclick="setProp('size','baby','Baby dino!')">🐣 Baby</button></div>`;
  if(dTab==='name') panel=`<div class="chips">${NAMES.map(n=>`<button class="brick ${d.name===n?'on':''}" style="--c:${COLORS[n.length%COLORS.length][1]};--t:${txt(COLORS[n.length%COLORS.length][1])}" onclick="setName('${n}')">${n}</button>`).join('')}</div><div class="row"><button class="brick" style="--c:#8E4FB5" onclick="setName(rnd(NAMES))">🎲 Surprise</button><button class="brick" style="--c:#2A2A2A" onclick="typeName()">✏️ Type a name</button></div>`;
  if(dTab==='skills'){ const f=FIGHT[d.species]||FIGHT.trex,sp=skS(d.sk.sp),bar=(v,c)=>`<div class="sbar"><i style="width:${Math.min(100,v*70)}%;background:${c}"></i></div>`;
    panel=`<div class="skcards">${d.sk.n.map(id=>{const s=skN(id);return `<div class="skc"><div class="ske">${s.e}</div><b>${s.n}</b><small>${SKTXT[s.t]}</small></div>`}).join('')}<div class="skc spc"><div class="vtag2">✨ SPECIAL</div><div class="ske">${sp.e}</div><b>${sp.n}</b><small>${MODETXT[sp.m]}</small></div></div>
     <div class="statbox"><div>❤️ Power ${bar(f.hp,'#E3000B')}</div><div>💥 Attack ${bar(f.atk,'#F57D20')}</div><div>⚡ Speed ${bar(f.spd,'#0057A6')}</div></div>
     <div class="trophy">🏆 ${d.st.w} wins · 💥 ${d.st.ko} K.O · 🌟 ${d.st.perf} perfect · 🚚 ${d.st.trips} trips · 🌲 ${d.st.gw} guards · 🎁 ${Object.keys(d.vip).length}/10 VIP</div>`; }
  m.innerHTML=`${picker()}<div class="stage"><div class="bigwrap" id="dbig" onclick="tapBig()">${dinoSVG(d)}</div><div class="dname">${esc(d.name)}</div></div>
   <div class="tabs">${tabs.map(([k,l])=>`<button class="brick ${dTab===k?'on':''}" onclick="dTab='${k}';SFX.click();keepScroll(()=>render())">${l}</button>`).join('')}</div><div class="panel">${panel}</div>
   <div class="row" style="padding-bottom:20px"><button class="brick" style="--c:#00A84F;font-size:24px" onclick="dressDone()">✅ Done!</button></div>`;
}
function setAcc(slot,id){ const d=getSel(); ensureDino(d); const it=accItem(id);
  if(it[3]&&!d.vip[id]){ SFX.count(); anim($('#dbig'),'shake'); say(`${it[2]} is a VIP item! ${VIPS[id].t} to unlock it!`); return }
  d.acc[slot]=id; save(); SFX.pop(); say(id==='none'?'Okay!':it[2]+'!'); keepScroll(()=>render()); anim($('#dbig'),'jump') }

/* ---------- family + house detail ---------- */
const FAMNAMES=['Happy','Sunny','Rocky','Jungle','Star','Rainbow','Lucky','Cozy','Volcano','Ocean'];
function newFamily(){ const used=P.families.map(f=>f.color); const c=COLORS.find(x=>!used.includes(x[1])&&x[1]!=='#F4F4F4')||rnd(COLORS);
  P.families.push({id:uid(),name:`${c[0]} Family`,color:c[1],deco:{style:rnd(HSTYLES)[0],wall:'#F4F4F4',door:'#8B5A2B',items:['flowers']}}); save(); SFX.pop(); say(`A new house for the ${c[0]} Family!`); render(); $('#main').scrollTop=9999 }
function groupBy(keyFn,nameFn,colorFn,msg){ const old={}; P.families.forEach(f=>old[f.name]=f.deco); P.families=[]; const map={};
  P.dinos.forEach(d=>{const k=keyFn(d); if(!map[k]){const n=nameFn(d); map[k]={id:uid(),name:n,color:colorFn(d),deco:old[n]||{style:rnd(HSTYLES)[0],wall:'#F4F4F4',door:'#8B5A2B',items:['flowers']}}; P.families.push(map[k])} d.family=map[k].id});
  famSel=null; save(); SFX.fanfare(); confetti(); say(msg); P.dinos.forEach(checkVIP); render() }
function rFamily(m){
  if(!P.dinos.length) return emptyState(m,'You have no dinos yet!');
  P.dinos.forEach(d=>{ if(d.family&&!P.families.find(f=>f.id===d.family)) d.family=null });
  const chip=d=>`<div class="fd ${famSel===d.id?'sel':''}" onclick="event.stopPropagation();famPick('${d.id}')">${dinoSVG(d)}<span>${esc(d.name)}</span></div>`, wild=P.dinos.filter(d=>!d.family);
  m.innerHTML=`<div class="hint">${famSel?'👉 Now tap a house!':'👆 Tap a dino, then tap a house! 🔍 to look inside.'}</div>
   <div class="wild" onclick="dropTo(null)"><div class="lbl">🌿 Wild dinos (${wild.length})</div><div class="fdinos">${wild.map(chip).join('')}</div></div>
   <div class="houses">${P.families.map(f=>{const mem=P.dinos.filter(d=>d.family===f.id); return `<div class="hcard ${famSel?'drop':''}" style="--c:${f.color}" onclick="dropTo('${f.id}')"><div class="hpic">${houseSVG(f)}</div><div class="hrow"><span>🏠 ${esc(f.name)} · ${mem.length}</span><span><button class="x look" onclick="event.stopPropagation();go('house','${f.id}')">🔍 Look</button> <button class="x" onclick="event.stopPropagation();delFamily('${f.id}')">✖</button></span></div><div class="fdinos">${mem.map(chip).join('')}</div></div>`}).join('')}</div>
   <div class="row" style="padding-bottom:24px"><button class="brick" style="--c:#0057A6" onclick="newFamily()">➕ New house</button><button class="brick" style="--c:#F57D20" onclick="sortKind()">🦕 Same kind together</button><button class="brick" style="--c:#8E4FB5" onclick="sortColor()">🎨 Same color together</button></div>`;
}
window.dropTo=(o=>function(fid){ o(fid); if(P) P.dinos.forEach(checkVIP) })(window.dropTo);
let houseId=null,hTab='style';
function rHouse(m,fid){
  if(fid) houseId=fid; const f=P.families.find(x=>x.id===houseId); if(!f){ screen='family'; return render() }
  f.deco=f.deco||{style:'cottage',wall:'#F4F4F4',door:'#8B5A2B',items:[]}; const dc=f.deco,mem=P.dinos.filter(d=>d.family===f.id),n=Math.min(6,mem.length);
  const tabs=[['style','🏡 Style'],['wall','🧱 Walls'],['roof','🔺 Roof'],['door','🚪 Door'],['items','🌷 Things'],['name','🔤 Name']];
  let panel='';
  if(hTab==='style') panel=`<div class="hstyles">${HSTYLES.map(([s,ic,l])=>`<button class="tile ${dc.style===s?'on':''}" onclick="hSet('style','${s}','${l}')">${houseSVG(Object.assign({},f,{deco:Object.assign({},dc,{style:s})}))}<b>${ic} ${l}</b></button>`).join('')}</div>`;
  if(hTab==='wall'||hTab==='door'||hTab==='roof'){ const cur=hTab==='roof'?f.color:dc[hTab]; panel=`<div class="sw">${COLORS.concat([['Wood','#8B5A2B'],['Cream','#f3e9d2']]).map(([nm,h])=>`<button style="background:${h}" class="${cur===h?'sel':''}" onclick="hSet('${hTab}','${h}','${nm}')"></button>`).join('')}</div>`; }
  if(hTab==='items') panel=`<div class="chips">${HITEMS.map(([k,ic,l])=>`<button class="brick ${dc.items.includes(k)?'on':''}" style="--c:${dc.items.includes(k)?'#00A84F':'#9BA19D'};font-size:17px" onclick="hItem('${k}','${l}')">${ic} ${l}</button>`).join('')}</div>`;
  if(hTab==='name') panel=`<div class="chips">${FAMNAMES.map(x=>`<button class="brick" style="--c:${f.color};--t:${txt(f.color)}" onclick="hSet('name','${x} Family','${x} Family')">${x}</button>`).join('')}</div><div class="row"><button class="brick" style="--c:#2A2A2A" onclick="const n=prompt('House name:',P.families.find(x=>x.id===houseId).name);if(n&&n.trim())hSet('name',n.trim().slice(0,20),n.trim().slice(0,20))">✏️ Type a name</button></div>`;
  m.innerHTML=`<div class="${fid?'zoomin':''}"><div class="hbig">${houseSVG(f)}${mem.slice(0,6).map((d,i)=>`<div class="hmem" style="left:${n===1?40:2+i*(78/(n-1))}%" onclick="memTap('${d.id}')">${dinoSVG(d)}</div>`).join('')}</div>
   <div class="dname" style="text-align:center">🏠 ${esc(f.name)}</div><div class="center sub">${mem.length} ${mem.length===1?'dino lives':'dinos live'} here</div>
   <div class="fdinos">${mem.map(d=>`<div class="fd" onclick="memTap('${d.id}')">${dinoSVG(d)}<span>${esc(d.name)}</span><span class="mini">${SP[d.species].name}</span></div>`).join('')||'<p>No dinos yet. Add some in Family!</p>'}</div>
   <h3 class="gh">🎨 Decorate the house</h3><div class="tabs">${tabs.map(([k,l])=>`<button class="brick ${hTab===k?'on':''}" onclick="hTab='${k}';SFX.click();keepScroll(()=>render())">${l}</button>`).join('')}</div><div class="panel">${panel}</div>
   <div class="row" style="padding-bottom:24px"><button class="brick" style="--c:#0057A6" onclick="go('family')">⬅️ All houses</button></div></div>`;
  if(fid){ say(`Welcome to the ${f.name} house! ${mem.length} ${mem.length===1?'dino lives':'dinos live'} here.`); SFX.pop() }
}
function hSet(k,v,word){ const f=P.families.find(x=>x.id===houseId); if(!f) return; if(k==='roof') f.color=v; else if(k==='name') f.name=v; else f.deco[k]=v; save(); SFX.pop(); say(word+'!'); keepScroll(()=>render()) }
function hItem(k,l){ const f=P.families.find(x=>x.id===houseId); const it=f.deco.items; const i=it.indexOf(k); if(i>=0) it.splice(i,1); else it.push(k); save(); SFX.boing(); say(i>=0?'Bye bye '+l:l+'!'); keepScroll(()=>render()) }
function memTap(id){ const d=getD(id); SFX.roar(d); say(`Hi! I am ${d.name}! I live here!`) }

/* ---------- Bami wardrobe ---------- */
function rKid(m){
  m.innerHTML=`<h2>👕 ${esc(P.name)}'s clothes</h2><div class="kidbig" onclick="SFX.boing();anim(this,'jump');say('Hi! I am ${P.name.replace(/[^\w ]/g,'')}!')">${kidSVG(P)}</div>
   <div class="grid kidg">${OUTFITS.map(([id,ic,n])=>`<button class="tile ${P.outfit===id?'on':''}" onclick="setOutfit('${id}')"><div class="kt">${kidSVG({outfit:id})}</div><b>${ic} ${n}</b></button>`).join('')}</div>
   <div class="row" style="padding-bottom:24px"><button class="brick" style="--c:#2A2A2A" onclick="go('truck')">🚚 Drive the truck</button><button class="brick" style="--c:#00A84F" onclick="go('park')">🌳 Park</button></div>`;
}
function setOutfit(id){ P.outfit=id; save(); SFX.pop(); const o=OUTFITS.find(x=>x[0]===id); say(`${o[2]}! ${P.name} looks great!`); keepScroll(()=>render()); anim($('.kidbig'),'jump'); updateHeader() }

/* ---------- wiring ---------- */
Object.assign(SCREENS,{guard:rGuard,house:rHouse,kid:rKid,rank:rRank});
window.createPlayer=(o=>function(){ o(); ensurePlayer(P); save(); updateHeader() })(window.createPlayer);
window.pickPlayer=(o=>function(id){ ensurePlayer(DB.players.find(p=>p.id===id)); o(id) })(window.pickPlayer);
const renderV1=render; render=function(a){ if(P) ensurePlayer(P); renderV1(a) };
render();
