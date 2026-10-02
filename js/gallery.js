(function(){
  const g=$("#gallery"),photos=[];
  ACTIVITIES.forEach(a=>a.dokumentasi.forEach(src=>photos.push({src,alt:"Dokumentasi "+a.namaKegiatan})));
  if(!photos.length){g.appendChild(el("div","gallery-empty","Dokumentasi foto akan ditampilkan di sini setelah aset kegiatan ditambahkan."));return}
  photos.forEach(p=>{const b=el("button"),i=el("img");b.type="button";b.setAttribute("aria-label","Perbesar: "+p.alt);i.src=p.src;i.alt=p.alt;i.loading="lazy";b.appendChild(i);b.addEventListener("click",()=>{const f=el("img");f.src=p.src;f.alt=p.alt;openDialog(f)});g.appendChild(b)})
})();
