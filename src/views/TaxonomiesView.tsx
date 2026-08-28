import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Tag,
  Plus,
  Trash2,
  Bookmark,
  Sliders,
  CheckCircle2,
  Edit2,
  X,
} from 'lucide-react';
import { ViewMode } from '../types';

interface TaxonomiesViewProps {
  initialTab?: 'genres' | 'tags' | 'custom_fields';
}

export const TaxonomiesView: React.FC<TaxonomiesViewProps> = ({ initialTab = 'genres' }) => {
  const { currentBook, updateBook } = useStoryOS();

  const [activeTab, setActiveTab] = useState<'genres' | 'tags' | 'custom_fields'>(initialTab);

  // Genres state
  const [genres, setGenres] = useState<string[]>([
    'Novel Sastra Kontemporer',
    'Autofiksi (Fiksi Otobiografis)',
    'Memoar Naratif',
    'Drama Keluarga',
    'Coming of Age',
  ]);
  const [newGenre, setNewGenre] = useState('');

  // Tags state
  const [tags, setTags] = useState<string[]>([
    'masa_lalu',
    'pulang_kampung',
    'konflik_ayah_anak',
    'stasiun_kereta',
    'dialog_emosional',
    'flashback_kecil',
    'rekonsiliasi',
    'surat_rahasia',
  ]);
  const [newTag, setNewTag] = useState('');

  // Custom fields state
  const [customFields, setCustomFields] = useState<Array<{ name: string; type: string; description: string }>>([
    { name: 'Tingkat Privasi Fakta', type: 'Pilihan (Terbuka / Samaran / Rahasia)', description: 'Tingkat keamanan eksposur peristiwa asli' },
    { name: 'Kunci Emosi Adegan', type: 'Teks Pendek', description: 'Kata sifat emosi dominan dalam adegan' },
    { name: 'Waktu Musim / Cuaca', type: 'Teks Pendek', description: 'Kondisi atmosfer cuaca pendukung' },
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('Teks');
  const [newFieldDesc, setNewFieldDesc] = useState('');

  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenre.trim()) return;
    setGenres([...genres, newGenre.trim()]);
    setNewGenre('');
  };

  const handleRemoveGenre = (idx: number) => {
    setGenres(genres.filter((_, i) => i !== idx));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const clean = newTag.trim().toLowerCase().replace(/\s+/g, '_');
    if (!tags.includes(clean)) setTags([...tags, clean]);
    setNewTag('');
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    setCustomFields([
      ...customFields,
      { name: newFieldName.trim(), type: newFieldType, description: newFieldDesc },
    ]);
    setNewFieldName('');
    setNewFieldDesc('');
  };

  const handleRemoveField = (idx: number) => {
    setCustomFields(customFields.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-semibold uppercase mb-1">
          <Tag className="w-4 h-4" />
          <span>Taksonomi & Pengelompokan Naskah</span>
        </div>
        <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Genre, Label Tagar, & Metadata Khusus
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Atur klasifikasi tema, tagar pencarian cepat lintas modul, dan bidang kustom sesuai kebutuhan unik format bukumu.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs max-w-md">
        <button
          onClick={() => setActiveTab('genres')}
          className={`flex-1 py-2 rounded-lg font-medium transition text-center ${
            activeTab === 'genres'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
              : 'text-stone-500'
          }`}
        >
          Genre & Kategori
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 py-2 rounded-lg font-medium transition text-center ${
            activeTab === 'tags'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
              : 'text-stone-500'
          }`}
        >
          Tagar Lintas Modul
        </button>
        <button
          onClick={() => setActiveTab('custom_fields')}
          className={`flex-1 py-2 rounded-lg font-medium transition text-center ${
            activeTab === 'custom_fields'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
              : 'text-stone-500'
          }`}
        >
          Bidang Kustom
        </button>
      </div>

      {/* Tab 1: Genres */}
      {activeTab === 'genres' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Daftar Genre & Sub-Genre Terdaftar
            </h3>
            <span className="text-xs text-stone-400 font-mono">{genres.length} Genre</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {genres.map((g, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 font-serif-book">
                  {g}
                </span>
                <button
                  onClick={() => handleRemoveGenre(idx)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddGenre} className="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <input
              type="text"
              value={newGenre}
              onChange={e => setNewGenre(e.target.value)}
              placeholder="Tambah genre / sub-genre baru..."
              className="flex-1 text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition"
            >
              + Tambah Genre
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Tags */}
      {activeTab === 'tags' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Tagar & Label Cepat
            </h3>
            <span className="text-xs text-stone-400 font-mono">{tags.length} Tagar</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-200/50 dark:border-amber-900/50 text-xs font-mono"
              >
                <span>#{t}</span>
                <button
                  onClick={() => handleRemoveTag(idx)}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Tulis tagar baru (tanpa spasi)..."
              className="flex-1 text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition"
            >
              + Tambah Tagar
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Custom Fields */}
      {activeTab === 'custom_fields' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Bidang Data Tambahan (Custom Fields)
          </h3>

          <div className="space-y-3">
            {customFields.map((f, idx) => (
              <div
                key={idx}
                className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100 font-mono">
                      {f.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-mono">
                      {f.type}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-serif-reading">
                    {f.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveField(idx)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddField} className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Buat Bidang Kustom Baru:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newFieldName}
                onChange={e => setNewFieldName(e.target.value)}
                placeholder="Nama Bidang (mis: Sudut Kamera)"
                className="text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
                required
              />
              <select
                value={newFieldType}
                onChange={e => setNewFieldType(e.target.value)}
                className="text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              >
                <option value="Teks Singkat">Teks Singkat</option>
                <option value="Teks Panjang">Teks Panjang</option>
                <option value="Pilihan Dropdown">Pilihan Dropdown</option>
                <option value="Angka">Angka</option>
                <option value="Centang Ya/Tidak">Centang Ya/Tidak</option>
              </select>
              <input
                type="text"
                value={newFieldDesc}
                onChange={e => setNewFieldDesc(e.target.value)}
                placeholder="Keterangan singkat fungsi bidang"
                className="text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition"
            >
              + Simpan Bidang Kustom
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
