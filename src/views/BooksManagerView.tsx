import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BookPlus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Trash2,
  Copy,
  Archive,
  Star,
  ArrowRight,
  TrendingUp,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Book } from '../types';

export const BooksManagerView: React.FC = () => {
  const {
    books,
    activeBookId,
    setActiveBookId,
    addBook,
    updateBook,
    deleteBook,
    duplicateBook,
    archiveBook,
    setActiveView,
    genres,
  } = useStoryOS();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state for creating new book
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newGenre, setNewGenre] = useState(genres[0]?.name || 'Memoar');
  const [newPremise, setNewPremise] = useState('');
  const [newLogline, setNewLogline] = useState('');
  const [newTargetWords, setNewTargetWords] = useState(50000);
  const [newCoverUrl, setNewCoverUrl] = useState('');

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = addBook({
      title: newTitle,
      subtitle: newSubtitle,
      genre: newGenre,
      premise: newPremise,
      logline: newLogline,
      targetWords: Number(newTargetWords) || 50000,
      coverUrl: newCoverUrl || undefined,
    });

    setActiveBookId(created.id);
    setIsCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewPremise('');
    setNewLogline('');
    setNewTargetWords(50000);
    setNewCoverUrl('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Koleksi Buku & Manuskrip
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola multi-proyek buku fiksi, nonfiksi, memoar, maupun antologi dalam satu sistem terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid / List switch */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition ${viewMode === 'grid' ? 'bg-white dark:bg-stone-700 shadow-2xs text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition ${viewMode === 'list' ? 'bg-white dark:bg-stone-700 shadow-2xs text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}
              title="Tampilan Daftar"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
          >
            <BookPlus className="w-4 h-4" />
            <span>+ Buat Proyek Buku Baru</span>
          </button>
        </div>
      </div>

      {/* Book List / Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => {
            const isActive = book.id === activeBookId;
            return (
              <div
                key={book.id}
                className={`bg-white dark:bg-stone-900 rounded-2xl border transition-all shadow-2xs overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                {/* Book Card Top Cover & Details */}
                <div className="p-5 flex gap-4">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-36 bg-stone-100 dark:bg-stone-800 rounded-lg flex flex-col items-center justify-center text-stone-400 flex-shrink-0 border border-stone-200 dark:border-stone-700">
                      <BookOpen className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-serif-book">Cover</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 truncate">
                          {book.genre}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                            AKTIF
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-stone-900 dark:text-stone-100 font-serif-book text-base leading-snug line-clamp-2">
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-xs text-stone-400 font-serif-reading italic line-clamp-1 mt-0.5">
                          {book.subtitle}
                        </p>
                      )}
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-2 leading-relaxed">
                        {book.logline || book.premise}
                      </p>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                        <span>{book.progress}% selesai</span>
                        <span>{book.targetWords.toLocaleString()} kata</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateBook(book.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800"
                      title="Duplikasi Proyek Buku"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => archiveBook(book.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800"
                      title="Arsipkan Buku"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    {books.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus buku "${book.title}"? Buku akan dipindahkan ke Sampah.`)) {
                            deleteBook(book.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Hapus Buku"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive ? (
                      <button
                        onClick={() => setActiveBookId(book.id)}
                        className="px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition"
                      >
                        Pilih Aktif
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveView('writing_studio')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg shadow-2xs transition"
                      >
                        <span>Tulis Naskah</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {books.map(book => {
              const isActive = book.id === activeBookId;
              return (
                <div
                  key={book.id}
                  className={`p-4 flex items-center justify-between gap-4 transition ${
                    isActive ? 'bg-amber-50/50 dark:bg-amber-950/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-14 bg-stone-100 dark:bg-stone-800 rounded overflow-hidden flex-shrink-0">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 font-serif-book text-xs">
                          B
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate font-serif-book">
                          {book.title}
                        </h4>
                        {isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 truncate">
                        {book.genre} • Target {book.targetWords.toLocaleString()} kata • {book.progress}% selesai
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => duplicateBook(book.id)}
                      className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                      title="Duplikasi"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {!isActive ? (
                      <button
                        onClick={() => setActiveBookId(book.id)}
                        className="px-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200"
                      >
                        Pilih Aktif
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveView('writing_studio')}
                        className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                      >
                        Buka Editor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Book Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                  Buat Proyek Buku Baru
                </h3>
                <p className="text-xs text-stone-500">Mulai karya barumu dengan struktur terencana sejak awal.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Judul Utama Buku <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Misal: Senja di Pelabuhan Terakhir"
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Anak Judul / Subtitle
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  placeholder="Misal: Kumpulan Catatan Perjalanan Menemukan Rumah"
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Genre / Kategori
                  </label>
                  <select
                    value={newGenre}
                    onChange={e => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                  >
                    {genres.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                    <option value="Fiksi Sastra">Fiksi Sastra</option>
                    <option value="Nonfiksi Naratif">Nonfiksi Naratif</option>
                    <option value="Autofiksi">Autofiksi</option>
                    <option value="Memoar">Memoar</option>
                    <option value="Pengembangan Diri">Pengembangan Diri</option>
                    <option value="Misteri / Thriller">Misteri / Thriller</option>
                    <option value="Fantasi / Sci-Fi">Fantasi / Sci-Fi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Target Kata (Word Target)
                  </label>
                  <input
                    type="number"
                    value={newTargetWords}
                    onChange={e => setNewTargetWords(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Logline / 1-Kalimat Inti Cerita
                </label>
                <input
                  type="text"
                  value={newLogline}
                  onChange={e => setNewLogline(e.target.value)}
                  placeholder="Misal: Seorang arsitek kembali ke kampung halaman untuk merekonstruksi rumah masa kecil yang menyimpan rahasia keluarganya."
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Premis & Eksplorasi Pokok
                </label>
                <textarea
                  value={newPremise}
                  onChange={e => setNewPremise(e.target.value)}
                  rows={3}
                  placeholder="Apa pertanyaan filosofis atau benang merah yang hendak kamu jawab melalui buku ini?"
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  URL Gambar Cover (Opsional)
                </label>
                <input
                  type="url"
                  value={newCoverUrl}
                  onChange={e => setNewCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs transition disabled:opacity-50"
                >
                  Buat & Mulai Menulis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
