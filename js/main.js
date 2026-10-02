const $=(s,r=document)=>r.querySelector(s);
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
const NA="Data belum tersedia";
const burger=$("#burger"),menu=$("#menu");
burger.addEventListener("click",()=>{const open=menu.classList.toggle("open");burger.setAttribute("aria-expanded",open)});
menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");burger.setAttribute("aria-expanded","false")}});
const nav=$("#nav");
addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>20),{passive:true});

[["Organisasi",ORG.nama],["Program Studi",ORG.prodi],["Universitas",ORG.universitas],["Fakultas",ORG.fakultas||"[Data perlu dikonfirmasi]"],["Periode",ORG.periode],["Kabinet",ORG.kabinet]].forEach(([k,v])=>{
  const d=el("div","fact");d.append(el("small",null,k),el("strong",null,v));$("#facts").appendChild(d)
});

const contactBox=$("#contacts");
Object.values(CONTACTS).forEach(c=>{
  const a=el("a","contact-card");a.href=c.url;
  if(c.url.startsWith("http")){a.target="_blank";a.rel="noopener"}
  const icon=el("span","contact-icon",c.icon||"↗");
  const text=el("span");text.append(el("small",null,c.label),el("strong",null,c.handle));
  a.append(icon,text,el("span","contact-arrow","↗"));contactBox.appendChild(a);
});

const dlg=$("#dlg");
function openDialog(node){$("#dlg-body").replaceChildren(node);dlg.showModal()}
$("#dlg-x").addEventListener("click",()=>dlg.close());
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(x=>observer.observe(x));

const sections=[...document.querySelectorAll("main section[id]")], links=[...document.querySelectorAll(".menu a")], mobileLinks=[...document.querySelectorAll(".mobile-nav a")];
const secObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){
  links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
  mobileLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
}}),{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>secObserver.observe(s));
mobileLinks.forEach(a=>a.addEventListener("click",()=>mobileLinks.forEach(x=>x.classList.toggle("active",x===a))));


const quickLinks=[...document.querySelectorAll('.quick-link')];
const quickSections=[...document.querySelectorAll('main section[id]')];
const quickObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){
    quickLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
  }
}),{rootMargin:'-28% 0px -62% 0px',threshold:0});
quickSections.forEach(s=>quickObserver.observe(s));
quickLinks.forEach(a=>a.addEventListener('click',()=>quickLinks.forEach(x=>x.classList.remove('active'))));

const orgPanel=document.querySelector('#panel');
if(orgPanel && matchMedia('(pointer:fine)').matches){
  orgPanel.addEventListener('pointermove',e=>{
    const card=e.target.closest('.member'); if(!card) return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*3}deg) rotateX(${y*-3}deg)`;
  });
  orgPanel.addEventListener('pointerleave',e=>{const card=e.target.closest?.('.member'); if(card) card.style.transform='';},true);
}

const particleField = document.querySelector('#particleField');
if (particleField) {
  const colors = ['', '', '', '', 'gold', 'red'];
  const points = [
    [6,18,8,-1],[12,42,10,1],[19,76,12,0],[27,28,9,2],[34,62,13,-2],
    [42,16,11,1],[49,82,9,0],[57,31,14,-1],[64,68,10,2],[72,14,12,0],
    [78,48,9,-2],[86,24,13,1],[92,72,11,0],[15,90,14,-1],[38,92,10,1],
    [55,52,12,0],[69,89,9,-1],[95,39,14,2],[4,60,12,1],[88,10,10,0],
    [24,12,15,0],[61,92,13,1],[82,62,10,-1],[46,44,9,0]
  ];
  points.forEach(([x,y,d,delay],i)=>{
    const p=document.createElement('i'); p.className='particle '+(colors[i%colors.length]);
    p.style.left=x+'%'; p.style.top=y+'%'; p.style.setProperty('--dur',d+'s'); p.style.setProperty('--delay',(-delay-d/2)+'s');
    particleField.appendChild(p);
  });
}


const spaceCanvas = document.querySelector('#spaceCanvas');
if (spaceCanvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = spaceCanvas.getContext('2d');
  let dpr = Math.min(devicePixelRatio || 1, 2), w = 0, h = 0;
  let particles = [], lastMove = 0, raf = 0;
  const palette = [
    [78, 151, 255],   // electric blue
    [245, 197, 66],   // gold
    [151, 62, 72]     // dark red
  ];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    spaceCanvas.width = Math.max(1, Math.round(w*dpr));
    spaceCanvas.height = Math.max(1, Math.round(h*dpr));
    spaceCanvas.style.width = w+'px';
    spaceCanvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize(); addEventListener('resize', resize, {passive:true});

  function add(x,y,vx,vy,life,size,colorIndex) {
    particles.push({x,y,vx,vy,life,max:life,size,colorIndex,drag:.965,gravity:.012});
  }
  function emit(x,y,amount=3,dirX=0,dirY=0) {
    for(let i=0;i<amount;i++) {
      const a=Math.random()*Math.PI*2;
      const speed=0.35+Math.random()*1.25;
      add(x,y,
        Math.cos(a)*speed + dirX*.22,
        Math.sin(a)*speed + dirY*.22,
        380+Math.random()*360,
        .9+Math.random()*1.5,
        Math.random()<.72?0:Math.random()<.65?1:2
      );
    }
  }
  function burst(x,y) {
    for(let i=0;i<18;i++) {
      const a=(Math.PI*2*i/18)+(Math.random()-.5)*.18;
      const speed=1.1+Math.random()*2.2;
      add(x,y,Math.cos(a)*speed,Math.sin(a)*speed,520+Math.random()*360,1+Math.random()*1.8,i%7===0?1:0);
    }
  }
  function frame() {
    ctx.clearRect(0,0,w,h);
    particles = particles.filter(p=>p.life>0);
    for(const p of particles) {
      p.life-=16;
      p.x+=p.vx; p.y+=p.vy;
      p.vx*=p.drag; p.vy=p.vy*p.drag+p.gravity;
      const life=Math.max(0,p.life/p.max), c=palette[p.colorIndex];
      ctx.beginPath();
      ctx.arc(p.x,p.y,Math.max(.35,p.size*(.3+.7*life)),0,Math.PI*2);
      ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${Math.min(.78,life*.72)})`;
      ctx.shadowBlur=8;
      ctx.shadowColor=`rgba(${c[0]},${c[1]},${c[2]},.55)`;
      ctx.fill();
    }
    ctx.shadowBlur=0;
    if(particles.length) raf=requestAnimationFrame(frame); else raf=0;
  }
  function wake(){ if(!raf) raf=requestAnimationFrame(frame); }

  addEventListener('pointermove', e=>{
    const now=performance.now();
    if(now-lastMove<28) return;
    lastMove=now;
    emit(e.clientX,e.clientY,2,e.movementX||0,e.movementY||0);
    wake();
  }, {passive:true});

  addEventListener('pointerdown', e=>{
    if(e.pointerType==='mouse' || e.pointerType==='pen' || e.pointerType==='touch') {
      burst(e.clientX,e.clientY); wake();
    }
  }, {passive:true});
}

(() => {
  const welcome = document.querySelector('#welcomeScreen');
  const skip = document.querySelector('#welcomeSkip');
  const prompt = document.querySelector('#welcomePrompt');
  if (!welcome) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audio = document.querySelector('#welcomeAudio');
  let started = false;
  let audioStarted = false;
  let closed = false;
  let finishTimer = null;

  const removeBeginListeners = () => {
    window.removeEventListener('pointerup', begin, true);
    window.removeEventListener('click', begin, true);
    window.removeEventListener('touchend', begin, true);
    window.removeEventListener('wheel', begin, true);
    window.removeEventListener('keydown', begin, true);
    skip?.removeEventListener('click', begin, true);
  };

  const removeRetryListeners = () => {
    window.removeEventListener('pointerup', retryAudio, true);
    window.removeEventListener('click', retryAudio, true);
    window.removeEventListener('touchend', retryAudio, true);
    window.removeEventListener('wheel', retryAudio, true);
    window.removeEventListener('keydown', retryAudio, true);
  };

  const finish = () => {
    if (closed) return;
    closed = true;
    removeBeginListeners();
    removeRetryListeners();
    if (finishTimer) clearTimeout(finishTimer);
    welcome.classList.add('is-exiting');
    document.body.classList.remove('preloading');
    setTimeout(() => welcome.remove(), reduce ? 0 : 900);
  };

  const playWelcomeAudio = () => {
    if (!audio || reduce || audioStarted) return false;
    audio.volume = 0.62;
    audio.muted = false;
    try {
      const result = audio.play();
      if (result && typeof result.then === 'function') {
        result.then(() => {
          audioStarted = true;
          removeRetryListeners();
        }).catch(() => {
        });
      } else {
        audioStarted = true;
        removeRetryListeners();
      }
      return true;
    } catch (_) {
      return false;
    }
  };

  function retryAudio(event) {
    if (event && event.isTrusted === false) return;
    playWelcomeAudio();
  }

  function begin(event) {
    if (started || closed) return;
    if (event && event.isTrusted === false) return;

    started = true;
    welcome.classList.remove('waiting');
    welcome.classList.add('started');
    prompt?.classList.add('is-hidden');

    const played = playWelcomeAudio();

    removeBeginListeners();
    if (!audioStarted || !played) {
      window.addEventListener('pointerup', retryAudio, {capture:true, passive:true});
      window.addEventListener('click', retryAudio, {capture:true, passive:true});
      window.addEventListener('touchend', retryAudio, {capture:true, passive:true});
      window.addEventListener('wheel', retryAudio, {capture:true, passive:true});
      window.addEventListener('keydown', retryAudio, {capture:true, passive:true});
    }

    finishTimer = setTimeout(finish, reduce ? 500 : 3600);
  }

  if (audio) {
    audio.preload = 'auto';
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');
  }

  if (!reduce) {
    window.addEventListener('pointerup', begin, {capture:true, passive:true});
    window.addEventListener('click', begin, {capture:true, passive:true});
    window.addEventListener('touchend', begin, {capture:true, passive:true});
    window.addEventListener('wheel', begin, {capture:true, passive:true});
    window.addEventListener('keydown', begin, {capture:true, passive:true});
  } else {
    begin();
  }
})();
