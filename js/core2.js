/* Bami's Dino Park v2 — core: skills, accessories, outfits, houses, economy, special-skill mini-games */
var SCREENS={};
const R=(x,y,w,h,f,s,rx=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"${s?` stroke="${s}" stroke-width="1"`:''}/>`;
const Cc=(x,y,r,f,s,sw=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${s?` stroke="${s}" stroke-width="${sw}"`:''}/>`;
const EMO='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

/* ---------- fight stats & anchors ---------- */
const ANCH={trex:{nk:[65,31],bk:[42,30]},stego:{nk:[80,47],bk:[50,36]},trike:{nk:[73,50],bk:[42,36]},brachio:{nk:[68,38],bk:[44,44]},raptor:{nk:[63,27],bk:[47,26]},ptero:{nk:[80,29],bk:[57,28]},anky:{nk:[82,51],bk:[48,40]},spino:{nk:[68,37],bk:[44,34]}};
const FIGHT={trex:{hp:1,atk:1.2,spd:1},stego:{hp:1.2,atk:.95,spd:.95},trike:{hp:1.15,atk:1.05,spd:.95},brachio:{hp:1.35,atk:.85,spd:.85},raptor:{hp:.85,atk:1,spd:1.35},ptero:{hp:.85,atk:.95,spd:1.3},anky:{hp:1.4,atk:.85,spd:.85},spino:{hp:1.05,atk:1.15,spd:1}};
const HERB=['stego','trike','brachio','anky'];

/* ---------- skills: 36 normal + 12 special ---------- */
const SK=[['meat','Meat Toss','🍖','hit',10],['splash','Water Splash','💦','hit',9],['rock','Rock Roll','🪨','hit',11],['leaf','Leaf Storm','🍃','hit',9],
 ['tail','Tail Swipe','💨','hit',10],['roar','Big Roar','📣','stun',5],['stomp','Stomp Stomp','👣','hit',12],['coco','Coconut Bonk','🥥','hit',11],
 ['banana','Banana Slip','🍌','stun',4],['bubble','Bubble Blast','🫧','hit',9],['snow','Snowball','❄️','slow',7],['pie','Mud Pie','🥧','hit',10],
 ['egg','Egg Bounce','🥚','hit',9],['tickle','Feather Tickle','🪶','stun',3],['nut','Pinecone Pop','🌰','hit',10],['fish','Fish Slap','🐟','hit',11],
 ['sneeze','Big Sneeze','🤧','hit',9],['sun','Sun Beam','☀️','hit',11],['twist','Mini Tornado','🌪️','hit',10],['bloom','Flower Power','🌸','heal',14],
 ['berry','Berry Snack','🍓','heal',12],['nap','Power Nap','😴','heal',20],['shell','Shell Shield','🐢','shield',0],['leafsh','Leaf Shield','🌿','shield',0],
 ['dance','Happy Dance','💃','buff',0],['flex','Power Stretch','💪','buff',0],['bump','Belly Bump','💥','hit',12],['bonk','Head Bonk','💫','hit',12],
 ['pillow','Pillow Fight','☁️','hit',8],['rainbow','Rainbow Spit','🌈','hit',11],['zap','Lightning Zap','⚡','hit',12],['icecream','Ice Cream Freeze','🍦','slow',8],
 ['boing','Bounce Jump','🦘','hit',10],['cactus','Cactus Roll','🌵','hit',11],['honey','Honey Trap','🍯','stun',5],['star','Star Toss','⭐','hit',11]
].map(([id,n,e,t,p])=>({id,n,e,t,p}));
const SPC=[['meteor','Meteor Shower','☄️','ring','hit',34],['megaroar','Mega Roar','📢','hold','stun',24],['volcano','Volcano Burst','🌋','bar','hit',36],['tsunami','Tsunami Wave','🌊','bar','hit',32],
 ['quake','Earthquake Stomp','🦶','tap','hit',34],['thunder','Thunder Storm','⛈️','aim','hit',34],['meatrain','Giant Meat Rain','🍖','tap','hit',32],['laser','Rainbow Laser','🌈','ring','hit',38],
 ['tornado','Tornado Spin','🌪️','hold','hit',34],['comet','Comet Dash','💫','aim','hit',36],['bloomsp','Healing Bloom','🌺','ring','heal',30],['iceage','Ice Age','🧊','bar','freeze',26]
].map(([id,n,e,m,t,p])=>({id,n,e,m,t,p}));
const skN=id=>SK.find(s=>s.id===id)||SK[0], skS=id=>SPC.find(s=>s.id===id)||SPC[0];
function rollSkills(){const a=[...SK].sort(()=>Math.random()-.5);return {n:[a[0].id,a[1].id],sp:rnd(SPC).id}}
const SKTXT={hit:'Throws it at the other dino',stun:'Makes the other dino dizzy',slow:'Makes the other dino slow',heal:'Heals itself',shield:'Makes a bubble shield',buff:'Makes the next hits stronger',freeze:'Freezes the other dino'};
const MODETXT={ring:'Tap when the ring touches the circle!',bar:'Tap when the line is on yellow!',tap:'Tap tap tap! As fast as you can!',aim:'Tap the moving target!',hold:'Hold down… let go in the green!'};
const GR={Miss:{m:.25,c:'#9BA19D'},Bad:{m:.5,c:'#F57D20'},Cool:{m:.8,c:'#5AB4E5'},Great:{m:1.1,c:'#00A84F'},Perfect:{m:1.5,c:'#FFCD03'}};
function skIcons(d){ensureDino(d);return d.sk.n.map(id=>`<span class="ski">${skN(id).e}</span>`).join('')+`<span class="ski sp">${skS(d.sk.sp).e}</span>`}

/* ---------- accessories (32 items, 10 VIP) ---------- */
const ACC={
 head:[['none','❌','No hat'],['cap','🧢','Cap'],['bow','🎀','Bow'],['flower','🌸','Flower'],['party','🎉','Party hat'],['cowboy','🤠','Cowboy hat'],['chef','🍳','Chef hat'],['pirate','🏴‍☠️','Pirate hat'],['beanie','🧶','Beanie'],['bunny','🐰','Bunny ears'],['viking','⚔️','Viking helmet'],['propeller','🚁','Propeller cap'],['crown','👑','Golden Crown',1],['racing','🏁','Racing Helmet',1],['ranger','🌲','Ranger Hat',1]],
 face:[['none','❌','Nothing'],['glasses','🕶️','Sunglasses'],['round','👓','Round glasses'],['heartg','💕','Heart glasses'],['shades','🌟','Star Shades',1]],
 neck:[['none','❌','Nothing'],['scarf','🧣','Scarf'],['bowtie','🎗️','Bow tie'],['bell','🔔','Bell collar'],['lei','🌺','Flower necklace'],['medal','🥇','Champion Medal',1],['heart','💖','Heart Necklace',1],['family','🏅','Family Medal',1]],
 back:[['none','❌','Nothing'],['backpack','🎒','Backpack'],['wings','🕊️','Angel wings'],['saddle','🐴','Saddle'],['shell','🐢','Turtle shell'],['rocket','🚀','Rocket Pack',1],['cape','🦸','Hero Cape',1],['rainbow','🌈','Rainbow Wings',1]]
};
const VIPS={
 crown:{t:'Win 3 battles',f:d=>d.st.w>=3},
 medal:{t:'Win 3 battles by K.O',f:d=>d.st.ko>=3},
 shades:{t:'Get 5 PERFECT specials',f:d=>d.st.perf>=5},
 racing:{t:'Score 400 on a truck trip',f:d=>d.st.tripBest>=400},
 rocket:{t:'Go on 5 truck trips',f:d=>d.st.trips>=5},
 ranger:{t:'Win 1 Forest Guard',f:d=>d.st.gw>=1},
 cape:{t:'Win 3 Forest Guards',f:d=>d.st.gw>=3},
 heart:{t:'Get 30 care hugs and meals',f:d=>d.st.care>=30},
 rainbow:{t:'Be super happy 3 times',f:d=>d.st.sh>=3},
 family:{t:'Live in a family of 3 or more',f:d=>!!d.family&&P&&P.dinos.filter(x=>x.family===d.family).length>=3}
};
const BEHIND={wings:1,cape:1,rainbow:1};
function accItem(id){for(const k in ACC){const f=ACC[k].find(x=>x[0]===id);if(f)return f}return ['none','','']}
function accSVG(id,sp,an){
  if(!id||id==='none') return '';
  const [cx,y]=sp.hat,[ex,ey]=sp.eye,[nx,ny]=an.nk,[bx,by]=an.bk;
  const tw=`<animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite"/>`;
  switch(id){
   case 'cap':case 'bow':case 'flower':case 'party':case 'glasses': return hatSVG(id,sp);
   case 'crown': return R(cx-10,y-10,20,10,'#FFCD03','#b38f00')+R(cx-10,y-16,5,6,'#FFCD03','#b38f00')+R(cx-2.5,y-18,5,8,'#FFCD03','#b38f00')+R(cx+5,y-16,5,6,'#FFCD03','#b38f00')+Cc(cx-5,y-5,1.8,'#E3000B')+Cc(cx,y-5,1.8,'#0057A6')+Cc(cx+5,y-5,1.8,'#00A84F')+`<circle cx="${cx+10}" cy="${y-17}" r="1.8" fill="#fff">${tw}</circle>`;
   case 'cowboy': return R(cx-15,y-3,30,3.5,'#8B5A2B','#5a3a1b',1.5)+R(cx-8,y-12,16,10,'#a0692f','#5a3a1b',3)+R(cx-8,y-6,16,2.2,'#E3000B');
   case 'chef': return R(cx-7,y-6,14,6,'#fff','#bbb')+Cc(cx-5,y-10,5,'#fff','#bbb')+Cc(cx+5,y-10,5,'#fff','#bbb')+Cc(cx,y-14,6,'#fff','#bbb');
   case 'pirate': return `<polygon points="${cx-14},${y} ${cx+14},${y} ${cx+9},${y-11} ${cx-9},${y-11}" fill="#222" stroke="#000"/>`+Cc(cx,y-5,2.6,'#fff')+R(cx-3,y-2.5,6,1.2,'#fff');
   case 'beanie': return R(cx-9,y-10,18,10,'#E3000B','#9a0008',4)+R(cx-9,y-3,18,3,'#fff')+R(cx-9,y-8,18,1.6,'#fff')+Cc(cx,y-12,3,'#fff','#ccc');
   case 'bunny': return R(cx-8,y-19,5,19,'#fff','#ccc',2.5)+R(cx-6.8,y-16,2.6,12,'#F49AC1',null,1.3)+R(cx+3,y-19,5,19,'#fff','#ccc',2.5)+R(cx+4.2,y-16,2.6,12,'#F49AC1',null,1.3);
   case 'viking': return `<path d="M${cx-10} ${y} Q${cx} ${y-17} ${cx+10} ${y} Z" fill="#9BA19D" stroke="#666"/>`+R(cx-10,y-2,20,3,'#8B5A2B')+`<path d="M${cx-9} ${y-4} Q${cx-16} ${y-8} ${cx-14} ${y-16}" stroke="#f4f0e0" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${cx+9} ${y-4} Q${cx+16} ${y-8} ${cx+14} ${y-16}" stroke="#f4f0e0" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
   case 'propeller': return `<path d="M${cx-9} ${y} Q${cx} ${y-14} ${cx+9} ${y} Z" fill="#FFCD03" stroke="#b38f00"/>`+`<path d="M${cx-9} ${y} Q${cx-5} ${y-12} ${cx} ${y-10} L${cx} ${y} Z" fill="#E3000B"/>`+R(cx-.8,y-14,1.6,5,'#555')+`<rect x="${cx-9}" y="${y-16}" width="18" height="2.4" rx="1.2" fill="#0057A6"><animate attributeName="width" values="18;2;18" dur=".3s" repeatCount="indefinite"/><animate attributeName="x" values="${cx-9};${cx-1};${cx-9}" dur=".3s" repeatCount="indefinite"/></rect>`;
   case 'racing': return `<path d="M${cx-11} ${y+2} Q${cx-11} ${y-15} ${cx} ${y-15} Q${cx+11} ${y-15} ${cx+11} ${y+2} Z" fill="#E3000B" stroke="#9a0008"/>`+R(cx-2,y-15,4,17,'#fff')+R(cx+3,y-7,10,5,'#1d2b5a',null,2)+R(cx+4,y-6.4,4,1.2,'#fff',null,.6)+`<circle cx="${cx-6}" cy="${y-10}" r="1.6" fill="#fff">${tw}</circle>`;
   case 'ranger': return R(cx-15,y-3,30,3.5,'#2d6a34','#1a4220',1.5)+`<path d="M${cx-8} ${y-2} L${cx-7} ${y-12} Q${cx} ${y-15} ${cx+7} ${y-12} L${cx+8} ${y-2} Z" fill="#3b8a44" stroke="#1a4220"/>`+R(cx-8,y-5,16,2.2,'#8B5A2B')+`<polygon points="${cx},${y-11} ${cx+1.6},${y-8} ${cx+4.6},${y-8} ${cx+2.2},${y-6} ${cx+3},${y-3} ${cx},${y-5} ${cx-3},${y-3} ${cx-2.2},${y-6} ${cx-4.6},${y-8} ${cx-1.6},${y-8}" fill="#FFCD03" stroke="#b38f00" stroke-width=".5"/>`;
   case 'round': return `<circle cx="${ex+3.8}" cy="${ey+3.8}" r="5.8" fill="rgba(160,220,255,.25)" stroke="#222" stroke-width="1.6"/>`+R(ex-6,ey+3,4,1.4,'#222');
   case 'heartg': return `<path d="M${ex+3.8} ${ey+10} L${ex-2.5} ${ey+3} Q${ex-3} ${ey-3} ${ex+3.8} ${ey+.5} Q${ex+10.5} ${ey-3} ${ex+10} ${ey+3} Z" fill="#F49AC1" stroke="#c2185b" stroke-width="1.2" opacity=".92"/>`+R(ex-7,ey+3,5,1.4,'#c2185b');
   case 'shades': return `<polygon points="${ex+4},${ey-4} ${ex+6.4},${ey+1.5} ${ex+12},${ey+2} ${ex+7.6},${ey+5.6} ${ex+9},${ey+11} ${ex+4},${ey+8} ${ex-1},${ey+11} ${ex+.4},${ey+5.6} ${ex-4},${ey+2} ${ex+1.6},${ey+1.5}" fill="#FFCD03" stroke="#b38f00"/>`+Cc(ex+4,ey+4,2.6,'#1d2b5a')+R(ex-8,ey+3,5,1.4,'#b38f00')+`<circle cx="${ex+11}" cy="${ey-3}" r="1.5" fill="#fff">${tw}</circle>`;
   case 'scarf': return R(nx-8,ny-3,16,6,'#E3000B','#9a0008',3)+R(nx-7,ny+2,5,11,'#E3000B','#9a0008',2)+R(nx-7,ny+6,5,1.5,'#fff')+R(nx-7,ny+9,5,1.5,'#fff')+R(nx-4,ny-3,2,6,'#fff')+R(nx+2,ny-3,2,6,'#fff');
   case 'bowtie': return `<polygon points="${nx},${ny} ${nx-8},${ny-5} ${nx-8},${ny+5}" fill="#0057A6" stroke="#003a70"/><polygon points="${nx},${ny} ${nx+8},${ny-5} ${nx+8},${ny+5}" fill="#0057A6" stroke="#003a70"/>`+Cc(nx,ny,2.2,'#003a70');
   case 'bell': return R(nx-8,ny-3,16,3.6,'#E3000B','#9a0008',1.8)+Cc(nx,ny+4,3.6,'#FFCD03','#b38f00')+R(nx-.6,ny+5,1.2,2,'#7a5a00');
   case 'lei': return [0,1,2,3,4,5,6].map(i=>Cc(nx-9+i*3,ny-1+Math.sin(i/6*Math.PI)*5,2.6,['#F49AC1','#FFCD03','#E3000B','#fff','#F57D20','#F49AC1','#FFCD03'][i],'rgba(0,0,0,.2)',.5)).join('');
   case 'medal': return `<polygon points="${nx-6},${ny-4} ${nx-2},${ny-4} ${nx+1},${ny+4} ${nx-3},${ny+4}" fill="#E3000B"/><polygon points="${nx+6},${ny-4} ${nx+2},${ny-4} ${nx-1},${ny+4} ${nx+3},${ny+4}" fill="#0057A6"/>`+Cc(nx,ny+8,5,'#FFCD03','#b38f00')+`<text x="${nx}" y="${ny+10.5}" font-size="7" text-anchor="middle" font-weight="700" fill="#b38f00" font-family="Arial">1</text><circle cx="${nx+4}" cy="${ny+5}" r="1.2" fill="#fff">${tw}</circle>`;
   case 'heart': return `<path d="M${nx-9} ${ny-3} Q${nx} ${ny+5} ${nx+9} ${ny-3}" stroke="#FFCD03" stroke-width="1.2" fill="none"/>`+`<path d="M${nx} ${ny+9} L${nx-4.5} ${ny+4} Q${nx-5} ${ny} ${nx} ${ny+2} Q${nx+5} ${ny} ${nx+4.5} ${ny+4} Z" fill="#ff4d8d" stroke="#c2185b" stroke-width=".8"/><circle cx="${nx-2}" cy="${ny+3}" r="1" fill="#fff">${tw}</circle>`;
   case 'family': return `<polygon points="${nx-5},${ny-4} ${nx+5},${ny-4} ${nx+2},${ny+4} ${nx-2},${ny+4}" fill="#0057A6"/>`+Cc(nx,ny+8,5,'#dfe6ec','#7a8a99')+`<polygon points="${nx-3},${ny+9} ${nx},${ny+5.5} ${nx+3},${ny+9}" fill="#E3000B"/>`+R(nx-2.2,ny+9,4.4,3,'#8B5A2B',null,.3);
   case 'backpack': return R(bx-8,by-11,16,14,'#F57D20','#b3561a',4)+R(bx-6,by-7,12,5,'#FFCD03',null,2)+R(bx+6,by-9,3,10,'#b3561a',null,1);
   case 'wings': return `<ellipse cx="${bx-6}" cy="${by-9}" rx="13" ry="5.5" fill="#fff" stroke="#c8d4dc" transform="rotate(-35 ${bx-6} ${by-9})"/><ellipse cx="${bx+2}" cy="${by-11}" rx="13" ry="5.5" fill="#f4f8fb" stroke="#c8d4dc" transform="rotate(-55 ${bx+2} ${by-11})"/>`;
   case 'saddle': return R(bx-10,by-4,20,6,'#8B5A2B','#5a3a1b',3)+R(bx-10,by-6,5,4,'#a0692f','#5a3a1b',1.5)+R(bx-1.5,by+2,3,8,'#5a3a1b')+R(bx-3,by+9,6,2.5,'#9BA19D');
   case 'shell': return `<path d="M${bx-13} ${by+1} Q${bx-12} ${by-15} ${bx} ${by-15} Q${bx+12} ${by-15} ${bx+13} ${by+1} Z" fill="#2d8a3e" stroke="#1a5a26"/>`+`<path d="M${bx-5} ${by-10} L${bx+5} ${by-10} L${bx+7} ${by-3} L${bx} ${by+1} L${bx-7} ${by-3} Z" fill="#7fc76a" stroke="#1a5a26" stroke-width=".7"/>`;
   case 'rocket': return R(bx-12,by-14,8,16,'#dfe6ec','#7a8a99',3)+`<polygon points="${bx-12},${by-14} ${bx-4},${by-14} ${bx-8},${by-21}" fill="#E3000B"/>`+R(bx-4,by-10,6,4,'#7a8a99')+`<polygon points="${bx-11},${by+2} ${bx-5},${by+2} ${bx-8},${by+11}" fill="#FFCD03"><animate attributeName="opacity" values="1;.4;1" dur=".25s" repeatCount="indefinite"/></polygon>`+Cc(bx-8,by-8,2,'#5AB4E5');
   case 'cape': return `<path d="M${bx+16} ${by-1} Q${bx-8} ${by+2} ${bx-30} ${by+28} L${bx-14} ${by+30} Q${bx} ${by+12} ${bx+16} ${by+6} Z" fill="#E3000B" stroke="#FFCD03" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" values="0 ${bx+16} ${by};-6 ${bx+16} ${by};0 ${bx+16} ${by}" dur="1.2s" repeatCount="indefinite"/></path>`;
   case 'rainbow': return ['#E3000B','#F57D20','#FFCD03','#00A84F','#0057A6','#8E4FB5'].map((c,i)=>`<path d="M${bx-22+i*2} ${by+2} Q${bx-6} ${by-30+i*3} ${bx+12-i*2} ${by+2}" stroke="${c}" stroke-width="2.4" fill="none"/>`).join('')+`<circle cx="${bx-14}" cy="${by-16}" r="1.6" fill="#fff">${tw}</circle>`;
  }
  return '';
}

/* dinoSVG with accessories (replaces v1) */
function dinoSVG(d,o={}){
  const sp=SP[d.species]; if(!sp) return '';
  const acc=d.acc||{head:d.hat||'none'}, an=ANCH[d.species]||{nk:[60,30],bk:[40,30]};
  const C={b:d.color,l:shade(d.color,.35),a:d.accent,w:'#fff'};
  let s='';
  if(BEHIND[acc.back]) s+=accSVG(acc.back,sp,an);
  for(const [x,y,w,h,r,st] of sp.blocks){
    const f=C[r]||d.color,k=shade(f,-.35);
    if(st){for(let i=x+3;i+4<=x+w-1;i+=7) s+=`<rect x="${i}" y="${y-2.6}" width="4.2" height="3.2" rx=".8" fill="${f}" stroke="${k}" stroke-width=".7"/>`}
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.6" fill="${f}" stroke="${k}" stroke-width="1"/>`;
    if(w>5&&h>5) s+=`<rect x="${x+1.2}" y="${y+1.2}" width="${w-2.4}" height="1.6" rx=".8" fill="#fff" opacity=".28"/>`;
    if(r==='b'&&w*h>=500&&d.pattern&&d.pattern!=='none'){
      if(d.pattern==='spots'){for(let k2=0,px=x+5;px+5<=x+w-3;px+=11,k2++) s+=`<rect x="${px}" y="${y+4+(k2%2)*Math.min(8,h-11)}" width="5" height="5" rx="1" fill="${d.accent}"/>`}
      else{for(let px=x+6;px+3<=x+w-2;px+=9) s+=`<rect x="${px}" y="${y+2}" width="3" height="${Math.round(h*.55)}" rx="1" fill="${d.accent}"/>`}
    }
  }
  const [ex,ey]=sp.eye,baby=d.size==='baby',es=baby?9:7.5;
  if(o.sleep) s+=`<rect x="${ex}" y="${ey+es/2}" width="${es}" height="2" rx="1" fill="#222"/>`;
  else s+=`<rect x="${ex}" y="${ey}" width="${es}" height="${es}" rx="1.5" fill="#fff" stroke="#222" stroke-width="1"/><rect x="${ex+es*.48}" y="${ey+es*.22}" width="${es*.4}" height="${es*.55}" rx=".8" fill="#222"/><rect x="${ex+es*.55}" y="${ey+es*.25}" width="1.3" height="1.3" fill="#fff"/>`;
  if(baby) s+=`<rect x="${ex-1}" y="${ey+es+2}" width="5" height="3" rx="1.5" fill="#ff8fab" opacity=".8"/>`;
  if(!BEHIND[acc.back]) s+=accSVG(acc.back,sp,an);
  s+=accSVG(acc.neck,sp,an)+accSVG(acc.face,sp,an)+accSVG(acc.head,sp,an);
  return `<svg class="dsvg${baby?' baby':''}" viewBox="-8 -22 132 112" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

/* ---------- Bami outfits ---------- */
const OUTFITS=[['dino','🦖','Dino Tee'],['cars','🚗','Car Tee'],['hoops','🏀','Basketball'],['sport','⚽','Sport Day'],['swim','🏊','Swim Day'],['hero','🦸','Super Bami'],['pjs','🌙','Pajamas']];
const OFS={
 dino:{sh:'#f7f7f7',st:'#bbb',sl:'#f7f7f7',pr:'dino',pa:'#0057A6',shoe:'#fff'},
 cars:{sh:'#f3efdc',st:'#c9c3a6',sl:'#f3efdc',pr:'cars',pa:'#5d6470',shoe:'#3a3a3a'},
 hoops:{sh:'#1f2f7a',st:'#121c4d',sl:'#fff',pr:'num',pa:'#1f2f7a',stripe:'#F5A04A',shoe:'#1b1b1b',ball:1},
 sport:{sh:'#a3123a',st:'#6e0b27',sl:'#a3123a',long:'#fff',pr:'collar',pa:'#a3123a',shoe:'#24305e',sock:1},
 swim:{sh:'#1b1b1b',st:'#000',sl:'#1b1b1b',long:'#1b1b1b',pr:'swim',pa:'#1b1b1b',shoe:'skin',hat:'bucket'},
 hero:{sh:'#00A84F',st:'#00733a',sl:'#00A84F',long:'#00A84F',pr:'hero',pa:'#00A84F',shoe:'#E3000B',cape:'#E3000B',belt:'#FFCD03'},
 pjs:{sh:'#5AB4E5',st:'#2f7fb0',sl:'#5AB4E5',long:'#5AB4E5',pr:'moons',pa:'#5AB4E5',shoe:'#5AB4E5',hat:'night'}
};
function kidSVG(p,o={}){
  const of=OFS[(p&&p.outfit)||'dino']||OFS.dino, sk='#F3CFAE', sk2='#d6a47e';
  const vb=o.head?'5 -2 50 48':o.seat?'0 0 60 82':'0 0 60 100';
  let s='';
  if(of.cape&&!o.head) s+=`<path d="M14 46 L46 46 L54 ${o.seat?80:90} L6 ${o.seat?80:90} Z" fill="${of.cape}" stroke="${shade(of.cape,-.35)}"/>`;
  if(!o.seat&&!o.head){
    const pa=of.pa,pd=shade(pa,-.35);
    s+=R(10,74,40,8,pa,pd,1.5)+R(11,81,18,14,pa,pd,1.5)+R(31,81,18,14,pa,pd,1.5);
    if(of.stripe) s+=R(12,80,2.5,14,of.stripe)+R(45.5,80,2.5,14,of.stripe);
    if(of.sock) s+=R(12,90,16,4,'#fff')+R(32,90,16,4,'#fff');
    const sh=of.shoe==='skin'?sk:of.shoe; s+=R(10,93,20,6,sh,shade(sh,-.3),2.5)+R(30,93,20,6,sh,shade(sh,-.3),2.5);
  }
  if(!o.head){
    const fc=of.long||sk, fd=of.long?shade(of.long,-.3):sk2;
    s+=R(3,47,11,11,of.sl,shade(of.sl,-.3),3)+R(46,47,11,11,of.sl,shade(of.sl,-.3),3);
    s+=o.seat?R(5,56,8,10,fc,fd,3)+R(47,56,8,10,fc,fd,3):R(5,56,8,12,fc,fd,3)+R(47,56,8,12,fc,fd,3)+Cc(9,70,4,sk,sk2)+Cc(51,70,4,sk,sk2);
    s+=`<polygon points="13,45 47,45 50,76 10,76" fill="${of.sh}" stroke="${of.st}"/>`;
    switch(of.pr){
     case 'dino': [['#F57D20',15,50],['#0057A6',35,49],['#E3000B',25,57],['#5AB4E5',40,62],['#2A2A2A',16,64],['#8E4FB5',29,68],['#00A84F',41,70],['#F57D20',22,71]].forEach(([c,x,y],i)=>{s+=i%2?`<polygon points="${x},${y+5} ${x+3},${y} ${x+6},${y+5}" fill="${c}"/>`:R(x,y,5,4,c)});break;
     case 'cars': [[15,51,'#E3000B'],[33,56,'#00A84F'],[19,65,'#c46a2a'],[35,68,'#2d6a34']].forEach(([x,y,c])=>{s+=R(x,y,8,3.5,c,null,1.2)+R(x+2,y-2,4,2.5,c,null,1)+Cc(x+2,y+4,1.2,'#222')+Cc(x+6,y+4,1.2,'#222')});break;
     case 'num': s+=`<text x="30" y="69" text-anchor="middle" font-size="17" font-weight="700" font-family="Arial,sans-serif" fill="${of.stripe||'#F5A04A'}">0</text><path d="M24 45 L30 51 L36 45" stroke="#fff" stroke-width="2" fill="none"/>`+`<line x1="14" y1="47" x2="11.5" y2="75" stroke="#F5A04A" stroke-width="1.5"/><line x1="46" y1="47" x2="48.5" y2="75" stroke="#F5A04A" stroke-width="1.5"/>`;break;
     case 'collar': s+=`<path d="M23 45 L30 51 L37 45" stroke="#fff" stroke-width="3" fill="none"/>`+R(3,54,11,1.6,'#fff')+R(46,54,11,1.6,'#fff')+`<path d="M18 60 L40 54 L34 62 L42 60" stroke="#F5A04A" stroke-width="1.6" fill="none"/>`;break;
     case 'swim': s+=`<line x1="16" y1="46" x2="13.5" y2="75" stroke="#fff" stroke-width="2.4"/><line x1="44" y1="46" x2="46.5" y2="75" stroke="#fff" stroke-width="2.4"/><line x1="30" y1="46" x2="30" y2="62" stroke="#bbb" stroke-width="1.2"/>`+R(4,52,1.8,12,'#fff')+R(54.2,52,1.8,12,'#fff');break;
     case 'hero': s+=`<polygon points="30,50 32.4,55.5 38.3,55.7 33.7,59.3 35.3,65 30,61.7 24.7,65 26.3,59.3 21.7,55.7 27.6,55.5" fill="#FFCD03" stroke="#b38f00" stroke-width=".8"/>`;break;
     case 'moons': [[16,52],[36,50],[26,62],[40,66],[17,68]].forEach(([x,y],i)=>{s+=i%2?Cc(x,y,1.6,'#FFCD03'):Cc(x,y,2.6,'#FFCD03')+Cc(x+1.2,y-.8,2.2,of.sh)});break;
    }
    if(of.belt) s+=R(11,70,38,4,of.belt,shade(of.belt,-.3),1)+R(27,69.5,6,5,'#fff','#ccc',1);
    s+=R(25,41,10,5,sk);
  }
  s+=Cc(15,30,3.5,sk,sk2)+Cc(45,30,3.5,sk,sk2)+`<rect x="15" y="12" width="30" height="31" rx="9" fill="${sk}" stroke="${sk2}"/>`;
  s+=R(26,2,8,4,'#1b1b1b')+`<path d="M13 29 L13 18 Q13 5 30 5 Q47 5 47 18 L47 29 L43.5 29 L43.5 22 L16.5 22 L16.5 29 Z" fill="#1b1b1b"/><path d="M16.5 21.5 L19 24 L22 22 L25 24.5 L28 22 L31 24.5 L34 22 L37 24.5 L40 22 L43.5 24 L43.5 21.5 Z" fill="#1b1b1b"/>`;
  s+=`<path d="M20 30 q3.5 -3.5 7 0" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M33 30 q3.5 -3.5 7 0" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>`+Cc(20,34,2.6,'#f4a3a3')+Cc(40,34,2.6,'#f4a3a3')+`<path d="M23 35 Q30 43 37 35 Z" fill="#fff" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/>`;
  if(of.hat==='bucket') s+=`<path d="M13 17 Q13 2 30 2 Q47 2 47 17 Z" fill="#FFCD03" stroke="#c99e00"/>`+R(7,15,46,5,'#FFCD03','#c99e00',2.5)+`<path d="M16 20 Q17 34 22 41 M44 20 Q43 34 38 41" stroke="#FFCD03" stroke-width="1" fill="none"/>`;
  if(of.hat==='night') s+=`<path d="M13 17 Q14 1 32 2 Q48 3 55 21 L48 19 Q43 10 30 10 Q19 10 13 17 Z" fill="#5AB4E5" stroke="#2f7fb0"/>`+R(12,14,36,5,'#fff','#ccc',2.5)+Cc(55,22,3.5,'#fff','#ccc')+Cc(36,7,1.3,'#FFCD03');
  if(o.seat) s+=`<circle cx="30" cy="70" r="10" fill="none" stroke="#2A2A2A" stroke-width="4"/>`+R(28,62,4,9,'#2A2A2A')+Cc(20,66,4,sk,sk2)+Cc(40,66,4,sk,sk2);
  if(of.ball&&!o.seat&&!o.head) s+=Cc(54,84,7,'#F57D20','#b3561a')+`<path d="M47 84 H61 M54 77 V91" stroke="#7a3a10" stroke-width=".8" fill="none"/>`;
  return `<svg class="ksvg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

/* ---------- family houses ---------- */
const HSTYLES=[['cottage','🏡','Cottage'],['castle','🏰','Castle'],['tree','🌳','Tree house'],['igloo','🧊','Igloo']];
const HITEMS=[['chimney','🧱','Chimney'],['flowers','🌷','Flowers'],['fence','🪵','Fence'],['lights','💡','Lights'],['flag','🚩','Flag'],['mailbox','📫','Mailbox'],['pool','🏊','Pool'],['swing','🎠','Swing'],['tree','🌳','Big tree']];
function houseSVG(f){
  const dc=f.deco||{},st=dc.style||'cottage',wall=dc.wall||'#F4F4F4',rf=f.color||'#E3000B',dr=dc.door||'#8B5A2B',it=dc.items||[],wd=shade(wall,-.28),rd=shade(rf,-.35),has=k=>it.includes(k);
  const win=(x,y,w=22,h=18)=>R(x,y,w,h,'#9fd8ff','#555',2)+`<path d="M${x+w/2} ${y} V${y+h} M${x} ${y+h/2} H${x+w}" stroke="#555" stroke-width="1"/>`;
  let s='',lights=[],peak=[120,28];
  if(has('tree')) s+=R(18,92,8,46,'#8B5A2B','#5a3a1b',2)+Cc(22,80,17,'#00A84F','#00733a')+Cc(10,92,10,'#00A84F','#00733a')+Cc(34,92,11,'#00A84F','#00733a')+Cc(16,76,2.2,'#E3000B')+Cc(28,86,2.2,'#E3000B');
  if(has('swing')) s+=`<path d="M206 138 L214 98 L222 138 M226 138 L234 98 L242 138" stroke="#8B5A2B" stroke-width="3" fill="none"/>`+R(212,96,24,3.5,'#8B5A2B')+`<line x1="221" y1="99" x2="221" y2="122" stroke="#555"/><line x1="227" y1="99" x2="227" y2="122" stroke="#555"/>`+R(218,121,12,3.5,'#E3000B');
  let h='';
  if(st==='cottage'){
    if(has('chimney')) h+=R(128,36,14,30,'#b0413e','#7a2a28',1)+`<circle cx="135" cy="30" r="4" fill="#fff" opacity=".8"><animate attributeName="cy" values="30;10" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="2.5s" repeatCount="indefinite"/></circle>`;
    h+=R(46,78,108,60,wall,wd,2); for(let y=88;y<138;y+=10) h+=`<line x1="46" y1="${y}" x2="154" y2="${y}" stroke="${wd}" stroke-width=".6" opacity=".5"/>`;
    h+=`<polygon points="34,80 166,80 100,28" fill="${rf}" stroke="${rd}" stroke-width="1.5"/>`+`<line x1="44" y1="74" x2="100" y2="34" stroke="#fff" stroke-width="2" opacity=".3"/>`;
    h+=R(88,104,24,34,dr,shade(dr,-.35),3)+Cc(107,122,1.8,'#FFCD03')+win(56,92)+win(122,92)+Cc(100,62,7,'#9fd8ff','#555');
    lights=[[40,80],[160,80]]; peak=[100,28];
  } else if(st==='castle'){
    h+=R(40,72,120,66,wall,wd); for(let i=0;i<7;i++) h+=R(40+i*18,63,11,10,wall,wd);
    h+=R(18,50,28,88,wall,wd)+R(154,50,28,88,wall,wd)+`<polygon points="13,52 51,52 32,18" fill="${rf}" stroke="${rd}"/><polygon points="149,52 187,52 168,18" fill="${rf}" stroke="${rd}"/>`;
    h+=`<path d="M86 138 L86 114 Q100 96 114 114 L114 138 Z" fill="${dr}" stroke="${shade(dr,-.35)}"/>`+R(27,70,10,16,'#9fd8ff','#555',5)+R(163,70,10,16,'#9fd8ff','#555',5)+win(56,90,16,18)+win(128,90,16,18);
    lights=[[40,72],[160,72]]; peak=[32,18];
  } else if(st==='tree'){
    h+=Cc(100,58,52,'#00A84F','#00733a')+Cc(56,76,26,'#00A84F','#00733a')+Cc(144,76,26,'#00A84F','#00733a')+Cc(76,30,3,'#E3000B')+Cc(130,40,3,'#E3000B');
    h+=R(90,96,20,42,'#8B5A2B','#5a3a1b',3)+R(54,94,92,6,'#8B5A2B','#5a3a1b',2);
    h+=R(62,58,76,36,wall,wd,2)+`<polygon points="54,60 146,60 100,26" fill="${rf}" stroke="${rd}" stroke-width="1.5"/>`+R(92,70,16,24,dr,shade(dr,-.35),2)+win(68,66,16,14)+win(116,66,16,14);
    h+=`<path d="M70 100 V138 M80 100 V138" stroke="#8B5A2B" stroke-width="2.5"/>`+[106,114,122,130].map(y=>`<line x1="70" y1="${y}" x2="80" y2="${y}" stroke="#8B5A2B" stroke-width="2"/>`).join('');
    lights=[[58,60],[142,60]]; peak=[100,26];
  } else {
    h+=`<path d="M38 138 A62 62 0 0 1 162 138 Z" fill="#f2fbff" stroke="#9cc6dd" stroke-width="1.5"/>`+[118,98].map(y=>`<path d="M${38+(138-y)*.35} ${y} H${162-(138-y)*.35}" stroke="#bfdcec" stroke-width="1.2"/>`).join('')+`<path d="M60 96 A46 46 0 0 1 140 96" stroke="#bfdcec" stroke-width="1.2" fill="none"/>`+[60,80,100,120,140].map((x,i)=>`<line x1="${x}" y1="${118}" x2="${x+(i%2?6:-6)}" y2="${138}" stroke="#bfdcec" stroke-width="1"/>`).join('');
    h+=`<path d="M80 138 L80 120 A20 20 0 0 1 120 120 L120 138 Z" fill="${dr}" stroke="${rf}" stroke-width="5"/>`;
    lights=[[50,104],[150,104]]; peak=[100,76];
  }
  if(has('lights')){ const [[x1,y1],[x2,y2]]=lights; for(let i=0;i<=8;i++){const x=x1+(x2-x1)*i/8,y=y1+(y2-y1)*i/8+Math.sin(i/8*Math.PI)*5; h+=`<circle cx="${x}" cy="${y}" r="2.6" fill="${['#E3000B','#FFCD03','#00A84F','#5AB4E5'][i%4]}"><animate attributeName="opacity" values="1;.35;1" dur="${.8+(i%3)*.3}s" repeatCount="indefinite"/></circle>`} }
  if(has('flag')){ const [px,py]=peak; h+=`<line x1="${px}" y1="${py}" x2="${px}" y2="${py-20}" stroke="#555" stroke-width="1.5"/><path d="M${px} ${py-20} L${px+14} ${py-16} L${px} ${py-12} Z" fill="#FFCD03" stroke="#b38f00"><animate attributeName="d" values="M${px} ${py-20} L${px+14} ${py-16} L${px} ${py-12} Z;M${px} ${py-20} L${px+13} ${py-14} L${px} ${py-12} Z;M${px} ${py-20} L${px+14} ${py-16} L${px} ${py-12} Z" dur="1s" repeatCount="indefinite"/></path>`; }
  s+=`<g transform="translate(20,0)">${h}</g>`;
  s+=R(0,136,240,24,'#9ad985'); for(let x=6;x<240;x+=12) s+=Cc(x,142,3.2,'#b3e6a1','#7fc96b',.6);
  if(has('pool')) s+=`<ellipse cx="44" cy="149" rx="28" ry="7" fill="#5AB4E5" stroke="#fff" stroke-width="2"/><ellipse cx="38" cy="148" rx="8" ry="2" fill="#fff" opacity=".6"/>`;
  if(has('mailbox')) s+=R(198,110,3,28,'#8B5A2B')+R(190,102,20,11,'#0057A6','#003a70',4)+R(207,94,2,9,'#E3000B');
  if(has('fence')) [[2,52],[188,238]].forEach(([a,b])=>{ s+=R(a,124,b-a,3,'#fff','#ccc'); for(let x=a;x<b-2;x+=8) s+=R(x,118,5,18,'#fff','#ccc',1) });
  if(has('flowers')) [58,66,74,166,174,182].forEach((x,i)=>{ s+=`<line x1="${x}" y1="136" x2="${x}" y2="128" stroke="#2d8a3e" stroke-width="1.5"/>`+Cc(x,126,3.4,['#F49AC1','#FFCD03','#E3000B','#8E4FB5','#fff','#F57D20'][i]) });
  return `<svg class="hsvg" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

/* ---------- migration / economy ---------- */
function ensureDino(d){
  if(!d) return d;
  if(!d.acc){ d.acc={head:'none',face:'none',neck:'none',back:'none'}; if(d.hat==='glasses') d.acc.face='glasses'; else if(d.hat&&d.hat!=='none') d.acc.head=d.hat; }
  d.vip=d.vip||{}; if(d.acc.head==='crown'&&d.hat==='crown') d.vip.crown=1;
  d.sk=d.sk||rollSkills();
  d.st=Object.assign({b:0,w:0,l:0,dr:0,ko:0,perf:0,trips:0,tripBest:0,gw:0,care:0,sh:0},d.st||{});
  d.glv=d.glv||0; return d;
}
function ensurePlayer(p){
  if(!p) return; p.coins=p.coins||0; p.outfit=p.outfit||'dino'; p.trips=p.trips||[];
  p.guard=Object.assign({lv:1,best:0,leafUp:0},p.guard||{});
  (p.families||[]).forEach(f=>{f.deco=f.deco||{style:'cottage',wall:'#F4F4F4',door:'#8B5A2B',items:['flowers']}});
  (p.dinos||[]).forEach(ensureDino);
}
DB.players.forEach(ensurePlayer);
function addCoins(n){ if(!P||!n) return; P.coins=(P.coins||0)+Math.round(n); save(); updateHeader(); SFX.coin(); }
let toastQ=[],toastOn=false;
function toast(h){ toastQ.push(h); if(!toastOn) nextToast() }
function nextToast(){ const h=toastQ.shift(); if(!h){toastOn=false;return} toastOn=true; const e=document.createElement('div'); e.className='toast'; e.innerHTML=h; $('#app').appendChild(e); setTimeout(()=>{e.remove();nextToast()},3500) }
function checkVIP(d){
  if(!d||!P) return; ensureDino(d);
  for(const id in VIPS){ if(!d.vip[id]&&VIPS[id].f(d)){ d.vip[id]=1; const it=accItem(id); toast(`🎁 VIP unlocked! ${it[1]} <b>${it[2]}</b> for ${esc(d.name)}`); say(`Wow! ${d.name} unlocked the ${it[2]}!`,1600); setTimeout(SFX.star,400) } }
  save();
}

/* ---------- extra sounds ---------- */
SFX.coin=()=>{tone(988,.08,'square',.07);tone(1319,.15,'square',.07,null,.07)};
SFX.jump=()=>tone(300,.2,'sine',.2,720);
SFX.whoosh=()=>noise(.22,.1,'bandpass',800,2400);
SFX.boom=()=>{noise(.8,.4,'lowpass',700,60);tone(90,.6,'sine',.3,40)};
SFX.vip=()=>{[523,659,784,1046,1319,1568].forEach((f,i)=>tone(f,.25,'triangle',.13,null,i*.07));noise(.9,.05,'highpass',5000,9000,.2)};
SFX.rumble=()=>{noise(1.2,.35,'lowpass',220,60);tone(55,1,'sine',.25,40)};
SFX.grade=g=>{ if(g==='Perfect'){[1046,1319,1568,2093].forEach((f,i)=>tone(f,.22,'square',.08,null,i*.07))} else if(g==='Great'){tone(784,.15,'square',.09);tone(1046,.25,'square',.09,null,.1)} else if(g==='Cool'){tone(659,.22,'triangle',.15,880)} else if(g==='Bad'){tone(392,.25,'triangle',.15,330)} else {tone(300,.35,'sawtooth',.07,180)} };

/* ---------- VIP special intro + timing mini-games ---------- */
function vipIntro(d,sp,cb,auto){
  const o=document.createElement('div'); o.className='vip';
  o.innerHTML=`<div class="rays"></div>${Array.from({length:10},(_,i)=>`<span class="spark" style="left:${8+Math.random()*84}%;top:${8+Math.random()*80}%;animation-delay:${(i*.13).toFixed(2)}s">✨</span>`).join('')}<div class="vbadge">✨ SPECIAL ✨</div><div class="vd">${dinoSVG(d)}</div><div class="vt">${sp.e} ${sp.n.toUpperCase()}!</div><div class="vsub">${esc(d.name)}</div>`;
  $('#app').appendChild(o); SFX.vip(); say(`${d.name}! ${sp.n}!`);
  setTimeout(()=>{o.remove();cb()},auto?1300:1800);
}
function gradeText(g){ const e=document.createElement('div'); e.className='bigtext'; e.style.color=GR[g].c; e.textContent=(g==='Perfect'?'🌟 ':'')+g.toUpperCase()+'!'; $('#app').appendChild(e); setTimeout(()=>e.remove(),1200); SFX.grade(g) }
function skillGame(sp,cb){
  const o=document.createElement('div'); o.className='sg';
  o.innerHTML=`<div class="how">${sp.e} ${MODETXT[sp.m]}</div><div class="box" id="sgb"></div><div id="sgr" class="sgres"></div>`;
  $('#app').appendChild(o); say(MODETXT[sp.m]);
  const box=o.querySelector('#sgb'); let done=false; const t0=performance.now()+700;
  const fin=g=>{ if(done) return; done=true; o.querySelector('#sgr').innerHTML=`<div class="grade" style="color:${GR[g].c}">${g==='Perfect'?'🌟 ':''}${g.toUpperCase()}!</div>`; SFX.grade(g); say(g+'!'); setTimeout(()=>{o.remove();cb(g)},1000) };
  if(sp.m==='ring'){
    box.innerHTML=`<div class="sg-target">${sp.e}</div><div class="sg-ring"></div>`; const ring=box.querySelector('.sg-ring');
    const sc=()=>3-2.7*Math.max(0,(performance.now()-t0)/2300);
    (function f(){ if(done) return; const v=sc(); ring.style.transform=`translate(-50%,-50%) scale(${Math.max(.3,v)})`; if(v<=.3) return fin('Miss'); requestAnimationFrame(f) })();
    o.onpointerdown=e=>{ e.preventDefault(); if(performance.now()<t0) return; const dl=Math.abs(sc()-1); fin(dl<.09?'Perfect':dl<.2?'Great':dl<.34?'Cool':dl<.6?'Bad':'Miss') };
  } else if(sp.m==='bar'){
    box.innerHTML=`<div class="sg-ico">${sp.e}</div><div class="sg-bar"><div class="sg-mk"></div></div>`; const mk=box.querySelector('.sg-mk'); let pos=0;
    (function f(){ if(done) return; const tt=Math.max(0,(performance.now()-t0)/1000); pos=50-50*Math.cos(tt*2.3); mk.style.left=pos+'%'; if(tt>9) return fin('Bad'); requestAnimationFrame(f) })();
    o.onpointerdown=e=>{ e.preventDefault(); if(performance.now()<t0) return; const dl=Math.abs(pos-50); fin(dl<4?'Perfect':dl<10?'Great':dl<18?'Cool':dl<30?'Bad':'Miss') };
  } else if(sp.m==='tap'){
    box.innerHTML=`<div class="sg-big" id="sgi">${sp.e}</div><div class="sg-cnt" id="sgc">Tap to start!</div><div class="sg-time"><i id="sgt"></i></div>`;
    let n=0,start=null; const big=box.querySelector('#sgi'),cnt=box.querySelector('#sgc'),tb=box.querySelector('#sgt');
    const tick=()=>{ if(done) return; const k=(performance.now()-start)/3000; tb.style.width=Math.max(0,100-k*100)+'%'; if(k>=1) return fin(n>=16?'Perfect':n>=12?'Great':n>=8?'Cool':n>=4?'Bad':'Miss'); requestAnimationFrame(tick) };
    o.onpointerdown=e=>{ e.preventDefault(); if(done||performance.now()<t0) return; if(!start){start=performance.now();tick()} n++; cnt.textContent=n; big.style.transform=`scale(${1.25+Math.random()*.2}) rotate(${Math.random()*30-15}deg)`; setTimeout(()=>big.style.transform='',80); tone(400+n*30,.05,'square',.05) };
    setTimeout(()=>{ if(!start) fin('Miss') },7000);
  } else if(sp.m==='aim'){
    box.innerHTML=`<div class="sg-aim" id="sga">${sp.e}</div>`; const a=box.querySelector('#sga'); const W=box.clientWidth,H=box.clientHeight;
    let x=W/2,y=H/2,vx=(Math.random()<.5?-1:1)*W*.42,vy=(Math.random()<.5?-1:1)*H*.38,last=performance.now(); const T0=last;
    (function f(){ if(done) return; const now=performance.now(),dt=(now-last)/1000; last=now; x+=vx*dt; y+=vy*dt; if(x<45||x>W-45){vx*=-1;x=Math.max(45,Math.min(W-45,x))} if(y<45||y>H-45){vy*=-1;y=Math.max(45,Math.min(H-45,y))} a.style.left=x+'px'; a.style.top=y+'px'; if(now-T0>7000) return fin('Miss'); requestAnimationFrame(f) })();
    o.onpointerdown=e=>{ e.preventDefault(); if(performance.now()<t0) return; const r=box.getBoundingClientRect(); const dist=Math.hypot(e.clientX-r.left-x,e.clientY-r.top-y)/45; fin(dist<.4?'Perfect':dist<.75?'Great':dist<1.15?'Cool':dist<2.2?'Bad':'Miss') };
  } else {
    box.innerHTML=`<div class="sg-ico">${sp.e}</div><div class="sg-meter"><div class="sg-zone"></div><i id="sgm"></i></div>`; const mt=box.querySelector('#sgm'); let v=0,holding=false,started=false,last=0;
    const loop=()=>{ if(done||!holding) return; const now=performance.now(); v+=55*(now-last)/1000; last=now; mt.style.height=Math.min(100,v)+'%'; if(v>=100){holding=false;return fin('Bad')} requestAnimationFrame(loop) };
    o.onpointerdown=e=>{ e.preventDefault(); if(done||performance.now()<t0) return; holding=true; started=true; v=0; last=performance.now(); loop() };
    o.onpointerup=o.onpointercancel=()=>{ if(!holding||done) return; holding=false; const dl=Math.abs(v-80); fin(dl<4?'Perfect':dl<9?'Great':dl<16?'Cool':dl<28?'Bad':'Miss') };
    setTimeout(()=>{ if(!started) fin('Miss') },8000);
  }
}
function wPick(){ const r=Math.random(); return r<.06?'Miss':r<.22?'Bad':r<.58?'Cool':r<.86?'Great':'Perfect' }
function rainFx(e,host,cx,cy,n){ for(let i=0;i<n;i++){ const s=document.createElement('div'); s.className='rain'; s.textContent=e; s.style.left=(cx+Math.random()*120-60)+'px'; s.style.top=(cy-160)+'px'; s.style.animationDelay=(i*.06)+'s'; s.style.setProperty('--dy','160px'); host.appendChild(s); setTimeout(()=>s.remove(),1400+i*60) } }

/* ---------- destination & trip themes ---------- */
const TH={
 park:{sky:['#7cc8ff','#d4f0ff'],far:'#9cc3e0',mid:'#7fcf6c',gr:'#9ad985',dk:'#6fbf5c',ob:['🪨','🚧','🌵'],deco:['🌳','🌲','🌴'],sun:1},
 volcano:{sky:['#ff8a3d','#ffd08a'],far:'#8a4b2e',mid:'#a8643a',gr:'#6b3e22',dk:'#4a2a16',ob:['🪨','🔥','🦴'],deco:['🌵','🌋','🌵']},
 beach:{sky:['#6fd0ff','#c8f0ff'],far:'#2f8fd8',mid:'#f3d98b',gr:'#e8c46a',dk:'#c9a24a',ob:['🦀','🏰','🐚'],deco:['🌴','⛱️','🌴'],sun:1},
 jungle:{sky:['#79c98a','#d8f5c8'],far:'#2d7a33',mid:'#3fa34a',gr:'#5b3a1e',dk:'#3e2713',ob:['🪵','🍄','🐸'],deco:['🌴','🌿','🦜']},
 snow:{sky:['#9fc9f3','#eef7ff'],far:'#c9d9ea',mid:'#ffffff',gr:'#e6f0fa',dk:'#b8cde0',ob:['⛄','🧊','🪨'],deco:['🌲','🏔️','🌲']}
};
function treeS(x,y,s=1,c='#00A84F'){return R(x-3*s,y-22*s,6*s,22*s,'#8B5A2B','#5a3a1b',1.5)+Cc(x,y-30*s,14*s,c,shade(c,-.3))+Cc(x-10*s,y-22*s,9*s,c,shade(c,-.3))+Cc(x+10*s,y-22*s,9*s,c,shade(c,-.3))}
function palmS(x,y,s=1){return `<path d="M${x} ${y} Q${x+6*s} ${y-30*s} ${x+2*s} ${y-58*s}" stroke="#8B5A2B" stroke-width="${6*s}" fill="none" stroke-linecap="round"/>`+[-60,-20,20,60,100,150].map(a=>`<ellipse cx="${x+2*s}" cy="${y-58*s}" rx="${22*s}" ry="${5*s}" fill="#2d9a3e" transform="rotate(${a} ${x+2*s} ${y-58*s}) translate(${16*s} 0)"/>`).join('')+Cc(x,y-54*s,3.5*s,'#8B5A2B')+Cc(x+5*s,y-55*s,3.5*s,'#8B5A2B')}
function pineS(x,y,s=1,snow){return R(x-3*s,y-10*s,6*s,10*s,'#8B5A2B')+[0,1,2].map(i=>`<polygon points="${x-(18-i*4)*s},${y-(8+i*14)*s} ${x+(18-i*4)*s},${y-(8+i*14)*s} ${x},${y-(30+i*14)*s}" fill="#2d6a34"/>`+(snow?`<polygon points="${x-(8-i*2)*s},${y-(22+i*14)*s} ${x+(8-i*2)*s},${y-(22+i*14)*s} ${x},${y-(30+i*14)*s}" fill="#fff"/>`:'')).join('')}
function sceneSVG(k){
  const th=TH[k]||TH.park,id='s'+(++svgN);
  let s=`<defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${th.sky[0]}"/><stop offset="1" stop-color="${th.sky[1]}"/></linearGradient><pattern id="p${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${th.gr}"/><circle cx="8" cy="8" r="4.6" fill="${th.dk}" opacity=".35"/><circle cx="7.3" cy="7.3" r="4" fill="#fff" opacity=".16"/></pattern></defs><rect width="400" height="260" fill="url(#g${id})"/>`;
  const cloud=(x,y,d)=>`<g opacity=".9"><animateTransform attributeName="transform" type="translate" values="-60 0;460 0" dur="${d}s" repeatCount="indefinite"/>${Cc(x,y,12,'#fff')+Cc(x+14,y-5,15,'#fff')+Cc(x+30,y,11,'#fff')}</g>`;
  if(k==='volcano'){
    s+=`<polygon points="250,160 300,92 330,92 390,160" fill="#7a4632" opacity=".7"/><polygon points="80,160 170,40 220,40 320,160" fill="#6b3a22" stroke="#4a2614" stroke-width="2"/><polygon points="170,40 220,40 214,56 204,46 196,64 188,46 178,58" fill="#ff5a1f"/><path d="M196 62 Q190 100 172 130 Q168 145 178 160" stroke="#ff7a1f" stroke-width="7" fill="none" opacity=".9"><animate attributeName="opacity" values=".9;.5;.9" dur="1.4s" repeatCount="indefinite"/></path><ellipse cx="195" cy="40" rx="30" ry="8" fill="#ffb347" opacity=".7"><animate attributeName="opacity" values=".7;.3;.7" dur="1s" repeatCount="indefinite"/></ellipse>`;
    for(let i=0;i<4;i++) s+=`<circle cx="${188+i*6}" cy="30" r="${10+i*3}" fill="#9a8a80" opacity=".7"><animate attributeName="cy" values="34;-30" dur="${3+i*.6}s" begin="${i*.7}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="${3+i*.6}s" begin="${i*.7}s" repeatCount="indefinite"/><animate attributeName="r" values="${8+i*2};${22+i*4}" dur="${3+i*.6}s" begin="${i*.7}s" repeatCount="indefinite"/></circle>`;
    s+=`<rect y="160" width="400" height="100" fill="url(#p${id})"/><ellipse cx="320" cy="214" rx="46" ry="12" fill="#ff5a1f" stroke="#ffb347" stroke-width="3"/>`+[0,1,2].map(i=>`<circle cx="${300+i*18}" cy="214" r="3" fill="#ffd08a"><animate attributeName="r" values="1;5;1" dur="${1+i*.4}s" repeatCount="indefinite"/></circle>`).join('')+`<polygon points="40,200 56,180 74,198 66,206" fill="#5a3a2a"/><polygon points="120,236 132,222 150,234" fill="#5a3a2a"/><text x="70" y="250" font-size="22">🦴</text><text x="240" y="196" font-size="24">🌵</text>`;
  } else if(k==='beach'){
    s+=`<circle cx="330" cy="44" r="22" fill="#FFE45C"/><circle cx="330" cy="44" r="30" fill="#FFE45C" opacity=".25"/>`+cloud(40,40,40)+`<rect y="104" width="400" height="60" fill="#2f8fd8"/>`;
    for(let i=0;i<3;i++) s+=`<path d="M-40 ${116+i*16} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"><animateTransform attributeName="transform" type="translate" values="0 0;40 0" dur="${2+i}s" repeatCount="indefinite"/></path>`;
    s+=`<text x="60" y="122" font-size="22">⛵<animateTransform attributeName="transform" type="translate" values="0 0;260 0;0 0" dur="30s" repeatCount="indefinite"/></text><rect y="160" width="400" height="100" fill="url(#p${id})"/>`+palmS(40,190,1)+palmS(370,200,.9)+`<line x1="300" y1="230" x2="306" y2="176" stroke="#555" stroke-width="2.5"/><path d="M276 182 Q306 156 336 182 Z" fill="#E3000B"/><path d="M296 168 Q306 160 316 168 L306 182 Z" fill="#fff"/><text x="120" y="236" font-size="22">🦀</text><text x="200" y="250" font-size="18">🐚</text><text x="236" y="214" font-size="20">🏰</text>`;
  } else if(k==='jungle'){
    s+=`<rect y="60" width="400" height="110" fill="#2d7a33" opacity=".6"/>`+[30,90,150,210,270,330,390].map((x,i)=>Cc(x,110+(i%2)*10,40,i%2?'#2d7a33':'#3a8f40')).join('');
    s+=`<rect x="300" y="40" width="34" height="122" fill="#9fdcff"/><path d="M304 40 V162 M312 40 V162 M320 40 V162 M328 40 V162" stroke="#fff" stroke-width="2" stroke-dasharray="8 10" opacity=".8"><animate attributeName="stroke-dashoffset" values="0;-36" dur=".7s" repeatCount="indefinite"/></path><ellipse cx="317" cy="164" rx="30" ry="7" fill="#fff" opacity=".7"/>`;
    s+=[20,70,140,210,250].map((x,i)=>`<path d="M${x} 0 Q${x+8} 30 ${x} ${50+i*8}" stroke="#2d9a3e" stroke-width="3" fill="none"><animateTransform attributeName="transform" type="rotate" values="-3 ${x} 0;3 ${x} 0;-3 ${x} 0" dur="${2+i*.3}s" repeatCount="indefinite"/></path>`).join('');
    s+=`<rect y="160" width="400" height="100" fill="url(#p${id})"/>`+treeS(60,186,1.3,'#1f8a3a')+treeS(230,180,1,'#2d9a3e')+palmS(380,200,.9)+`<text x="100" y="80" font-size="24">🦜</text><text x="150" y="240" font-size="22">🍄</text><text x="270" y="232" font-size="20">🌺</text><text x="20" y="246" font-size="20">🌿</text>`;
  } else if(k==='snow'){
    s+=`<polygon points="0,160 70,60 130,130 200,40 270,120 330,70 400,140 400,160" fill="#c9d9ea"/><polygon points="70,60 86,84 60,82" fill="#fff"/><polygon points="200,40 220,70 184,68" fill="#fff"/><polygon points="330,70 346,92 316,90" fill="#fff"/><rect y="160" width="400" height="100" fill="url(#p${id})"/>`+pineS(40,200,1.1,1)+pineS(90,186,.8,1)+pineS(360,206,1.2,1)+`<path d="M220 222 A34 34 0 0 1 288 222 Z" fill="#f2fbff" stroke="#9cc6dd"/><path d="M244 222 A10 10 0 0 1 264 222 Z" fill="#2a3a5a"/><text x="150" y="236" font-size="26">⛄</text>`;
    for(let i=0;i<28;i++){ const x=(i*53)%400, d=4+(i%5); s+=`<circle cx="${x}" cy="-5" r="${1.5+(i%3)}" fill="#fff"><animate attributeName="cy" values="-5;265" dur="${d}s" begin="${-(i*.37)%d}s" repeatCount="indefinite"/></circle>`; }
  } else {
    s+=`<circle cx="340" cy="40" r="20" fill="#FFE45C"/><circle cx="340" cy="40" r="29" fill="#FFE45C" opacity=".25"/>`+cloud(20,36,45)+cloud(160,56,60)+`<polygon points="0,160 60,96 110,130 170,74 230,130 290,100 350,140 400,112 400,160" fill="#9cc3e0"/><ellipse cx="90" cy="168" rx="120" ry="30" fill="#56b85f"/><ellipse cx="320" cy="168" rx="130" ry="26" fill="#4aa854"/><rect y="160" width="400" height="100" fill="url(#p${id})"/>`+treeS(40,190,1)+treeS(370,196,1.1,'#2d9a3e')+`<ellipse cx="280" cy="222" rx="50" ry="13" fill="#4fb3ea" stroke="#2f8fd8" stroke-width="2"/><text x="120" y="230" font-size="18">🌷</text><text x="200" y="246" font-size="18">🌼</text>`;
  }
  return `<svg class="scn" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}
