import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  PenLine,
  BookOpen,
  Calendar,
  Flame,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Plus,
} from 'lucide-react';

export const MainDashboardView: React.FC = () => {
  const {
    activeBook,
    books,
    setActiveBookId,
    setActiveView,
    stats,
    streak,
    dailyGoal,
    todayWordCount,
    setTodayWordCount,
    chapters,
    scenes,
    ideas,
    memories,
    setActiveChapterId,
    setActiveSceneId,
    setIsQuickCreateOpen,
    authorProfile,
    quotes,
  } = useStoryOS();

  const [scratchpad, setScratchpad] = useState(
    'Catatan kilat hari ini: Jangan lupa perdalam emosi di babak perpisahan stasiun...'
  );

  const randomQuote = quotes[0] || {
    quoteText: 'Menulislah seperti tidak ada yang akan membacanya, lalu revisilah seolah semua orang akan mengkritiknya.',
    speaker: 'Anonim',
  };

  const dailyProgressPercent = Math.min(100, Math.round((todayWordCount / dailyGoal) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ruang Kerja Penulis • {authorProfile.name || 'Penulis'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-book mb-2">
            Selamat Datang di Studio Menulismu
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-serif-reading">
            {randomQuote.quoteText}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('writing_studio')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium rounded-xl text-xs sm:text-sm shadow-md transition"
            >
              <PenLine className="w-4 h-4" />
              <span>Lanjut Menulis Naskah</span>
            </button>
            <button
              onClick={() => setIsQuickCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs sm:text-sm backdrop-blur transition border border-white/10"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Entitas Cepat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Word Target */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1">
            <span>Target Harian</span>
            <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {todayWordCount}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ {dailyGoal} kata</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${dailyProgressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[10px] text-stone-400">
            <span>{dailyProgressPercent}% tercapai</span>
            <button
              onClick={() => setTodayWordCount(todayWordCount + 100)}
              className="text-amber-600 dark:text-amber-400 hover:underline font-mono"
            >
              +100 kata
            </button>
          </div>
        </div>

        {/* Writing Streak */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1">
            <span>Ritme Menulis (Streak)</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {streak}
            </span>
            <span className="text-xs text-stone-500">Hari Berturut-turut</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Konsistensi terjaga! Pertahankan ritme harianmu.
          </p>
        </div>

        {/* Total Manuscript Words */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1">
            <span>Total Kata Naskah</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {stats.totalWords.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              / {activeBook ? activeBook.targetWords.toLocaleString() : '50,000'}
            </span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${activeBook ? activeBook.progress : 0}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-stone-400 flex justify-between">
            <span>{activeBook ? activeBook.progress : 0}% selesai</span>
            <span>~{stats.estimatedPages} halaman cetak</span>
          </div>
        </div>

        {/* Estimated Reading Time */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1">
            <span>Estimasi Waktu Baca</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
              {stats.estimatedReadingTimeMinutes}
            </span>
            <span className="text-xs text-stone-500">Menit Membaca</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Berdasarkan rata-rata 200 kata/menit pembaca umum.
          </p>
        </div>
      </div>

      {/* Main Grid: Active Book Focus & Fast Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Book Highlight & Recent Scenes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Book Showcase Card */}
          {activeBook && (
            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col sm:flex-row gap-5">
              {activeBook.coverUrl ? (
                <img
                  src={activeBook.coverUrl}
                  alt={activeBook.title}
                  className="w-28 sm:w-36 h-40 sm:h-52 object-cover rounded-xl shadow-md flex-shrink-0 self-center sm:self-start"
                />
              ) : (
                <div className="w-28 sm:w-36 h-40 sm:h-52 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex flex-col items-center justify-center text-amber-800 dark:text-amber-200 flex-shrink-0 self-center sm:self-start border border-amber-200 dark:border-amber-900">
                  <BookOpen className="w-8 h-8 mb-2" />
                  <span className="text-xs font-serif-book font-medium">Buku Aktif</span>
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-medium rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {activeBook.genre || 'Sastra / Memoar'}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Status: {activeBook.status === 'writing' ? 'Sedang Ditulis' : activeBook.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif-book mb-1">
                    {activeBook.title}
                  </h3>
                  {activeBook.subtitle && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-reading mb-2 italic">
                      "{activeBook.subtitle}"
                    </p>
                  )}
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed mb-4 font-serif-reading">
                    {activeBook.logline || activeBook.premise}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-stone-500 font-mono">
                    {chapters.length} Bab • {scenes.length} Adegan
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView('book_dashboard')}
                      className="px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition"
                    >
                      Buka Info Buku
                    </button>
                    <button
                      onClick={() => setActiveView('writing_studio')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition"
                    >
                      <span>Masuk Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Scenes to Continue */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  Lanjutkan Adegan Terakhir
                </h3>
              </div>
              <button
                onClick={() => setActiveView('structure')}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Lihat Struktur Naskah</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {scenes.slice(0, 4).map(s => {
                const parentChapter = chapters.find(c => c.id === s.chapterId);
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSceneId(s.id);
                      if (s.chapterId) setActiveChapterId(s.chapterId);
                      setActiveView('writing_studio');
                    }}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-stone-400">
                          {parentChapter ? parentChapter.title : 'Naskah Bebas'}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {s.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                        {s.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {s.summary || s.content?.slice(0, 80) || 'Belum ada draf tulisan'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 text-xs font-mono text-stone-400">
                      <span>{s.wordCount} kata</span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Scratchpad, Ideas, Memories */}
        <div className="space-y-6">
          {/* Quick Scratchpad */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  Scratchpad Kilat
                </h3>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">Tersimpan lokal</span>
            </div>
            <textarea
              value={scratchpad}
              onChange={e => setScratchpad(e.target.value)}
              rows={4}
              placeholder="Tulis ide atau pengingat secepat kilat saat menulis..."
              className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 rounded-xl focus:outline-hidden focus:border-amber-500 resize-none font-serif-reading"
            />
          </div>

          {/* Fresh Ideas Bank Preview */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-book">
                  Bank Ide Terbaru
                </h3>
              </div>
              <button
                onClick={() => setActiveView('ideas')}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
              >
                Buka Semua ({ideas.length})
              </button>
            </div>

            <div className="space-y-2">
              {ideas.slice(0, 3).map(i => (
                <div
                  key={i.id}
                  onClick={() => setActiveView('ideas')}
                  className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {i.title}
                    </span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {i.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                    {i.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Life Memories archive prompt */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/50">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 font-serif-book uppercase tracking-wider mb-1">
              Arsip Cerita Hidup
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3 font-serif-reading">
              Tersimpan {memories.length} pengalaman nyata yang dapat ditransformasikan ke adegan fiksi atau nonfiksi naratif.
            </p>
            <button
              onClick={() => setActiveView('memories')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-2xs transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buka Arsip & Ubah ke Fiksi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
