import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Compass,
  Plus,
  Sparkles,
  Trash2,
  Edit2,
  X,
  Target,
  Layers,
} from 'lucide-react';
import { ThemeItem } from '../types';

export const ThemesView: React.FC = () => {
  const {
    themes,
    addTheme,
    updateTheme,
    deleteTheme,
  } = useStoryOS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Partial<ThemeItem> | null>(null);

  const openCreateModal = () => {
    setEditingTheme({
      name: '',
      statement: '',
      isCentralTheme: false,
      motifs: [''],
      evolution: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: ThemeItem) => {
    setEditingTheme(t);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme || !editingTheme.name?.trim()) return;

    if (editingTheme.id) {
      updateTheme(editingTheme.id, editingTheme);
    } else {
      addTheme(editingTheme);
    }
    setIsModalOpen(false);
    setEditingTheme(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Pemetaan Tema, Filosofi, & Motif Simbolis
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pernyataan tematis (thematic statement) dan motif visual berulang yang memberi kedalaman makna bagi pembaca.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Tema / Motif</span>
        </button>
      </div>

      {/* Themes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {themes.map(t => (
          <div
            key={t.id}
            className={`rounded-2xl border p-6 shadow-2xs space-y-4 ${
              t.isCentralTheme
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {t.isCentralTheme ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white uppercase">
                      ★ Tema Utama (Pernyataan Sentral)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase">
                      Sub-Tema Pendukung
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
                  {t.name}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {themes.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus tema "${t.name}"?`)) deleteTheme(t.id);
                    }}
                    className="p-1 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700 dark:text-amber-400">
                Pernyataan Tematis (Thematic Statement):
              </span>
              <p className="text-sm font-serif-reading italic text-stone-800 dark:text-stone-200 leading-relaxed bg-white/70 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
                "{t.statement}"
              </p>
            </div>

            {t.motifs && t.motifs.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                  Motif & Simbol Berulang:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.motifs.map((motif, mIdx) => (
                    <span
                      key={mIdx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-serif-reading"
                    >
                      ✦ {motif}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {t.evolution && (
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                  Perkembangan Tema per Babak:
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed">
                  {t.evolution}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Theme */}
      {isModalOpen && editingTheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingTheme.id ? 'Edit Tema & Filosofi' : 'Tambah Tema Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nama Tema *</label>
                <input
                  type="text"
                  value={editingTheme.name || ''}
                  onChange={e => setEditingTheme({ ...editingTheme, name: e.target.value })}
                  placeholder="Misal: Kerentanan dan Pengampunan Diri"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Pernyataan Tematis (Thematic Argument) *</label>
                <textarea
                  value={editingTheme.statement || ''}
                  onChange={e => setEditingTheme({ ...editingTheme, statement: e.target.value })}
                  rows={2}
                  placeholder="Apa kebenaran yang ingin dibuktikan oleh cerita ini kepada pembaca?"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Motif & Simbolisme (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={editingTheme.motifs?.join(', ') || ''}
                  onChange={e =>
                    setEditingTheme({
                      ...editingTheme,
                      motifs: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Mis: Jam dinding berhenti, jendela berkabut, aroma melati"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Evolusi Tema Sepanjang Naskah</label>
                <textarea
                  value={editingTheme.evolution || ''}
                  onChange={e => setEditingTheme({ ...editingTheme, evolution: e.target.value })}
                  rows={3}
                  placeholder="Babak I: Tokoh menyangkal... Babak II: Diuji... Babak III: Menerima..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isCentralThemeCheck"
                  checked={editingTheme.isCentralTheme || false}
                  onChange={e => setEditingTheme({ ...editingTheme, isCentralTheme: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="isCentralThemeCheck" className="text-xs font-medium cursor-pointer">
                  Jadikan Tema Sentral Buku Ini
                </label>
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
                  Simpan Tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
