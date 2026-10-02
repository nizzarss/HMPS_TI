(function(){
  const tabs=$("#tabs"),panel=$("#panel"),q=$("#q"),prev=$("#prevMember"),next=$("#nextMember"),counter=$("#memberCounter"),dots=$("#memberDots");
  const stage=document.querySelector('.org-stage'), canvas=document.querySelector('#orgFxCanvas');
  let active=DIVISI[0].kode,index=0,items=[],touchX=null,touchY=null,lastTrail=0,busy=false;
  const initials=n=>n.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

  const fx=(()=>{
    if(!canvas||!stage) return {burst(){},trail(){},resize(){}};
    const ctx=canvas.getContext('2d'); let dpr=1,w=0,h=0,raf=0,particles=[];
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const palette=[[99,169,255],[245,197,66],[185,54,69]];
    function resize(){
      dpr=Math.min(devicePixelRatio||1,2); const r=stage.getBoundingClientRect(); w=r.width; h=r.height;
      canvas.width=Math.max(1,w*dpr); canvas.height=Math.max(1,h*dpr); canvas.style.width=w+'px'; canvas.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function add(x,y,vx,vy,life,size,colorIndex){particles.push({x,y,vx,vy,life,max:life,size,colorIndex:colorIndex??(Math.random()<.14?2:Math.random()<.32?1:0),drag:.978,gravity:.004});}
    function burst(x,y,power=.8){
      if(reduce.matches)return;
      const count=14;
      for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=(1.0+Math.random()*2.5)*power;add(x,y,Math.cos(a)*s,Math.sin(a)*s,320+Math.random()*180,1.4+Math.random()*2);}
      const ring=document.createElement('span'); ring.className='fx-pulse'; ring.style.left=x+'px'; ring.style.top=y+'px'; stage.appendChild(ring);
      requestAnimationFrame(()=>ring.classList.add('show')); setTimeout(()=>ring.remove(),480);
    }
    function trail(x,y,dir){
      if(reduce.matches)return;
      for(let i=0;i<4;i++){const spread=(Math.random()-.5)*16; add(x+spread,y+(Math.random()-.5)*16,-dir*(.45+Math.random()*1.15)+(Math.random()-.5)*.3,(Math.random()-.5)*.55,220+Math.random()*170,1.2+Math.random()*1.5);}
    }
    function draw(){
      ctx.clearRect(0,0,w,h); particles=particles.filter(p=>p.life>0);
      for(const p of particles){p.life-=16;p.x+=p.vx;p.y+=p.vy;p.vx*=p.drag;p.vy=p.vy*p.drag+p.gravity;const life=p.life/p.max,c=palette[p.colorIndex];ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.45,p.size*(.35+.65*life)),0,Math.PI*2);ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${Math.max(0,life*.9)})`;ctx.shadowBlur=9;ctx.shadowColor=`rgba(${c[0]},${c[1]},${c[2]},.75)`;ctx.fill();ctx.shadowBlur=0;}
      raf=requestAnimationFrame(draw);
    }
    resize(); addEventListener('resize',resize,{passive:true}); raf=requestAnimationFrame(draw);
    return {resize,burst,trail};
  })();

  function tabBurst(tab){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    tab.classList.remove('tab-burst'); void tab.offsetWidth; tab.classList.add('tab-burst');
    setTimeout(()=>tab.classList.remove('tab-burst'),420);
  }

  DIVISI.forEach(d=>{
    const t=el('button','tab',d.kode); t.type='button'; t.dataset.k=d.kode; t.setAttribute('role','tab'); t.setAttribute('aria-selected',d.kode===active); t.title=d.nama;
    t.addEventListener('click',()=>{tabBurst(t);setDivision(d.kode);}); tabs.appendChild(t);
  });

  function currentItems(){
    const term=q.value.trim().toLowerCase();
    return MEMBERS.filter(m=>(term?(m.nama+' '+m.jabatan+' '+m.divisi).toLowerCase().includes(term):m.divisi===active));
  }
  function renderDots(){dots.replaceChildren();items.forEach((_,i)=>dots.appendChild(el('span','dot'+(i===index?' active':''))));}
  function card(m,direction){
    const c=el('article','member member-enter '+(direction==='left'?'from-left':'from-right')),photo=el('div','member-photo');
    if(m.foto){const img=el('img');img.src=m.foto;img.alt='Foto '+m.nama;img.loading='lazy';photo.appendChild(img)} else photo.appendChild(el('div','initials',initials(m.nama)));
    const info=el('div','member-info'); [['mc1','mc2'],['mc3','mc4']].flat().forEach(cl=>info.appendChild(el('span','member-corner '+cl)));
    info.append(el('span','index','HMPS TI // '+String(m.id).padStart(2,'0')),el('h3',null,m.nama),el('span','member-role',m.jabatan));
    const meta=el('div','member-meta');meta.append(el('span',m.divisi),el('span','Kabinet '+ORG.kabinet+' '+m.periode));info.append(meta);c.append(photo,info);return c;
  }
  function updateMeta(){counter.textContent=String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');renderDots();}
  function initialDraw(){items=currentItems();index=Math.min(index,Math.max(0,items.length-1));panel.replaceChildren();if(!items.length){panel.appendChild(el('p','empty','Tidak ada anggota yang cocok.'));counter.textContent='00 / 00';dots.replaceChildren();return;}panel.appendChild(card(items[index],'right'));updateMeta();}
  function setDivision(k){active=k;index=0;q.value='';tabs.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.k===k));initialDraw();const r=stage.getBoundingClientRect();fx.burst(r.width/2,r.height*.5,.65);}

  function move(dir,originX=null,originY=null){
    items=currentItems(); if(!items.length||busy)return;
    const nextIndex=(index+dir+items.length)%items.length;
    const old=panel.querySelector('.member'); if(!old)return;
    busy=true;
    const sr=stage.getBoundingClientRect(); const x=originX!=null?originX-sr.left:sr.width/2; const y=originY!=null?originY-sr.top:sr.height/2;
    fx.burst(x,y,.95);
    const fresh=card(items[nextIndex],dir>0?'right':'left');
    fresh.classList.add('member-enter-active');
    old.classList.add(dir>0?'member-exit-left':'member-exit-right');
    panel.appendChild(fresh);
    index=nextIndex;updateMeta();
    setTimeout(()=>{old.remove();busy=false;},390);
  }
  prev.addEventListener('click',e=>move(-1,e.clientX,e.clientY));
  next.addEventListener('click',e=>move(1,e.clientX,e.clientY));
  q.addEventListener('input',()=>{index=0;initialDraw();});

  panel.addEventListener('touchstart',e=>{const t=e.touches[0];touchX=t.clientX;touchY=t.clientY;lastTrail=0;},{passive:true});
  panel.addEventListener('touchmove',e=>{if(touchX==null)return;const t=e.touches[0],dx=t.clientX-touchX,now=performance.now();if(Math.abs(dx)>18&&now-lastTrail>38){const r=stage.getBoundingClientRect();fx.trail(t.clientX-r.left,t.clientY-r.top,dx>0?1:-1);lastTrail=now;}},{passive:true});
  panel.addEventListener('touchend',e=>{if(touchX==null)return;const t=e.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY,sx=t.clientX,sy=t.clientY;touchX=touchY=null;if(Math.abs(dx)>52&&Math.abs(dx)>Math.abs(dy)*1.25)move(dx<0?1:-1,sx,sy);},{passive:true});

  let px=null,py=null;
  panel.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){px=e.clientX;py=e.clientY;}});
  panel.addEventListener('pointermove',e=>{if(px==null||e.pointerType!=='mouse')return;const dx=e.clientX-px;if(Math.abs(dx)>24){const r=stage.getBoundingClientRect();fx.trail(e.clientX-r.left,e.clientY-r.top,dx>0?1:-1);px=e.clientX;py=e.clientY;}});
  panel.addEventListener('pointerup',e=>{if(px==null)return;const dx=e.clientX-px,sx=e.clientX,sy=e.clientY;px=py=null;if(Math.abs(dx)>55)move(dx<0?1:-1,sx,sy);});
  panel.addEventListener('pointercancel',()=>px=py=null);

  stage.addEventListener('click',e=>{if(e.target.closest('.slide-arrow,.tab,input'))return;const r=stage.getBoundingClientRect();fx.burst(e.clientX-r.left,e.clientY-r.top,.5);});
  setDivision(active);
})();
