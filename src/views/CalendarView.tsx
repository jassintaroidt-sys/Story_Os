import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  Flame,
  Target,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { currentBook, updateBook, totalWords } = useStoryOS();

  const [dailyTarget, setDailyTarget] = useState(currentBook.dailyWordTarget || 500);
  const [deadline, setDeadline] = useState(currentBook.targetCompletionDate || '2025-12-31');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Milestones list
  const [milestones, setMilestones] = useState([
    { title: 'Outline & Plot Beat Sheet Tuntas', date: '15 Jan 2025', done: true },
    { title: 'Draf Pertama (First Draft) Selesai', date: '30 Mei 2025', done: false },
    { title: 'Revisi Babak Makro & Struktur', date: '30 Juli 2025', done: false },
    { title: 'Pemberian Naskah ke Beta Readers', date: '15 Sep 2025', done: false },
    { title: 'Proofreading & Pengiriman ke Penerbit', date: '15 Des 2025', done: false },
  ]);

  const toggleMilestone = (idx: number) => {
    setMilestones(prev =>
      prev.map((m, i) => (i === idx ? { ...m, done: !m.done } : m))
    );
  };

  const handleSaveSettings = () => {
    updateBook(currentBook.id, {
      dailyWordTarget: dailyTarget,
      targetCompletionDate: deadline,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Mock days of current month for visual calendar grid
  const daysInMonth = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    writtenWords: [1, 2, 4, 7, 8, 9, 14, 15, 18, 21, 22, 23, 24, 25].includes(i + 1)
      ? Math.floor(Math.random() * 400) + 400
      : 0,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-semibold uppercase mb-1">
          <CalendarDays className="w-4 h-4" />
          <span>Jadwal & Kedisiplinan Menulis</span>
        </div>
        <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Kalender Menulis & Target Tenggat Waktu (Milestones)
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          "Menulis adalah otot yang dilatih setiap hari." Pantau kebiasaan menulismu secara konsisten.
        </p>
      </div>

      {/* Target Settings Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs">
        <h3 className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100 mb-3">
          Konfigurasi Target Harian & Tenggat Waktu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Target Kata per Hari
            </label>
            <input
              type="number"
              value={dailyTarget}
              onChange={e => setDailyTarget(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Target Tanggal Naskah Siap
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-mono"
            />
          </div>

          <button
            onClick={handleSaveSettings}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition"
          >
            {savedSuccess ? 'Tersimpan!' : 'Perbarui Target'}
          </button>
        </div>
      </div>

      {/* Calendar Grid & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Aktivitas Menulis Bulan Ini
            </h3>
            <span className="text-xs font-mono text-stone-400">Streak: 5 Hari Aktif</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 text-center">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
              <span key={i} className="text-[10px] font-mono text-stone-400 uppercase">
                {d}
              </span>
            ))}

            {daysInMonth.map(item => {
              const achieved = item.writtenWords >= dailyTarget;
              const hasActivity = item.writtenWords > 0;
              return (
                <div
                  key={item.day}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center min-h-[50px] transition ${
                    achieved
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs font-bold'
                      : hasActivity
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300'
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-100 dark:border-stone-800 text-stone-400'
                  }`}
                  title={`${item.writtenWords} kata ditulis`}
                >
                  <span className="text-xs font-mono">{item.day}</span>
                  {hasActivity && (
                    <span className="text-[9px] font-mono opacity-80 mt-0.5">
                      {item.writtenWords}k
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-stone-400 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span>Target Tercapai (≥ {dailyTarget} kata)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300" />
              <span>Ada Menulis</span>
            </div>
          </div>
        </div>

        {/* Milestones Checklist */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Tonggak Capaian Naskah (Milestones)
          </h3>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                onClick={() => toggleMilestone(idx)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  m.done
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200/70 dark:border-stone-700/70 hover:border-amber-400'
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    m.done ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950' : 'text-stone-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-bold font-serif-book ${
                    m.done ? 'text-stone-400 line-through' : 'text-stone-900 dark:text-stone-100'
                  }`}>
                    {m.title}
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    Tenggat: {m.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
