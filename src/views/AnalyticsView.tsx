import React from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BarChart3,
  TrendingUp,
  Target,
  Flame,
  Clock,
  BookOpen,
  FileCheck,
  Award,
  Layers,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    currentBook,
    totalWords,
    chapters,
    parts,
    activeScene,
    scenes,
  } = useStoryOS();

  const targetWords = currentBook.targetWordCount || 50000;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));
  const estimatedPages = Math.ceil(totalWords / 250);
  const readingTimeMin = Math.ceil(totalWords / 200);

  // Distribution by Chapter
  const chapterStats = chapters.map(ch => {
    const chScenes = scenes.filter(s => s.chapterId === ch.id);
    const words = chScenes.reduce((acc, s) => acc + s.wordCount, 0);
    return {
      title: ch.title,
      words,
      sceneCount: chScenes.length,
      status: ch.status,
    };
  });

  const maxWordsInChapter = Math.max(...chapterStats.map(c => c.words), 1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-semibold uppercase mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Statistik & Metrik Naskah</span>
        </div>
        <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Analitik Produktivitas, Kecepatan, & Estimasi Buku
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Pantau volume kata, laju kemajuan menuju target, serta estimasi tebal halaman cetak buku fisikmu.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Kata</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
            {totalWords.toLocaleString('id-ID')}
          </p>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-amber-600 h-full rounded-full"
            />
          </div>
          <span className="text-[10px] font-mono text-stone-400 block pt-1">
            {progressPercent}% dari target {targetWords.toLocaleString('id-ID')} kata
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Estimasi Halaman Cetak</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
            ~{estimatedPages}
          </p>
          <span className="text-[10px] font-mono text-stone-400 block pt-3">
            Format novel standar (250 kata / hal)
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Waktu Baca Pembaca</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
            ~{readingTimeMin} mnt
          </p>
          <span className="text-[10px] font-mono text-stone-400 block pt-3">
            {(readingTimeMin / 60).toFixed(1)} jam membaca santai
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Streak Menulis</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 dark:text-stone-100">
            5 Hari
          </p>
          <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 block pt-3">
            Hebat! Terus pertahankan ritme
          </span>
        </div>
      </div>

      {/* Word Count Distribution per Chapter */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Distribusi Volume Kata per Bab
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            {chapterStats.length} Bab
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {chapterStats.map((ch, idx) => {
            const barWidth = Math.round((ch.words / maxWordsInChapter) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold font-serif-book text-stone-800 dark:text-stone-200 truncate max-w-[280px]">
                    {ch.title}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-stone-500">
                    <span>{ch.sceneCount} adegan</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      {ch.words.toLocaleString('id-ID')} kata
                    </span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className="bg-amber-600 h-full rounded-full transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target pacing advice */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 flex items-start gap-3">
        <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold font-serif-book text-amber-950 dark:text-amber-200">
            Target Penyelesaian Naskah
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed">
            Dengan sisa target {(targetWords - totalWords).toLocaleString('id-ID')} kata, jika kamu menulis konsisten <strong>500 kata per hari</strong>, naskah ini akan tuntas dalam <strong>{Math.ceil(Math.max(0, targetWords - totalWords) / 500)} hari</strong> lagi!
          </p>
        </div>
      </div>
    </div>
  );
};
