import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Flame,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  HeartCrack,
  Swords,
} from 'lucide-react';
import { PlotPoint } from '../types';

export const PlotConflictsView: React.FC = () => {
  const {
    plotPoints,
    addPlotPoint,
    updatePlotPoint,
    deletePlotPoint,
    scenes,
    setActiveSceneId,
    setActiveView,
  } = useStoryOS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBeat, setEditingBeat] = useState<Partial<PlotPoint> | null>(null);

  const defaultBeats = [
    'Pembukaan (Ordinary World)',
    'Pemicu Aksi (Inciting Incident)',
    'Melangkah Masuk (Plot Point 1)',
    'Rintangan Meningkat (Rising Action)',
    'Titik Tengah (Midpoint / Titik Balik)',
    'Krisis & Titik Terendah (Dark Night of the Soul)',
    'Puncak Klimaks (Climax)',
    'Resolusi & Dunia Baru (Resolution)',
  ];

  const openCreateModal = () => {
    setEditingBeat({
      beatName: 'Pemicu Aksi (Inciting Incident)',
      description: '',
      internalConflict: '',
      externalConflict: '',
      stakes: '',
      isCompleted: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (beat: PlotPoint) => {
    setEditingBeat(beat);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBeat || !editingBeat.beatName?.trim()) return;

    if (editingBeat.id) {
      updatePlotPoint(editingBeat.id, editingBeat);
    } else {
      addPlotPoint(editingBeat);
    }
    setIsModalOpen(false);
    setEditingBeat(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Alur Cerita, Beat Sheet, & Dinamika Konflik
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Petakan beat dramatik babak demi babak. Seimbangkan konflik eksternal (taruhan dunia luar) dan konflik internal (pergulatan batin).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Titik Alur (Beat)</span>
        </button>
      </div>

      {/* Beats Stream */}
      <div className="space-y-4">
        {plotPoints.map((beat, idx) => (
          <div
            key={beat.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs hover:border-amber-400/80 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold font-mono text-sm flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                    {beat.beatName}
                  </h3>
                  <span className="text-[11px] font-mono text-stone-400">
                    Status: {beat.isCompleted ? '✓ Selesai Ditulis' : 'Sedang Dirancang'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updatePlotPoint(beat.id, { isCompleted: !beat.isCompleted })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    beat.isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{beat.isCompleted ? 'Tercapai' : 'Tandai Selesai'}</span>
                </button>
                <button
                  onClick={() => openEditModal(beat)}
                  className="p-1.5 text-stone-400 hover:text-stone-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {plotPoints.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus titik alur "${beat.beatName}"?`)) deletePlotPoint(beat.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-serif-reading text-stone-700 dark:text-stone-300 leading-relaxed">
              {beat.description}
            </p>

            {/* Dual Conflict Matrix (Internal vs External) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/50 dark:border-stone-700/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <HeartCrack className="w-3.5 h-3.5" />
                  <span>Konflik Batin / Internal (Tokoh Utama)</span>
                </div>
                <p className="text-xs font-serif-reading text-stone-600 dark:text-stone-300">
                  {beat.internalConflict || 'Belum dirumuskan.'}
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/50 dark:border-stone-700/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <Swords className="w-3.5 h-3.5" />
                  <span>Konflik Luar / Eksternal & Taruhan (Stakes)</span>
                </div>
                <p className="text-xs font-serif-reading text-stone-600 dark:text-stone-300">
                  {beat.externalConflict || 'Belum dirumuskan.'}
                  {beat.stakes && (
                    <span className="block mt-1 text-[11px] font-mono text-rose-700 dark:text-rose-300">
                      Taruhan: {beat.stakes}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Beat */}
      {isModalOpen && editingBeat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingBeat.id ? 'Edit Titik Alur (Beat)' : 'Tambah Titik Alur'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Beat / Babak Dramatik *</label>
                <input
                  type="text"
                  value={editingBeat.beatName || ''}
                  onChange={e => setEditingBeat({ ...editingBeat, beatName: e.target.value })}
                  placeholder="Pilih atau tulis nama beat..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {defaultBeats.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditingBeat({ ...editingBeat, beatName: b })}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-amber-100"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deskripsi Peristiwa *</label>
                <textarea
                  value={editingBeat.description || ''}
                  onChange={e => setEditingBeat({ ...editingBeat, description: e.target.value })}
                  rows={3}
                  placeholder="Apa yang terjadi di babak ini?"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Konflik Batin (Internal)</label>
                  <textarea
                    value={editingBeat.internalConflict || ''}
                    onChange={e => setEditingBeat({ ...editingBeat, internalConflict: e.target.value })}
                    rows={2}
                    placeholder="Dilema moral, ketakutan..."
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Konflik Luar (Eksternal)</label>
                  <textarea
                    value={editingBeat.externalConflict || ''}
                    onChange={e => setEditingBeat({ ...editingBeat, externalConflict: e.target.value })}
                    rows={2}
                    placeholder="Musuh, bencana, tenggat waktu..."
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Taruhan / Konsekuensi Kegagalan (Stakes)</label>
                <input
                  type="text"
                  value={editingBeat.stakes || ''}
                  onChange={e => setEditingBeat({ ...editingBeat, stakes: e.target.value })}
                  placeholder="Apa yang hilang jika protagonis gagal di titik ini?"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs"
                >
                  Simpan Titik Alur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
