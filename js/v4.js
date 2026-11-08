/* v4: 4 new rides (police truck, race car, super car, sky plane) + dino line-up so the truck never hides dinos */
const VEH={
 monster:{n:'Monster Truck',h:120,seats:[[0,70],[17,70],[34,70],[51,70]],sw:21,drv:'seat',dl:71,db:58,dw:17,snd:'honk'},
 tow:{n:'Tow Truck',h:110,seats:[[6,48],[27,48],[48,48]],sw:25,drv:'head',dl:76.5,db:52,dw:14,snd:'honk'},
 police:{n:'Police Truck',h:120,seats:[[4,78],[22,78],[40,78]],sw:20,drv:'head',dl:74,db:47,dw:14,snd:'siren'},
 race:{n:'Race Car',h:100,seats:[[4,50],[22,52]],sw:22,drv:'head',dl:47,db:45,dw:15,snd:'race'},
 super:{n:'Super Car',h:90,seats:[[4,50],[22,54]],sw:20,drv:'head',dl:50,db:50,dw:14,snd:'race'},
 plane:{n:'Sky Plane',h:110,seats:[[10,58],[28,62],[58,64]],sw:19,drv:'head',dl:81,db:43,dw:12,snd:'prop',fly:1}
};
SFX.siren=()=>{for(let i=0;i<4;i++){tone(660,.18,'square',.07,null,i*.36);tone(880,.18,'square',.07,null,i*.36+.18)}};
SFX.race=()=>{tone(110,.9,'sawtooth',.13,620);tone(220,.9,'square',.04,900);noise(.8,.06,'lowpass',600,2400)};
SFX.prop=()=>{for(let i=0;i<10;i++) noise(.06,.18,'lowpass',500,null,i*.09); tone(90,.9,'sawtooth',.06,140)};
const tire=(x,y,r,rim)=>Cc(x,y,r,'#1a1a1a')+Cc(x,y,r*.68,rim)+Cc(x,y,r*.5,'#2a2a2a')+Cc(x,y,r*.16,'#777');
const vSVG={
 police:()=>R(18,68,172,20,'#222',null,3)+R(8,30,135,52,'#1f4fd1','#123a9e',5)+R(14,23,112,9,'#fff','#ccc',3)
   +R(12,45,46,2,'#00A84F')+R(12,48,46,8,'#E3000B')+R(12,57,46,2,'#00A84F')+R(104,45,36,15,'#fff','#ccc',1)+[108,116,124,132].map(x=>`<polygon points="${x},58 ${x+4},47 ${x+7},47 ${x+3},58" fill="#E3000B"/>`).join('')
   +R(62,30,40,52,'#f4f4f4','#ccc',3)+Cc(82,48,10,'#1f4fd1')+`<polygon points="82,40 84.4,45.5 90.3,45.7 85.7,49.3 87.3,55 82,51.7 76.7,55 78.3,49.3 73.7,45.7 79.6,45.5" fill="#FFCD03"/><text x="82" y="72" font-size="7.5" font-weight="700" fill="#1f4fd1" text-anchor="middle" font-family="Arial">CẢNH SÁT</text>`
   +`<path d="M140 40 L170 40 L190 62 L192 88 L140 88 Z" fill="#1f4fd1" stroke="#123a9e"/>`+R(148,46,18,14,'#2a2a2a',null,2)+R(170,48,11,12,'#2a2a2a',null,2)+R(186,72,6,7,'#FFCD03')
   +`<rect x="116" y="14" width="16" height="9" rx="2" fill="#E3000B"><animate attributeName="fill" values="#E3000B;#ff8a8a;#E3000B" dur=".5s" repeatCount="indefinite"/></rect>`+R(100,16,12,7,'#5AB4E5',null,2)
   +tire(52,94,24,'#fff')+tire(158,94,24,'#fff'),
 race:()=>R(2,28,32,5,'#222',null,2)+R(15,33,4,18,'#222')+R(4,22,4,12,'#222')
   +`<path d="M14 72 L18 54 L66 46 L94 38 L132 38 L172 52 L194 62 L192 74 L14 76 Z" fill="#d7261e" stroke="#8a1410" stroke-width="1.5"/>`
   +`<path d="M94 40 L130 40 L120 54 L98 54 Z" fill="#222"/><path d="M90 42 Q112 18 142 46" stroke="#222" stroke-width="3" fill="none"/><path d="M100 41 Q118 24 136 44" stroke="#222" stroke-width="2" fill="none"/>`+R(102,28,18,4,'#222',null,1)
   +`<path d="M24 64 L120 57 L184 61" stroke="#5AB4E5" stroke-width="2.6" fill="none"/><path d="M40 69 L134 64" stroke="#FFCD03" stroke-width="2" fill="none"/><polygon points="182,58 194,62 186,64" fill="#FFCD03"/>`+R(12,74,182,5,'#222')
   +tire(50,80,16,'#9BA19D')+tire(154,80,16,'#9BA19D'),
 super:()=>R(4,30,30,4,'#111',null,2)+R(15,34,4,12,'#111')
   +`<path d="M8 66 L10 50 L40 44 L80 30 L120 26 L150 34 L190 52 L194 64 L190 70 L10 72 Z" fill="#FFD60A" stroke="#b39500" stroke-width="1.5"/>`
   +`<path d="M80 32 L118 27 L146 37 L122 44 L86 44 Z" fill="#1b1b1b"/><polygon points="58,48 84,46 76,62" fill="#1b1b1b"/><polygon points="176,52 190,56 184,60" fill="#2a2a2a"/><path d="M40 52 L48 50 L44 56 L52 56" stroke="#E3000B" stroke-width="1.6" fill="none"/>`+R(30,68,140,4,'#111')
   +tire(50,72,15,'#1f1f1f')+tire(152,72,15,'#1f1f1f'),
 plane:()=>`<polygon points="20,58 4,18 18,18 36,48" fill="#55722d" stroke="#33461b"/><polygon points="32,52 24,24 34,24 44,48" fill="#4a6527" stroke="#33461b"/>`
   +`<path d="M20 62 Q20 44 50 42 L150 40 Q190 42 196 66 Q190 84 150 84 L40 82 Q20 80 20 62 Z" fill="#55722d" stroke="#33461b" stroke-width="1.5"/>`
   +`<ellipse cx="70" cy="58" rx="16" ry="6" fill="#2d3d17"/><ellipse cx="128" cy="50" rx="12" ry="5" fill="#2d3d17"/><ellipse cx="100" cy="72" rx="14" ry="4" fill="#2d3d17"/>`
   +`<path d="M166 48 Q186 52 194 62 L168 62 Z" fill="#1b1b1b"/>`+R(64,32,90,8,'#62803a','#33461b',3)+R(98,16,22,32,'#55722d','#33461b',7)
   +`<g transform="translate(109,15)"><rect x="-28" y="-2" width="56" height="4" rx="2" fill="#222"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur=".35s" repeatCount="indefinite"/></rect></g>`+Cc(109,15,3.5,'#222')
   +`<text x="138" y="76" font-size="9" font-weight="700" fill="#fff" font-family="Arial">MH-09</text>`+R(136,78,40,2,'#F57D20')+Cc(62,90,6,'#222')+Cc(156,90,6,'#222')
};
window.truckSVG=(o=>function(t){ if(vSVG[t]) return `<svg class="tsvg" viewBox="0 0 200 ${VEH[t].h}" xmlns="http://www.w3.org/2000/svg">${vSVG[t]()}</svg>`; return o(t) })(window.truckSVG);

function vehHTML(){ const V=VEH[T.type];
  return truckSVG(T.type)+T.loaded.map((id,i)=>`<div class="seat ${i===T.loaded.length-1&&T.justIn?'hopin':''}" style="left:${V.seats[i][0]}%;bottom:${V.seats[i][1]}%;width:${V.sw}%">${dinoSVG(getD(id))}</div>`).join('')
   +`<div class="vdrv" style="left:${V.dl}%;bottom:${V.db}%;width:${V.dw}%" onclick="tapDriver()">${kidSVG(P,V.drv==='seat'?{seat:1}:{head:1})}</div>` }
function rTruck(m){
  if(!P.dinos.length) return emptyState(m,'You have no dinos yet!');
  if(T.phase==='run'||T.phase==='driving') T.phase='load';
  T.loaded=T.loaded.filter(id=>getD(id)); if(!DEST[T.at]) T.at='park';
  if(!T.type||!VEH[T.type]){ T.type=null; m.innerHTML=`<h2>Pick a ride!</h2><div class="grid vgrid">${Object.entries(VEH).map(([k,v])=>`<button class="tile" onclick="pickTruck('${k}')">${truckSVG(k)}<b>${v.n}</b></button>`).join('')}</div>${tripBoard()}`; say('Pick a ride!'); return }
  const V=VEH[T.type],field=P.dinos.filter(d=>!T.loaded.includes(d.id)),dst=DEST[T.at],L=T.last,max=V.seats.length;
  m.innerHTML=`<div class="tscene t4" id="tscene">${sceneSVG(T.at)}<div class="truck ${T.phase==='arrived'?'drivein':''}" id="truck">${vehHTML()}</div></div>
   ${T.phase==='arrived'&&L?`<div class="tres"><div class="tres-t">${L.ok?'🎉':'🚧'} ${dst[0]} ${dst[1]}!</div><div class="tres-r"><span>🏁 <b>${L.score}</b></span><span>🪙 +${L.earned}</span><span>⭐ +1</span></div>${L.isBest?'<div class="newbest">🏆 NEW BEST!</div>':''}</div>`:''}
   <div class="hint">${T.phase==='load'?(T.loaded.length?`${T.type==='sleigh'?'🛷':V.fly?'✈️':'🚚'} ${T.loaded.length} / ${max} dinos on the ${V.n}. Where to go?`:`👇 Tap a dino to get on the ${V.n}!`):`🎉 We are at the ${dst[1]}!`}</div>
   ${T.phase==='load'?`<div class="lineup"><div class="fdinos">${field.map(d=>`<div class="fd" onclick="catchD('${d.id}')">${dinoSVG(d)}<span>${esc(d.name)}</span></div>`).join('')||'<p>Everyone is on board! 🎉</p>'}</div></div>`:''}
   <div class="row" style="padding-bottom:12px">${T.phase==='load'&&T.loaded.length?Object.entries(DEST).filter(([k])=>k!==T.at).map(([k,v])=>`<button class="brick" style="--c:${k==='park'?'#00A84F':'#0057A6'}" onclick="drive('${k}')">${v[0]} ${v[1]}</button>`).join(''):''}
   ${T.phase==='arrived'?`<button class="brick" style="--c:#00A84F;font-size:22px" onclick="unload()">🚪 Get out!</button><button class="brick" style="--c:#0057A6" onclick="T.phase='load';render()">${V.fly?'✈️ Fly on':'🚚 Drive on'}</button>`:''}
   ${T.phase==='load'?`<button class="brick" style="--c:#9BA19D" onclick="T.type=null;T.loaded=[];render()">🔄 Other ride</button>`:''}</div>${tripBoard()}`;
  T.justIn=false;
}
function pickTruck(t){ T.type=t; T.loaded=[]; T.phase='load'; const V=VEH[t]; (SFX[V.snd]||SFX.honk)(); say(`${P.name} drives the ${V.n}! ${{siren:'Nee naw nee naw!',race:'Vroom vroom!',prop:'Whirr whirr!',honk:'Beep beep!'}[V.snd]}`); render() }
function catchD(id){ const V=VEH[T.type],d=getD(id); if(T.loaded.length>=V.seats.length){ say(`The ${V.n} is full!`); (SFX[V.snd]||SFX.honk)(); return }
  T.loaded.push(id); T.justIn=true; SFX.boing(); say(`${d.name} hops in! ${T.loaded.length}!`); render() }
function tapDriver(){ const V=VEH[T.type]; (SFX[V.snd]||SFX.honk)(); anim(document.querySelector('.vdrv'),'jump'); say(rnd([`${P.name} is driving!`,'Hold on, dinos!',V.fly?'Up in the sky!':'Beep beep!'])) }
function truckImgURL(){ const V=VEH[T.type],tH=V.h,top=150-tH; let s=nestSVG(truckSVG(T.type),0,top,200,tH);
  T.loaded.forEach((id,i)=>{ const d=getD(id); if(!d) return; const w=V.sw*2*(d.size==='baby'?.7:1),h=w*112/132,yb=top+tH*(1-V.seats[i][1]/100); s+=nestSVG(dinoSVG(d),V.seats[i][0]*2+(V.sw*2-w)/2,yb-h,w,h) });
  const w=V.dw*2,kh=V.drv==='seat'?w*82/60:w*48/50; s+=nestSVG(kidSVG(P,V.drv==='seat'?{seat:1}:{head:1}),V.dl*2,top+tH*(1-V.db/100)-kh,w,kh);
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="400" height="300">${s}</svg>`) }
window.drive=(o=>function(k){ o(k); if(RN&&VEH[T.type]) setTimeout(()=>{ if(RN) (SFX[VEH[T.type].snd]||SFX.honk)() },200) })(window.drive);

/* v5: Engineering Truck + Christmas Sleigh */
Object.assign(VEH,{
 engineer:{n:'Engineering Truck',h:120,seats:[[2,57],[19,57],[36,57]],sw:19,drv:'head',dl:73,db:74,dw:13,snd:'digger'},
 sleigh:{n:'Christmas Sleigh',h:110,seats:[[6,53],[25,53],[44,53]],sw:19,drv:'head',dl:66,db:53,dw:14,snd:'jingle',fly:1}
});
SFX.digger=()=>{tone(70,1,'sawtooth',.14,95);for(let i=0;i<3;i++) tone(1000,.18,'square',.07,null,.2+i*.35)};
SFX.jingle=()=>{for(let i=0;i<10;i++) tone(2000+Math.random()*1400,.12,'triangle',.06,null,i*.08);[784,784,784].forEach((f,i)=>tone(f,.18,'square',.05,null,.9+i*.2))};
Object.assign(vSVG,{
 engineer:()=>R(18,64,156,20,'#222',null,3)+R(6,50,108,14,'#2a2a2a','#000',3)+[16,30,44,58,72,86,100].map(x=>Cc(x,55,1.6,'#555')).join('')+R(90,44,22,8,'#2a2a2a','#000',2)
   +R(64,64,62,24,'#1b1b1b',null,2)+R(70,66,50,8,'#E3000B',null,4)+`<text x="95" y="72.5" font-size="5.6" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">ENGINEERING</text>`+R(72,75,46,7,'#F5A623')+`<text x="95" y="81" font-size="6.5" font-weight="700" fill="#1b1b1b" text-anchor="middle" font-family="Arial">TRUCK</text>`+[74,82,90,98,106].map(x=>`<polygon points="${x},88 ${x+4},83 ${x+7},83 ${x+3},88" fill="#F5A623"/>`).join('')
   +R(118,26,66,46,'#E8952F','#a8641a',4)+R(124,12,48,18,'#E8952F','#a8641a',4)+R(130,16,16,11,'#1b1b1b',null,2)+R(150,16,16,11,'#1b1b1b',null,2)+[34,38,42].map(y=>`<line x1="172" y1="${y}" x2="184" y2="${y}" stroke="#a8641a" stroke-width="1.2"/>`).join('')
   +`<path d="M116 38 H188 M116 38 V62 M188 38 V62 M139 38 V62 M164 38 V62 M116 50 H188" stroke="#1b1b1b" stroke-width="2.6" fill="none" stroke-linecap="round"/>`+R(182,56,12,28,'#E8952F','#a8641a',2)
   +tire(48,94,24,'#E8952F')+tire(150,94,24,'#E8952F'),
 sleigh:()=>`<path d="M8 98 H168 Q192 98 190 80" stroke="#E8B923" stroke-width="5" fill="none" stroke-linecap="round"/>`+[40,90,140].map(x=>`<line x1="${x}" y1="86" x2="${x}" y2="98" stroke="#E8B923" stroke-width="4"/>`).join('')
   +`<path d="M14 50 Q12 88 42 88 L158 88 Q182 88 186 64 Q190 42 174 40 L158 50 Z" fill="#d7261e" stroke="#8a1410" stroke-width="1.5"/>`+R(14,46,148,6,'#00A84F','#00733a',3)+[24,44,64,84,104,124,144].map(x=>Cc(x,49,1.8,'#FFCD03')).join('')
   +`<path d="M30 66 Q60 58 90 66 T150 66" stroke="#FFCD03" stroke-width="2.5" fill="none"/>`
   +`<path d="M178 64 V28 Q178 16 166 18 Q158 20 160 28" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M178 64 V28 Q178 16 166 18 Q158 20 160 28" stroke="#E3000B" stroke-width="5" fill="none" stroke-dasharray="4 4"/>`
   +`<path d="M186 56 l3 -7 l3 7 l-3 7 Z" fill="#FFCD03"><animate attributeName="opacity" values="1;.2;1" dur=".8s" repeatCount="indefinite"/></path><path d="M6 40 l2 -5 l2 5 l-2 5 Z" fill="#fff"><animate attributeName="opacity" values=".2;1;.2" dur="1s" repeatCount="indefinite"/></path>`
   +Cc(170,48,4,'#FFCD03','#b38f00')+Cc(164,52,3.5,'#FFCD03','#b38f00')
});

/* v6: shorter sleigh pulled by a reindeer, with an original Christmas elf sitting behind Bami */
VEH.sleigh=Object.assign(VEH.sleigh,{seats:[[0,47],[11,49]],sw:15,dl:31,db:49,dw:13});
vSVG.sleigh=()=>{
  const leg=(x,d)=>`<rect x="${x}" y="66" width="5" height="20" rx="2" fill="#7a4a23" stroke="#4e2e14" stroke-width=".8"><animateTransform attributeName="transform" type="rotate" values="-22 ${x+2.5} 66;22 ${x+2.5} 66;-22 ${x+2.5} 66" dur=".5s" begin="${d}s" repeatCount="indefinite"/></rect>`;
  let s='';
  /* reindeer */
  s+=leg(138,0)+leg(146,-.25)+leg(168,-.12)+leg(176,-.37);
  s+=`<rect x="132" y="48" width="50" height="22" rx="9" fill="#8B5A2B" stroke="#4e2e14" stroke-width="1.2"/><ellipse cx="156" cy="64" rx="16" ry="5" fill="#d9b48a"/><circle cx="131" cy="52" r="4" fill="#fff"/>`;
  s+=`<rect x="172" y="30" width="11" height="24" rx="4" fill="#8B5A2B" stroke="#4e2e14" stroke-width="1.2" transform="rotate(12 177 42)"/><rect x="172" y="20" width="22" height="15" rx="6" fill="#8B5A2B" stroke="#4e2e14" stroke-width="1.2"/>`;
  s+=`<path d="M176 21 L170 8 M173 14 L166 12 M182 20 L186 6 M185 12 L192 10" stroke="#c7955a" stroke-width="2.6" stroke-linecap="round" fill="none"/><ellipse cx="173" cy="24" rx="4" ry="2.2" fill="#6b3f1c" transform="rotate(-30 173 24)"/>`;
  s+=`<circle cx="195" cy="28" r="3.6" fill="#E3000B"><animate attributeName="r" values="3.6;4.3;3.6" dur="1s" repeatCount="indefinite"/></circle><circle cx="186" cy="25" r="2" fill="#222"/><circle cx="186.6" cy="24.4" r=".7" fill="#fff"/><path d="M190 32 q2 2 4 0" stroke="#4e2e14" stroke-width="1" fill="none"/>`;
  s+=`<rect x="150" y="47" width="5" height="24" fill="#E3000B"/><rect x="170" y="38" width="10" height="4" rx="2" fill="#E3000B" transform="rotate(12 175 40)"/>`+[54,60,66].map(y=>Cc(152.5,y,2.4,'#FFCD03','#b38f00',.6)).join('');
  /* harness */
  s+=`<path d="M100 62 Q118 56 152 58" stroke="#E3000B" stroke-width="2.4" fill="none"/>`+Cc(120,58,2.4,'#FFCD03','#b38f00',.6)+Cc(136,57,2.4,'#FFCD03','#b38f00',.6);
  /* original elf (behind Bami) */
  s+=R(37,48,26,10,'#2d9a3e','#1a5a26',4)+`<polygon points="40,40 33,34 40,46" fill="#FFD93B" stroke="#c9a200"/><polygon points="60,40 67,34 60,46" fill="#FFD93B" stroke="#c9a200"/>`+Cc(50,41,11,'#FFD93B','#c9a200');
  
  s+=`<path d="M38 34 Q44 14 60 16 Q70 18 74 30 L67 28 Q60 22 62 34 Z" fill="#2d9a3e" stroke="#1a5a26"/>`+R(37,31,26,5,'#fff','#ccc',2.5)+Cc(74,31,3.2,'#FFCD03','#b38f00',.8);
  s+=Cc(45.5,40,3,'#fff','#222',.8)+Cc(54.5,40,3,'#fff','#222',.8)+Cc(46.2,40.3,1.5,'#222')+Cc(55.2,40.3,1.5,'#222')+Cc(46.7,39.6,.5,'#fff')+Cc(55.7,39.6,.5,'#fff')+Cc(42.5,45,1.8,'#ffab91')+Cc(57.5,45,1.8,'#ffab91')+`<path d="M46.5 46 Q50 50 53.5 46 Z" fill="#fff" stroke="#222" stroke-width="1"/>`;
  s+=`<polygon points="38,51 42,55 46,51 50,55 54,51 58,55 62,51 62,49 38,49" fill="#fff" stroke="#ddd" stroke-width=".6"/>`;
  /* sleigh (short) */
  s+=`<path d="M4 98 H92 Q110 98 108 82" stroke="#E8B923" stroke-width="5" fill="none" stroke-linecap="round"/>`+[26,70].map(x=>`<line x1="${x}" y1="86" x2="${x}" y2="98" stroke="#E8B923" stroke-width="4"/>`).join('');
  s+=`<path d="M8 54 Q6 88 30 88 L82 88 Q102 88 104 66 Q106 46 94 44 L84 54 Z" fill="#d7261e" stroke="#8a1410" stroke-width="1.5"/>`+R(8,50,80,6,'#00A84F','#00733a',3)+[16,30,44,58,72].map(x=>Cc(x,53,1.7,'#FFCD03')).join('');
  s+=`<path d="M18 70 Q34 63 50 70 T84 70" stroke="#FFCD03" stroke-width="2.5" fill="none"/>`;
  s+=`<path d="M98 64 V34 Q98 24 88 26 Q82 28 84 34" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M98 64 V34 Q98 24 88 26 Q82 28 84 34" stroke="#E3000B" stroke-width="4.5" fill="none" stroke-dasharray="4 4"/>`;
  s+=`<path d="M112 40 l3 -7 l3 7 l-3 7 Z" fill="#FFCD03"><animate attributeName="opacity" values="1;.2;1" dur=".8s" repeatCount="indefinite"/></path><path d="M124 26 l2 -5 l2 5 l-2 5 Z" fill="#fff"><animate attributeName="opacity" values=".2;1;.2" dur="1s" repeatCount="indefinite"/></path>`;
  return s;
};
