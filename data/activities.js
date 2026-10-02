const activityAsset=(name)=>`assets/activities/${name}.jpg`;
const ACTIVITY_NOTE="Maaf, data kegiatan belum sempat diisi.";
const _a=(namaKegiatan,extra={})=>({namaKegiatan,tanggal:null,lokasi:null,deskripsi:ACTIVITY_NOTE,dokumentasi:[],penyelenggara:null,periode:"2026",...extra});
const ACTIVITIES=[
  _a("INTECHNITE 2026",{tanggal:"3–4 Oktober 2026",lokasi:"Secret Location",featured:true,dokumentasi:[activityAsset("intechnite_2026")]}),
  _a("Techop Academik Batch 1",{dokumentasi:[activityAsset("techop_academik_batch_1")]}),
  _a("Kunjungan HMPS TI ke HMPS TI UKSW",{dokumentasi:[activityAsset("kunjungan_hmps_ti_ke_hmps_ti_uksw")]}),
  _a("KKL",{dokumentasi:[activityAsset("kkl")]}),
  _a("Pembekalan Kerja Lapangan",{dokumentasi:[activityAsset("pembekalan_kerja_lapangan")]}),
  _a("Bakti Sosial",{dokumentasi:[activityAsset("bakti_sosial")]}),
  _a("Bedah Web3 & Blockchain",{dokumentasi:[activityAsset("bedah_web3_blockchain")]}),
  _a("IN-TECH 2025",{periode:"2025",dokumentasi:[activityAsset("in_tech_2025")]}),
  _a("Sosialisasi Prodi",{periode:"2025",dokumentasi:[activityAsset("sosialisasi_prodi")]}),
  _a("Makrab",{periode:"2024",dokumentasi:[activityAsset("makrab")]})
].map((a,i)=>({id:i+1,...a}));
const CONTACTS={
  instagram:{label:"Instagram",handle:"@hmpsti.uinsalatiga",url:"https://instagram.com/hmpsti.uinsalatiga",icon:"IG"},
  tiktok:{label:"TikTok",handle:"@hmpsti.uinsalatiga",url:"https://tiktok.com/@hmpsti.uinsalatiga",icon:"TK"},
  email:{label:"Email",handle:"hmpstiunsaga@gmail.com",url:"mailto:hmpstiunsaga@gmail.com",icon:"@"}
};
