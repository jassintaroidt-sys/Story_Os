import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import { ViewMode } from '../types';
import {
  Compass,
  Layers,
  BookOpen,
  Feather,
  Archive,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  Database,
  Eye,
  GitBranch,
  Repeat,
  Heart,
  Sliders,
  Users,
  MapPin,
  Clock,
  Lock,
  FileText,
  Calendar,
  Share2,
  Award,
} from 'lucide-react';

export const SystemBlueprintView: React.FC = () => {
  const { setActiveView, currentBook } = useStoryOS();
  const [activeTab, setActiveTab] = useState<'compass' | 'layers' | 'flow' | 'principles'>('compass');

  // Quick jump helper
  const navigateTo = (view: ViewMode) => {
    setActiveView(view);
  };

  const startingPaths = [
    {
      id: 'idea',
      title: 'Hanya punya ide acak atau kilasan kalimat?',
      desc: 'Simpan ke Bank Ide agar tidak hilang. Kapan pun siap, konversi menjadi bab, tokoh, tema, atau riset.',
      view: 'ideas' as ViewMode,
      viewLabel: 'Buka Bank Ide',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20',
      badge: 'Langkah Awal',
    },
    {
      id: 'memory',
      title: 'Punya pengalaman hidup atau memori nyata?',
      desc: 'Catat di Arsip Cerita Hidup, lalu gunakan modul Reality → Fiction untuk mengaburkan nama dan mengubahnya jadi novel.',
      view: 'memories' as ViewMode,
      viewLabel: 'Buka Arsip Memori',
      icon: <Archive className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-200 bg-blue-50/40 dark:border-blue-900/50 dark:bg-blue-950/20',
      badge: 'Bahan Baku Mentah',
    },
    {
      id: 'structure',
      title: 'Sudah tahu jalan cerita kasar & babak?',
      desc: 'Susun di Kerangka Struktur (Part → Chapter → Scene). Beri nomor bab dan tentukan sinopsis tiap bagian.',
      view: 'structure' as ViewMode,
      viewLabel: 'Buka Struktur Buku',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20',
      badge: 'Arsitektur Cerita',
    },
    {
      id: 'write',
      title: 'Ingin langsung menulis tanpa banyak rencana?',
      desc: 'Masuk langsung ke Studio Menulis. Nikmati kanvas bebas distraksi, mode fokus Zen, dan autosave instan.',
      view: 'writing_studio' as ViewMode,
      viewLabel: 'Buka Studio Menulis',
      icon: <Feather className="w-5 h-5 text-rose-500" />,
      color: 'border-rose-200 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20',
      badge: 'Inti Eksekusi',
    },
    {
      id: 'character',
      title: 'Sedang mematangkan karakter tokoh?',
      desc: 'Buat profil psikologis di Modul Tokoh: luka masa lalu, motivasi, konflik batin, dan peta relasi sosiogram.',
      view: 'characters' as ViewMode,
      viewLabel: 'Buka Modul Tokoh',
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-200 bg-indigo-50/40 dark:border-indigo-900/50 dark:bg-indigo-950/20',
      badge: 'Jiwa Cerita',
    },
    {
      id: 'timeline',
      title: 'Bingung urutan waktu peristiwa & kilas balik?',
      desc: 'Gunakan Timeline Ganda: bedakan waktu nyata kronologis peristiwa dengan urutan adegan yang dialami pembaca.',
      view: 'timeline' as ViewMode,
      viewLabel: 'Buka Timeline Ganda',
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-200 bg-purple-900/50 dark:border-purple-900/50 dark:bg-purple-950/20',
      badge: 'Logika Waktu',
    },
    {
      id: 'research',
      title: 'Perlu mengumpulkan fakta & data autentik?',
      desc: 'Simpan wawancara, kliping koran, dan temuan medis di Riset Vault & Library File tanpa takut tercecer.',
      view: 'research' as ViewMode,
      viewLabel: 'Buka Riset Vault',
      icon: <Search className="w-5 h-5 text-teal-500" />,
      color: 'border-teal-200 bg-teal-50/40 dark:border-teal-900/50 dark:bg-teal-950/20',
      badge: 'Kredibilitas',
    },
    {
      id: 'revision',
      title: 'Draf pertama sudah selesai & mau diperbaiki?',
      desc: 'Gunakan Pusat Revisi bertahap: self-editing struktur, dialog, ritme adegan, dan cek konsistensi Style Guide.',
      view: 'revision' as ViewMode,
      viewLabel: 'Buka Pusat Revisi',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-100/30 dark:border-amber-800 dark:bg-amber-950/30',
      badge: 'Penyempurnaan',
    },
    {
      id: 'publishing',
      title: 'Naskah sudah matang dan siap diterbitkan?',
      desc: 'Siapkan sinopsis penerbit, elevator pitch, blurb sampul belakang, dan ekspor manuskrip utuh siap kirim.',
      view: 'publishing' as ViewMode,
      viewLabel: 'Buka Publishing Center',
      icon: <Award className="w-5 h-5 text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50/40 dark:border-yellow-900/50 dark:bg-yellow-950/20',
      badge: 'Lahirnya Buku',
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
          <Compass className="w-4 h-4" />
          <span>Arsitektur & Peta Sistem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Cetak Biru MY STORY OS
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-3xl leading-relaxed">
          MY STORY OS adalah sistem operasi kreatif yang menghubungkan seluruh elemen penulisan buku—dari serpihan memori nyata, struktur babak, adegan studio, hingga manuskrip siap terbit. Satu data tersambung ke mana pun tanpa perlu mengetik ulang.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={() => setActiveTab('compass')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'compass'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dari Mana Aku Mulai? (Kompas Penulis)</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'layers'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4 Lapisan Utama Sistem</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Alur Produksi Cerita</span>
          </button>

          <button
            onClick={() => setActiveTab('principles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'principles'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4 Prinsip Desain Kunci</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Kompas Penulis */}
      {activeTab === 'compass' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                Kompas Penulis: "Dari Mana Aku Mulai?"
              </h2>
              <p className="text-xs text-stone-500">
                Pilih kondisi Anda saat ini untuk langsung menuju modul yang paling tepat:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startingPaths.map(path => (
              <div
                key={path.id}
                className={`p-5 rounded-2xl border ${path.color} transition hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 bg-white dark:bg-stone-800 rounded-xl shadow-2xs">
                      {path.icon}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {path.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {path.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    {path.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
                  <button
                    onClick={() => navigateTo(path.view)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-stone-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs transition"
                  >
                    <span>{path.viewLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: 4 Layers */}
      {activeTab === 'layers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Layer 1 */}
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold rounded-lg">
                  LAPISAN 1
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  BUKU (Book Project)
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tempat pengguna mengelola proyek buku secara utuh dari tingkat tertinggi.
              </p>
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Metadata Buku, Genre, Jenis & Target Kata</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Struktur Hirarki (Part → Chapter → Scene)</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Manuskrip Lengkap (Kompilasi Pembaca & Cetak)</span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => navigateTo('manuskrip')}
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Buka Manuskrip Lengkap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-mono text-xs font-bold rounded-lg">
                  LAPISAN 2
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  CERITA (Story Universe)
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tempat pengguna membangun isi, semesta, karakter, dan menulis teks adegan secara mendalam.
              </p>
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Feather className="w-3.5 h-3.5 text-rose-600" />
                  <span>Studio Menulis (Kanvas Scene, Blok Tulisan, Versi)</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Users className="w-3.5 h-3.5 text-rose-600" />
                  <span>Tokoh, Luka Batin, Arc Perubahan & Relasi</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Timeline Ganda, Lokasi, Tema, Plot & Konflik</span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => navigateTo('writing_studio')}
                  className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>Masuk ke Studio Menulis</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-mono text-xs font-bold rounded-lg">
                  LAPISAN 3
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  SUMBER & CATATAN (Raw Material Vault)
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tempat menyimpan bahan mentah, memori hidup otentik, ide kilat, dan file riset.
              </p>
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Archive className="w-3.5 h-3.5 text-blue-600" />
                  <span>Arsip Memori Hidup & Transformasi Reality → Fiction</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bank Ide Terkonversi & Catatan / Kutipan</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>Vault Riset & Library File Aset</span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => navigateTo('file_library')}
                  className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Buka Library File & Aset</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Layer 4 */}
            <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold rounded-lg">
                  LAPISAN 4
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  PENYELESAIAN (Completion & Publishing)
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tempat mematangkan draf menjadi buku siap edar dan siap dibaca dunia.
              </p>
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pusat Revisi (Tahap 1 s.d. 5 Checklist)</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statistik Produktivitas & Kalender Target</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Publishing Center (Sinopsis, Blurb & Ekspor File)</span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => navigateTo('publishing')}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Buka Publishing Center</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Flow */}
      {activeTab === 'flow' && (
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-book">
              Alur Utama Produksi Buku (Master Pipeline)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Setiap tahapan saling meneruskan data secara organik tanpa hambatan:
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-amber-500/40 space-y-8 my-6 text-xs">
            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">1. IDE (Bank Ide)</h4>
              <p className="text-stone-500 mt-0.5">Penulis menangkap kilasan premis, kalimat puitis, atau konflik menarik ke Bank Ide.</p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">2. ARSIP & REALITY → FICTION</h4>
              <p className="text-stone-500 mt-0.5">Memori nyata dicatat di Arsip Hidup, lalu disaring dengan pelindung privasi menjadi fiksi.</p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">3. PENGEMBANGAN CERITA</h4>
              <p className="text-stone-500 mt-0.5">Karakter diperdalam (luka batin, relasi), lokasi dipetakan, dan timeline disusun.</p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">4. STRUKTUR KERANGKA</h4>
              <p className="text-stone-500 mt-0.5">Buku dibagi menjadi Bagian (Part), Bab (Chapter), dan Adegan (Scene).</p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">5. STUDIO MENULIS & DRAF BLOK</h4>
              <p className="text-stone-500 mt-0.5">Penulis mengetik teks naskah adegan per adegan dalam antarmuka terfokus dengan referensi samping.</p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-600 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">6. REVISI & PENYUNTINGAN</h4>
              <p className="text-stone-500 mt-0.5">Penyuntingan draf dengan panduan Style Guide dan perbandingan versi snapshot terdahulu.</p>
            </div>

            <div className="relative group">
              <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-yellow-600 border-2 border-white dark:border-stone-900" />
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">7. MANUSKRIP & PENERBITAN</h4>
              <p className="text-stone-500 mt-0.5">Kompilasi manuskrip lengkap, pembuatan sinopsis penerbit, dan ekspor berkas siap cetak.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: 4 Core Principles */}
      {activeTab === 'principles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Repeat className="w-4 h-4" />
              <span>1. Write once, connect everywhere</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Pengguna tidak perlu mengetik nama tokoh, catatan, atau riset berulang kali. Satu entitas yang dibuat dapat langsung disematkan pada adegan, bab, timeline, atau file library.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Original data is sacred</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Data asli tidak boleh hilang atau ditimpa tanpa jejak. Memori nyata, draf awal, catatan mentah, dan riwayat snapshot versi teks selalu dapat dipulihkan kapan saja.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Eye className="w-4 h-4" />
              <span>3. User decides</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Sistem membantu mengorganisasi pikiran, tetapi keputusan kreatif sepenuhnya ada di tangan penulis. Sistem tidak memaksa struktur plot kaku atau alur tertentu.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>4. No creative interference</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              MY STORY OS adalah alat organisasi kreatif (creative organization tool), bukan co-writer yang mendikte gaya atau memaksakan teks otomatis. Kata-kata adalah milik penulis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
