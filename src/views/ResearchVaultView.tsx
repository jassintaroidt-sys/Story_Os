import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  FlaskConical,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  X,
  BookOpen,
  FileText,
} from 'lucide-react';
import { ResearchItem } from '../types';

export const ResearchVaultView: React.FC = () => {
  const {
    researchItems,
    addResearchItem,
    updateResearchItem,
    deleteResearchItem,
    chapters,
  } = useStoryOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ResearchItem> | null>(null);

  const categories = ['Historis & Sejarah', 'Sains & Psikologi', 'Hasil Wawancara', 'Kultur & Budaya', 'Geografi & Tempat', 'Lainnya'];

  const filteredItems = researchItems.filter(r => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.keyFacts?.some(f => f.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingItem({
      title: '',
      category: 'Sains & Psikologi',
      source: '',
      url: '',
      summary: '',
      keyFacts: [''],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ResearchItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    if (editingItem.id) {
      updateResearchItem(editingItem.id, editingItem);
    } else {
      addResearchItem(editingItem);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Gudang Riset & Referensi Naskah
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dokumentasikan fakta sejarah, hasil wawancara narasumber, jurnal ilmiah, dan rujukan kredibel untuk menopang cerita.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Riset Baru</span>
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
            placeholder="Cari riset, sumber, atau fakta..."
            className="w-full bg-transparent border-none focus:outline-hidden text-stone-900 dark:text-stone-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-stone-400 bg-white dark:bg-stone-900 rounded-2xl border">
            Belum ada data riset yang tersimpan.
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs hover:border-amber-400 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold uppercase">
                    {item.category || 'Riset'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus riset "${item.title}"?`)) deleteResearchItem(item.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mt-0.5">
                    <span>Sumber: {item.source}</span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 hover:underline"
                      >
                        <span>Tautan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed">
                  {item.summary}
                </p>

                {item.keyFacts && item.keyFacts.length > 0 && item.keyFacts[0] && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                      Poin Kunci yang Dikutip:
                    </span>
                    <ul className="space-y-1">
                      {item.keyFacts.map((fact, fIdx) => (
                        <li key={fIdx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2 font-serif-reading">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Research */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingItem.id ? 'Edit Item Riset' : 'Tambah Riset Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Topik / Judul Riset *</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Misal: Dampak Psikologis Ambivalensi Perantau"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Kategori Riset</label>
                  <select
                    value={editingItem.category || 'Sains & Psikologi'}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Sumber / Narasumber *</label>
                  <input
                    type="text"
                    value={editingItem.source || ''}
                    onChange={e => setEditingItem({ ...editingItem, source: e.target.value })}
                    placeholder="Buku, Jurnal, atau Nama Narasumber"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tautan / URL Rujukan (Opsional)</label>
                <input
                  type="url"
                  value={editingItem.url || ''}
                  onChange={e => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Ringkasan Temuan Riset *</label>
                <textarea
                  value={editingItem.summary || ''}
                  onChange={e => setEditingItem({ ...editingItem, summary: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Poin-Poin Fakta Penting (1 baris 1 poin)</label>
                <textarea
                  value={editingItem.keyFacts?.join('\n') || ''}
                  onChange={e => setEditingItem({ ...editingItem, keyFacts: e.target.value.split('\n') })}
                  rows={3}
                  placeholder="Pisahkan per baris untuk setiap fakta..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
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
                  Simpan Riset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
