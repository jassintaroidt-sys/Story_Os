import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Globe,
  Plus,
  Search,
  Shield,
  Scroll,
  Users,
  Compass,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { WorldElement } from '../types';

export const WorldbuildingView: React.FC = () => {
  const {
    worldElements,
    addWorldElement,
    updateWorldElement,
    deleteWorldElement,
  } = useStoryOS();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<WorldElement> | null>(null);

  const categories = [
    'Aturan & Hukum Sosial',
    'Faksi & Organisasi',
    'Budaya, Bahasa, & Adat',
    'Geografi & Iklim',
    'Sejarah & Legenda',
  ];

  const filteredItems = worldElements.filter(w => {
    if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q);
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingItem({
      title: '',
      category: 'Aturan & Hukum Sosial',
      description: '',
      rules: [''],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorldElement) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    if (editingItem.id) {
      updateWorldElement(editingItem.id, editingItem);
    } else {
      addWorldElement(editingItem);
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
            Worldbuilding & Sistem Dunia Cerita
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Bangun logika dunia naskah: dari norma sosial, konvensi budaya kota kecil, hingga aturan magis atau intrik organisasi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Elemen Dunia</span>
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
            placeholder="Cari aturan, budaya, faksi..."
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

      {/* World Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs hover:border-amber-400 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold uppercase">
                  {item.category}
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
                      if (window.confirm(`Hapus elemen "${item.title}"?`)) deleteWorldElement(item.id);
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed">
                {item.description}
              </p>

              {item.rules && item.rules.length > 0 && item.rules[0] && (
                <div className="space-y-1 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                    Aturan / Batasan Utama:
                  </span>
                  <ul className="space-y-1">
                    {item.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-1.5 font-serif-reading">
                        <span className="text-amber-600 font-bold">›</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingItem.id ? 'Edit Elemen Dunia' : 'Tambah Elemen Dunia Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Elemen / Konsep *</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Misal: Tradisi Mandi Kembang Malam Suro"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Kategori</label>
                <select
                  value={editingItem.category || 'Aturan & Hukum Sosial'}
                  onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deskripsi *</label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Hukum / Aturan Konkret (1 per baris)</label>
                <textarea
                  value={editingItem.rules?.join('\n') || ''}
                  onChange={e => setEditingItem({ ...editingItem, rules: e.target.value.split('\n') })}
                  rows={3}
                  placeholder="Aturan apa yang tidak boleh dilanggar dalam dunia ini?"
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
                  Simpan Elemen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
