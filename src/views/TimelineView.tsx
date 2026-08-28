import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  CalendarDays,
  Plus,
  ArrowUpDown,
  Filter,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Heart,
  Layers,
  Clock,
} from 'lucide-react';
import { TimelineEvent } from '../types';

export const TimelineView: React.FC = () => {
  const {
    timelineEvents,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    characters,
  } = useStoryOS();

  const [mode, setMode] = useState<'chronological' | 'narrative'>('chronological');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent> | null>(null);

  // Sorting
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    if (mode === 'chronological') {
      const yearA = parseInt(a.year || '0') || 0;
      const yearB = parseInt(b.year || '0') || 0;
      return yearA - yearB;
    } else {
      return a.orderIndex - b.orderIndex;
    }
  });

  const openCreateModal = () => {
    setEditingEvent({
      title: '',
      year: '2024',
      period: '',
      protagonistAge: 25,
      description: '',
      isTurningPoint: false,
      emotionalCharge: 'Positif',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev: TimelineEvent) => {
    setEditingEvent(ev);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title?.trim()) return;

    if (editingEvent.id) {
      updateTimelineEvent(editingEvent.id, editingEvent);
    } else {
      addTimelineEvent(editingEvent);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Timeline Perjalanan Hidup & Alur Narasi
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Bandingkan kronologis kejadian nyata dengan urutan babak yang dihadirkan kepada pembaca (flashback, linier, atau nonlinier).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setMode('chronological')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                mode === 'chronological'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              Kronologis Waktu
            </button>
            <button
              onClick={() => setMode('narrative')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                mode === 'narrative'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              Urutan Narasi Pembaca
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Peristiwa Baru</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 dark:border-amber-500/20 space-y-6 ml-4 sm:ml-6">
        {sortedEvents.map((ev, idx) => (
          <div key={ev.id} className="relative group">
            {/* Timeline node marker */}
            <div
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-4 flex items-center justify-center ${
                ev.isTurningPoint
                  ? 'border-amber-600 bg-amber-500 text-white shadow-md'
                  : 'border-white dark:border-stone-900 bg-stone-300 dark:bg-stone-700'
              }`}
            >
              {ev.isTurningPoint && <Sparkles className="w-3 h-3 text-white" />}
            </div>

            {/* Event Card */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs hover:border-amber-400 transition space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {ev.year || ev.period || 'Waktu'}
                  </span>
                  {ev.protagonistAge !== undefined && (
                    <span className="text-xs font-mono text-stone-400">
                      Usia: ~{ev.protagonistAge} tahun
                    </span>
                  )}
                  {ev.isTurningPoint && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 uppercase">
                      Titik Balik Utama (Turning Point)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(ev)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus peristiwa "${ev.title}"?`)) deleteTimelineEvent(ev.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
                  {ev.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 font-serif-reading leading-relaxed">
                  {ev.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-stone-400">
                <span>Dampak Emosi: <strong className="text-stone-700 dark:text-stone-300">{ev.emotionalCharge || 'Netral'}</strong></span>
                {ev.characterIds && ev.characterIds.length > 0 && (
                  <span>
                    • Tokoh Terlibat: {ev.characterIds.map(id => characters.find(c => c.id === id)?.name).filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Event */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingEvent.id ? 'Edit Peristiwa Timeline' : 'Tambah Peristiwa Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Judul Peristiwa *</label>
                <input
                  type="text"
                  value={editingEvent.title || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Misal: Pindah ke Rumah Baru di Tepi Danau"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tahun / Periode</label>
                  <input
                    type="text"
                    value={editingEvent.year || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, year: e.target.value })}
                    placeholder="Mis: 2018 atau Masa Kuliah"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Perkiraan Usia Tokoh</label>
                  <input
                    type="number"
                    value={editingEvent.protagonistAge ?? ''}
                    onChange={e => setEditingEvent({ ...editingEvent, protagonistAge: Number(e.target.value) })}
                    placeholder="25"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deskripsi Kejadian</label>
                <textarea
                  value={editingEvent.description || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Muatan Emosi</label>
                  <select
                    value={editingEvent.emotionalCharge || 'Netral'}
                    onChange={e => setEditingEvent({ ...editingEvent, emotionalCharge: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  >
                    <option value="Sangat Positif (Euforia)">Sangat Positif (Euforia)</option>
                    <option value="Positif (Hangat / Haru)">Positif (Hangat / Haru)</option>
                    <option value="Netral">Netral</option>
                    <option value="Tegang / Konflik">Tegang / Konflik</option>
                    <option value="Sangat Negatif (Luka / Duka)">Sangat Negatif (Luka / Duka)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isTurningPointCheck"
                    checked={editingEvent.isTurningPoint || false}
                    onChange={e => setEditingEvent({ ...editingEvent, isTurningPoint: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="isTurningPointCheck" className="text-xs font-medium cursor-pointer">
                    Titik Balik (Turning Point)?
                  </label>
                </div>
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
                  Simpan Peristiwa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
