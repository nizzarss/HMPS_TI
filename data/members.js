const ORG = {
  nama: "HMPS Teknologi Informasi",
  prodi: "Teknologi Informasi",
  universitas: "UIN Salatiga",
  periode: "2026",
  kabinet: "Arunika",
  fakultas: null
};
const DIVISI = [
  { kode: "BPH", nama: "Badan Pengurus Harian" },
  { kode: "PID", nama: "PID" },
  { kode: "R&D", nama: "R&D" },
  { kode: "MED INFO", nama: "MED INFO" },
  { kode: "PSDM", nama: "PSDM" }
];
const slugifyAsset = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const _m = (divisi, jabatan, nama) => ({ nama, jabatan, divisi, foto: `assets/members/${slugifyAsset(nama)}.jpg`, periode: ORG.periode });
const _staff = (divisi, list) => list.map(n => _m(divisi, "Staff", n));
const MEMBERS = [
  _m("BPH", "Ketua/Kahim", "M Firda Aldi Wardhana"),
  _m("BPH", "Wakahim", "Muhtaji Ramadani"),
  _m("BPH", "Sekretaris 1", "Yoga Arizki Diananta"),
  _m("BPH", "Sekretaris", "Adila Putri Anjani"),
  _m("BPH", "Bendahara 1", "Mafi Datul Khoiriyah"),
  _m("BPH", "Bendahara 2", "Femi Aulia Andini"),
  _m("PID", "Koordinator", "Alvianita Nurahma"),
  ..._staff("PID", ["Azkal Azkiya Avisena", "Umi Afrida Lestari", "Barokatus Staniyah", "Alicia Zinta Maharani", "Yudithia Riezka Ramadhani"]),
  _m("R&D", "Koordinator", "Achmad Naufal Arifin"),
  ..._staff("R&D", ["Muhammad Fatkhurrohman", "Naim Maskur", "Muhammad Fathir Al Faruq", "Amelia Fatmawati Santoso"]),
  _m("MED INFO", "Koordinator", "Arfian Nurcharisi"),
  ..._staff("MED INFO", ["Ulfi Mafruchati", "Choirul Fattah Yasin", "Farrel Julian Firdhaus", "Muhammad Alfian Rifki F", "Faizza Audya Rahmadianty"]),
  _m("PSDM", "Koordinator", "Abu Syarif Abdillah Fikri"),
  ..._staff("PSDM", ["Iqlyma Auliya Nashifa", "Muftia Ayu Khoirunnisa", "Farhan Nursaid Yudhananta", "Muhammad Farich", "Devi Istvovia", "Tiara Laudya Nasyila", "Siti Widya Ainur Rocmah"])
].map((m, i) => ({ id: i + 1, ...m }));
