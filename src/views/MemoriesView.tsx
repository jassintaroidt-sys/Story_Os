import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BrainCircuit,
  Plus,
  Search,
  Lock,
  Eye,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit2,
  X,
  FileCheck,
} from 'lucide-react';
import { MemoryArchive } from '../types';

export const MemoriesView: React.FC = () => {
  const {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    addScene,
    setActiveSceneId,
    setActiveView,
  } = useStoryOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryArchive | null>(memories[0] || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Partial<MemoryArchive> | null>(null);

  const filteredMemories = memories.filter(m => {
    if (privacyFilter !== 'all' && m.privacyLevel !== privacyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.whatHappened.toLowerCase().includes(q) ||
        m.lessonsLearned?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingMemory({
      title: '',
      year: '2023',
      whatHappened: '',
      emotionalCharge: 'Hangat',
      privacyLevel: 'public',
      status: 'raw',
      lessonsLearned: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mem: MemoryArchive) => {
    setEditingMemory(mem);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory || !editingMemory.title?.trim()) return;

    if (editingMemory.id) {
      updateMemory(editingMemory.id, editingMemory);
    } else {
      const created = addMemory(editingMemory);
      setSelectedMemory(created);
    }
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  // Convert memory to Scene directly
  const handleConvertToScene = (mem: MemoryArchive) => {
    const newScene = addScene({
      title: `Adegan: ${mem.title}`,
      summary: mem.whatHappened.slice(0, 150),
      content: `# ${mem.title}\n\n${mem.whatHappened}\n\n*Catatan emosi: ${mem.feelings || ''}*\n`,
      status: 'first_draft',
    });

    updateMemory(mem.id, {
      status: 'used_in_book',
      linkedSceneId: newScene.id,
    });

    setActiveSceneId(newScene.id);
    setActiveView('writing_studio');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Arsip Cerita Hidup & Memori Nyata
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Gudang pengalaman pribadi yang aman. Dapat langsung ditransformasikan menjadi adegan novel atau memoar dengan 1 klik.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Memori Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari memori, peristiwa, kata kunci..."
            className="w-full bg-transparent border-none focus:outline-hidden text-stone-900 dark:text-stone-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={privacyFilter}
            onChange={e => setPrivacyFilter(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="all">Semua Privasi</option>
            <option value="public">Terbuka / Aman Dibagikan</option>
            <option value="sensitive">Sensitif (Disamarkan)</option>
            <option value="private">Sangat Rahasia</option>
          </select>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left list */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMemories.length === 0 ? (
            <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border text-center text-xs text-stone-400">
              Belum ada memori yang dicatat.
            </div>
          ) : (
            filteredMemories.map(mem => {
              const isSelected = mem.id === selectedMemory?.id;
              return (
                <div
                  key={mem.id}
                  onClick={() => setSelectedMemory(mem)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs space-y-2 ${
                    isSelected
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {mem.year || mem.period || 'Waktu'}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                        mem.privacyLevel === 'private'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : mem.privacyLevel === 'sensitive'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {mem.privacyLevel === 'private' ? 'Rahasia' : mem.privacyLevel === 'sensitive' ? 'Sensitif' : 'Terbuka'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book line-clamp-1">
                    {mem.title}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 font-serif-reading">
                    {mem.whatHappened}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail & Transformation Actions */}
        <div className="lg:col-span-7">
          {selectedMemory ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-6 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {selectedMemory.year || selectedMemory.period || 'Waktu Peristiwa'}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Status: {selectedMemory.status === 'used_in_book' ? '✓ Sudah Masuk Naskah' : 'Draf Arsip'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
                    {selectedMemory.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedMemory)}
                    className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus memori "${selectedMemory.title}"?`)) deleteMemory(selectedMemory.id);
                    }}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* What happened */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">
                  Peristiwa Sebenarnya yang Terjadi
                </h4>
                <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif-reading whitespace-pre-line bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                  {selectedMemory.whatHappened}
                </p>
              </div>

              {/* Emotional Charge & Lessons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-600 block mb-1">
                    Muatan Emosional
                  </span>
                  <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                    {selectedMemory.emotionalCharge || 'Netral'}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 block mb-1">
                    Pelajaran Hidup / Makna Filosofis
                  </span>
                  <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                    {selectedMemory.lessonsLearned || 'Belum dirumuskan.'}
                  </p>
                </div>
              </div>

              {/* 1-Click Transformation Bar */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 font-serif-book">
                    Transformasi ke Naskah
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading">
                  Jadikan peristiwa nyata ini sebagai adegan babak baru di naskah buku aktifmu, atau bandingkan 4 versi transformasi sastra di studio.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => handleConvertToScene(selectedMemory)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium shadow-2xs transition"
                  >
                    <span>Ubah Jadi Adegan di Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveView('reality_to_fiction')}
                    className="px-3 py-2 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 rounded-lg text-xs font-medium transition border border-stone-200 dark:border-stone-700"
                  >
                    Buka di Studio Realita → Fiksi
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal Add / Edit Memory */}
      {isModalOpen && editingMemory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingMemory.id ? 'Edit Arsip Memori' : 'Tambah Arsip Memori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Judul / Peristiwa *</label>
                <input
                  type="text"
                  value={editingMemory.title || ''}
                  onChange={e => setEditingMemory({ ...editingMemory, title: e.target.value })}
                  placeholder="Misal: Malam Terakhir Sebelum Berangkat Merantau"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tahun / Periode</label>
                  <input
                    type="text"
                    value={editingMemory.year || ''}
                    onChange={e => setEditingMemory({ ...editingMemory, year: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tingkat Privasi</label>
                  <select
                    value={editingMemory.privacyLevel || 'public'}
                    onChange={e => setEditingMemory({ ...editingMemory, privacyLevel: e.target.value as any })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  >
                    <option value="public">Terbuka / Aman untuk Publik</option>
                    <option value="sensitive">Sensitif (Harus Disamarkan)</option>
                    <option value="private">Sangat Rahasia / Pribadi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Apa yang Sebenarnya Terjadi? *</label>
                <textarea
                  value={editingMemory.whatHappened || ''}
                  onChange={e => setEditingMemory({ ...editingMemory, whatHappened: e.target.value })}
                  rows={4}
                  placeholder="Tuliskan secara jujur dan detail apa yang kamu lihat, dengar, dan rasakan..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Muatan Emosional</label>
                  <input
                    type="text"
                    value={editingMemory.emotionalCharge || ''}
                    onChange={e => setEditingMemory({ ...editingMemory, emotionalCharge: e.target.value })}
                    placeholder="Mis: Nostalgia, Patah Hati, Penyesalan"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Pelajaran / Makna</label>
                  <input
                    type="text"
                    value={editingMemory.lessonsLearned || ''}
                    onChange={e => setEditingMemory({ ...editingMemory, lessonsLearned: e.target.value })}
                    placeholder="Apa arti peristiwa ini bagi hidupmu?"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
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
                  Simpan Memori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
