import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  History,
  CheckCircle2,
  Circle,
  Camera,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
} from 'lucide-react';
import { RevisionStage } from '../types';

export const RevisionsCenterView: React.FC = () => {
  const {
    revisionStages,
    toggleRevisionStage,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    currentBook,
    totalWords,
  } = useStoryOS();

  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [showSnapshotSuccess, setShowSnapshotSuccess] = useState(false);

  const completedStagesCount = revisionStages.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedStagesCount / revisionStages.length) * 100);

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotLabel.trim()) return;
    createSnapshot(snapshotLabel);
    setSnapshotLabel('');
    setShowSnapshotSuccess(true);
    setTimeout(() => setShowSnapshotSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Pusat Revisi Bertahap & Riwayat Snapshot
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Metode revisi berlapis dari makro (struktur & alur) hingga mikro (diksi & tanda baca), dilengkapi snapshot aman tanpa takut kehilangan naskah lama.
          </p>
        </div>

        {/* Overall Progress Badge */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-xl border border-amber-200/60 dark:border-amber-900/60">
          <div>
            <div className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold">
              Kemajuan Revisi Naskah
            </div>
            <div className="text-sm font-bold text-amber-900 dark:text-amber-200 font-mono">
              {completedStagesCount} / {revisionStages.length} Tahap ({progressPercent}%)
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center text-xs font-bold font-mono text-amber-800 dark:text-amber-300">
            {progressPercent}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 10-Stage Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>10 Tahapan Revisi Menyeluruh (Makro ke Mikro)</span>
            </h3>

            <div className="space-y-3">
              {revisionStages.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleRevisionStage(st.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    st.isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900'
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200/70 dark:border-stone-700/70 hover:border-amber-400'
                  }`}
                >
                  <div className="mt-0.5 text-emerald-600 flex-shrink-0">
                    {st.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
                        Tahap {st.stageNumber}
                      </span>
                      <h4 className={`text-xs sm:text-sm font-bold font-serif-book ${
                        st.isCompleted ? 'text-stone-500 line-through' : 'text-stone-900 dark:text-stone-100'
                      }`}>
                        {st.title}
                      </h4>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 font-serif-reading leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Snapshots & Backup Versioning */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Create Snapshot Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
                Ambil Snapshot Naskah
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-serif-reading">
              Simpan titik beku (checkpoint) naskah lengkap saat ini. Kamu bisa bereksperimen memotong atau menulis ulang tanpa takut kehilangan draf asli.
            </p>

            <form onSubmit={handleCreateSnapshot} className="space-y-3">
              <input
                type="text"
                value={snapshotLabel}
                onChange={e => setSnapshotLabel(e.target.value)}
                placeholder="Label snapshot (mis: Draf Pertama Selesai)..."
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Simpan Snapshot Sekarang</span>
              </button>
              {showSnapshotSuccess && (
                <div className="p-2 text-center text-xs text-emerald-600 font-medium">
                  ✓ Snapshot berhasil disimpan!
                </div>
              )}
            </form>
          </div>

          {/* Snapshots History List */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span>Riwayat Snapshot ({snapshots.length})</span>
              <Clock className="w-4 h-4 text-stone-400" />
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {snapshots.length === 0 ? (
                <div className="text-xs text-stone-400 text-center py-6">
                  Belum ada snapshot yang tersimpan.
                </div>
              ) : (
                snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
                        {snap.label}
                      </h4>
                      <span className="text-[10px] font-mono text-stone-400">
                        {new Date(snap.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                      <span>{snap.wordCount.toLocaleString('id-ID')} kata</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Yakin ingin memulihkan naskah ke snapshot "${snap.label}"?`)) {
                            restoreSnapshot(snap.id);
                          }
                        }}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Pulihkan Draf</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
