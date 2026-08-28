import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BookOpen,
  PenLine,
  Layers,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  BookMarked,
  Edit3,
  Save,
} from 'lucide-react';

export const BookDashboardView: React.FC = () => {
  const {
    activeBook,
    updateBook,
    parts,
    chapters,
    scenes,
    characters,
    locations,
    timelineEvents,
    researchItems,
    setActiveView,
    stats,
  } = useStoryOS();

  const [isEditingPremise, setIsEditingPremise] = useState(false);
  const [editedPremise, setEditedPremise] = useState(activeBook?.premise || '');
  const [editedLogline, setEditedLogline] = useState(activeBook?.logline || '');

  if (!activeBook) {
    return (
      <div className="p-12 text-center text-stone-500">
        Pilih atau buat buku terlebih dahulu di menu "Buku Saya".
      </div>
    );
  }

  const handleSavePremise = () => {
    updateBook(activeBook.id, {
      premise: editedPremise,
      logline: editedLogline,
    });
    setIsEditingPremise(false);
  };

  // Checklist items
  const readinessChecklist = [
    { label: 'Premis & Logline Terdefinisi', done: Boolean(activeBook.logline && activeBook.premise) },
    { label: 'Struktur Bagian / Bab Tersusun', done: parts.length > 0 && chapters.length > 0 },
    { label: 'Tokoh Utama Terpetakan', done: characters.filter(c => c.role === 'protagonist').length > 0 },
    { label: 'Timeline Peristiwa Terstruktur', done: timelineEvents.length > 0 },
    { label: 'Gudang Riset / Catatan Tersedia', done: researchItems.length > 0 },
    { label: 'Draf Pertama Dimulai', done: stats.totalWords > 0 },
    { label: 'Target Kata Tercapai (100%)', done: activeBook.progress >= 100 },
  ];

  const completedCount = readinessChecklist.filter(c => c.done).length;
  const readinessPercent = Math.round((completedCount / readinessChecklist.length) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Book Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {activeBook.coverUrl ? (
            <img
              src={activeBook.coverUrl}
              alt={activeBook.title}
              className="w-32 sm:w-40 h-48 sm:h-60 object-cover rounded-xl shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-32 sm:w-40 h-48 sm:h-60 bg-amber-100 dark:bg-amber-950/50 rounded-xl flex flex-col items-center justify-center text-amber-800 dark:text-amber-200 flex-shrink-0 border border-amber-200 dark:border-amber-900/60">
              <BookOpen className="w-10 h-10 mb-2" />
              <span className="text-xs font-serif-book font-medium">Cover Buku</span>
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {activeBook.genre}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Status: <strong className="text-stone-700 dark:text-stone-300 uppercase">{activeBook.status}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
                {activeBook.title}
              </h1>
              {activeBook.subtitle && (
                <p className="text-sm font-serif-reading italic text-stone-500 dark:text-stone-400 mt-1">
                  "{activeBook.subtitle}"
                </p>
              )}
            </div>

            {/* Premise & Logline view / edit */}
            {!isEditingPremise ? (
              <div className="space-y-2 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200/70 dark:border-stone-800">
                <div>
                  <span className="text-[11px] uppercase font-mono font-semibold text-stone-400">Logline:</span>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed mt-0.5 font-serif-reading">
                    {activeBook.logline || 'Belum ada logline. Klik edit untuk merumuskan 1 kalimat inti cerita.'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-mono font-semibold text-stone-400">Premis:</span>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mt-0.5 font-serif-reading">
                    {activeBook.premise || 'Belum ada premis mendalam.'}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setEditedPremise(activeBook.premise);
                      setEditedLogline(activeBook.logline || '');
                      setIsEditingPremise(true);
                    }}
                    className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Premis & Logline</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Logline (1-Kalimat Inti Cerita)
                  </label>
                  <input
                    type="text"
                    value={editedLogline}
                    onChange={e => setEditedLogline(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Premis & Eksplorasi Pokok
                  </label>
                  <textarea
                    value={editedPremise}
                    onChange={e => setEditedPremise(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingPremise(false)}
                    className="px-3 py-1 text-xs text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSavePremise}
                    className="px-3 py-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setActiveView('writing_studio')}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Masuk Studio Menulis</span>
              </button>
              <button
                onClick={() => setActiveView('structure')}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kelola Struktur ({parts.length} Bagian, {chapters.length} Bab)</span>
              </button>
              <button
                onClick={() => setActiveView('characters')}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Database Tokoh ({characters.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Words and target */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book">
              Progres Naskah
            </h3>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {activeBook.progress}%
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-stone-400 mb-1.5">
              <span>{stats.totalWords.toLocaleString()} kata ditulis</span>
              <span>Target: {activeBook.targetWords.toLocaleString()} kata</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${activeBook.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs font-mono">
            <div className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl">
              <span className="text-stone-400 block text-[10px]">Halaman Cetak</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100">~{stats.estimatedPages}</span> hlm
            </div>
            <div className="bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl">
              <span className="text-stone-400 block text-[10px]">Waktu Membaca</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100">~{stats.estimatedReadingTimeMinutes}</span> mnt
            </div>
          </div>
        </div>

        {/* Readiness Checklist */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book">
              Kesiapan Manuskrip
            </h3>
            <span className="text-xs font-mono text-stone-400">
              {completedCount} / {readinessChecklist.length} Langkah
            </span>
          </div>

          <div className="space-y-1.5">
            {readinessChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`w-4 h-4 flex-shrink-0 ${
                    item.done ? 'text-emerald-500' : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
                <span
                  className={
                    item.done
                      ? 'text-stone-800 dark:text-stone-200'
                      : 'text-stone-400 dark:text-stone-500'
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hierarchical Stats */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book">
            Komposisi Struktur
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <span className="text-stone-600 dark:text-stone-400">Bagian (Parts)</span>
              <span className="font-bold font-mono text-stone-900 dark:text-stone-100">{parts.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <span className="text-stone-600 dark:text-stone-400">Bab (Chapters)</span>
              <span className="font-bold font-mono text-stone-900 dark:text-stone-100">{chapters.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <span className="text-stone-600 dark:text-stone-400">Adegan (Scenes)</span>
              <span className="font-bold font-mono text-stone-900 dark:text-stone-100">{scenes.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <span className="text-stone-600 dark:text-stone-400">Rata-rata Kata per Bab</span>
              <span className="font-bold font-mono text-stone-900 dark:text-stone-100">
                {chapters.length > 0 ? Math.round(stats.totalWords / chapters.length).toLocaleString() : 0} kata
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown per Part & Chapters */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Distribusi Kata Berdasarkan Bagian & Bab
          </h3>
          <button
            onClick={() => setActiveView('structure')}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Buka Pengelola Struktur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {parts.map(p => {
            const partChapters = chapters.filter(c => c.partId === p.id);
            const partWords = partChapters.reduce((sum, chap) => sum + chap.totalWords, 0);

            return (
              <div key={p.id} className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book">
                      {p.title}
                    </h4>
                    {p.description && (
                      <p className="text-xs text-stone-500 font-serif-reading mt-0.5">{p.description}</p>
                    )}
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {partWords.toLocaleString()} kata
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                  {partChapters.map(ch => (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setActiveView('writing_studio');
                      }}
                      className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer border border-stone-100 dark:border-stone-800 transition"
                    >
                      <div className="flex justify-between items-center text-xs font-medium text-stone-800 dark:text-stone-200 mb-1">
                        <span className="truncate">{ch.title}</span>
                        <span className="text-[10px] font-mono text-stone-400 flex-shrink-0 ml-1">
                          {ch.totalWords} k
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {ch.summary || 'Belum ada ringkasan'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
