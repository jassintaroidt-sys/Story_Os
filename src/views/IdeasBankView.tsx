import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Lightbulb,
  Plus,
  Search,
  Tag,
  ArrowRight,
  Trash2,
  Edit2,
  FileText,
  PenLine,
  Users,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { IdeaItem, IdeaStatus } from '../types';

export const IdeasBankView: React.FC = () => {
  const {
    ideas,
    addIdea,
    updateIdea,
    deleteIdea,
    convertIdeaToEntity,
  } = useStoryOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Partial<IdeaItem> | null>(null);

  const categories = ['Plot & Alur', 'Karakter & Tokoh', 'Adegan Kunci', 'Dialog & Kutipan', 'Dunia & Setting', 'Lainnya'];

  const filteredIdeas = ideas.filter(i => {
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q);
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingIdea({
      title: '',
      content: '',
      category: 'Plot & Alur',
      status: 'raw',
      tags: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (idea: IdeaItem) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea || !editingIdea.title?.trim()) return;

    if (editingIdea.id) {
      updateIdea(editingIdea.id, editingIdea);
    } else {
      addIdea(editingIdea);
    }
    setIsModalOpen(false);
    setEditingIdea(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Bank Ide & Penampung Ilham
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Tampung semua kilatan ide liar. Konversi ke Bab, Adegan, Tokoh, atau Catatan hanya dalam 1 klik.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tampung Ide Baru</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari ide..."
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

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="all">Semua Status</option>
            <option value="raw">Mentah</option>
            <option value="developing">Sedang Dikembangkan</option>
            <option value="used_in_book">Sudah Masuk Naskah</option>
            <option value="archived">Diarsipkan</option>
          </select>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full p-12 bg-white dark:bg-stone-900 rounded-2xl border text-center text-xs text-stone-400">
            Belum ada ide yang cocok dengan kriteria.
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <div
              key={idea.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 p-5 shadow-2xs flex flex-col justify-between transition space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(idea)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus ide "${idea.title}"?`)) deleteIdea(idea.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                  {idea.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed mt-2 line-clamp-4">
                  {idea.content}
                </p>

                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {idea.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 1-Click Conversions */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1.5">
                  Konversi Cepat ke:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium">
                  <button
                    onClick={() => convertIdeaToEntity(idea.id, 'chapter')}
                    className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300 transition"
                    title="Jadikan Bab Baru"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Bab</span>
                  </button>
                  <button
                    onClick={() => convertIdeaToEntity(idea.id, 'scene')}
                    className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300 transition"
                    title="Jadikan Adegan Baru"
                  >
                    <PenLine className="w-3 h-3" />
                    <span>Adegan</span>
                  </button>
                  <button
                    onClick={() => convertIdeaToEntity(idea.id, 'character')}
                    className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-300 transition"
                    title="Jadikan Profil Tokoh"
                  >
                    <Users className="w-3 h-3" />
                    <span>Tokoh</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Idea */}
      {isModalOpen && editingIdea && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingIdea.id ? 'Edit Ide' : 'Tampung Ide Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Judul / Inti Ide *</label>
                <input
                  type="text"
                  value={editingIdea.title || ''}
                  onChange={e => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  placeholder="Misal: Twist di mana mentor ternyata adalah penulis surat masa lalu"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Kategori</label>
                  <select
                    value={editingIdea.category || 'Plot & Alur'}
                    onChange={e => setEditingIdea({ ...editingIdea, category: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Status Ide</label>
                  <select
                    value={editingIdea.status || 'raw'}
                    onChange={e => setEditingIdea({ ...editingIdea, status: e.target.value as IdeaStatus })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  >
                    <option value="raw">Mentah</option>
                    <option value="developing">Sedang Dikembangkan</option>
                    <option value="used_in_book">Sudah Masuk Naskah</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Penjabaran Ide *</label>
                <textarea
                  value={editingIdea.content || ''}
                  onChange={e => setEditingIdea({ ...editingIdea, content: e.target.value })}
                  rows={4}
                  placeholder="Tuliskan gagasan lengkapmu tanpa sensor..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
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
                  Simpan Ide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
