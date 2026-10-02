(function(){
  const featured=ACTIVITIES.find(a=>a.featured)||ACTIVITIES[0];
  const list=ACTIVITIES.filter(a=>a!==featured);
  const archivePanel=$("#activityArchivePanel"), toggle=$("#archiveToggle"), toggleText=$("#archiveToggleText");
  let period="Semua", query="";

  function detail(a){
    const w=el("div"),h=el("h3",null,a.namaKegiatan);h.id="dlg-title";w.append(h);
    [["Tanggal",a.tanggal],["Tempat",a.lokasi],["Penyelenggara",a.penyelenggara],["Periode",a.periode]].forEach(([l,v])=>w.appendChild(el("p","meta",l+": "+(v||NA))));
    w.appendChild(el("p",null,a.deskripsi||"Maaf, data kegiatan belum sempat diisi."));
    if(a.dokumentasi.length)a.dokumentasi.forEach(s=>{const i=el("img");i.src=s;i.alt="Dokumentasi "+a.namaKegiatan;i.loading="lazy";w.appendChild(i)});
    else w.appendChild(el("p","na","Dokumentasi belum tersedia."));
    return w;
  }
  function media(a){
    const box=el("div","archive-thumb");
    if(a.dokumentasi.length){const img=el("img");img.src=a.dokumentasi[0];img.alt="Dokumentasi "+a.namaKegiatan;img.loading="lazy";box.appendChild(img)}
    else box.appendChild(el("span","archive-thumb-mark","TI"));
    return box;
  }
  function renderFeatured(){
    const f=$("#featured"); if(!featured){f.remove();return;}
    const mediaBox=el("div","feature-media");
    if(featured.dokumentasi.length){const img=el("img");img.src=featured.dokumentasi[0];img.alt="Dokumentasi "+featured.namaKegiatan;img.loading="lazy";mediaBox.appendChild(img)}
    else {const holder=el("div","visual-placeholder");holder.appendChild(el("div","placeholder-mark","TI"));mediaBox.appendChild(holder)}
    const copy=el("div","feature-copy");
    copy.append(el("div","date",featured.tanggal||"KEGIATAN TERBARU"),el("h3",null,featured.namaKegiatan),el("p",null,featured.deskripsi||"Maaf, data kegiatan belum sempat diisi."),el("p","meta",featured.lokasi?"Lokasi: "+featured.lokasi:"Lokasi: "+NA));
    const b=el("button","btn outline","Lihat detail ↗");b.type="button";b.addEventListener("click",()=>openDialog(detail(featured)));copy.appendChild(b);
    f.replaceChildren(mediaBox,copy);
  }
  function renderTabs(){
    const years=["Semua",...new Set(list.map(a=>a.periode||"Tidak ada"))];
    const tabs=$("#archiveTabs");tabs.replaceChildren();
    years.forEach(y=>{const b=el("button",y===period?"active":"",y);b.type="button";b.setAttribute("role","tab");b.setAttribute("aria-selected",y===period);b.addEventListener("click",()=>{period=y;renderTabs();renderList()});tabs.appendChild(b)});
  }
  function renderList(){
    const box=$("#activities");box.replaceChildren();
    const q=query.trim().toLowerCase();
    const filtered=list.filter(a=>(period==="Semua"||(a.periode||"Tidak ada")===period)&&(!q||a.namaKegiatan.toLowerCase().includes(q)));
    if(!filtered.length){box.appendChild(el("div","archive-empty","Belum ada kegiatan yang cocok dengan filter ini."));return}
    filtered.forEach((a,i)=>{
      const row=el("article","activity-row");row.style.setProperty("--i",i);
      row.appendChild(media(a));
      const info=el("div","activity-row-info");
      const meta=el("div","activity-row-meta");meta.append(el("span",null,a.periode||"—"),el("i"),el("span",null,a.tanggal||"Tanggal belum tersedia"));
      info.append(meta,el("h3",null,a.namaKegiatan),el("p",null,a.deskripsi||"Maaf, data kegiatan belum sempat diisi."));
      const b=el("button","row-detail","Detail →");b.type="button";b.addEventListener("click",()=>openDialog(detail(a)));info.appendChild(b);row.appendChild(info);box.appendChild(row);
    });
  }
  renderFeatured();renderTabs();renderList();
  $("#activityCount").textContent=ACTIVITIES.length;
  $("#activitySearch").addEventListener("input",e=>{query=e.target.value;renderList()});
  toggle.addEventListener("click",()=>{
    const open=toggle.getAttribute("aria-expanded")==="true";
    toggle.setAttribute("aria-expanded",String(!open)); archivePanel.hidden=open;
    toggleText.textContent=open?"Buka arsip":"Tutup arsip";
    toggle.querySelector(".archive-icon").textContent=open?"+":"−";
    if(!open) setTimeout(()=>archivePanel.scrollIntoView({behavior:"smooth",block:"nearest"}),50);
  });
})();
