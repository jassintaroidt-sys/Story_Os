import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  FileText,
  Quote,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  X,
  Tag,
  Copy,
} from 'lucide-react';
import { NoteItem, QuoteItem } from '../types';

export const NotesQuotesView: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    quotes,
    addQuote,
    updateQuote,
    deleteQuote,
  } = useStoryOS();

  const [activeTab, setActiveTab] = useState<'notes' | 'quotes'>('notes');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<NoteItem> | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Partial<QuoteItem> | null>(null);

  // Filter notes
  const filteredNotes = notes.filter(n => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  // Filter quotes
  const filteredQuotes = quotes.filter(quo => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      quo.quoteText.toLowerCase().includes(q) ||
      quo.speaker?.toLowerCase().includes(q) ||
      quo.context?.toLowerCase().includes(q)
    );
  });

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editingNote.title?.trim()) return;

    if (editingNote.id) {
      updateNote(editingNote.id, editingNote);
    } else {
      addNote(editingNote);
    }
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote || !editingQuote.quoteText?.trim()) return;

    if (editingQuote.id) {
      updateQuote(editingQuote.id, editingQuote);
    } else {
      addQuote(editingQuote);
    }
    setIsQuoteModalOpen(false);
    setEditingQuote(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Catatan Penulis & Bank Kutipan
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Kumpulan catatan bebas, pengingat penulisan, dan dialog emas / kutipan inspiratif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs switch */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Catatan ({notes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'quotes'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Bank Kutipan ({quotes.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'notes') {
                setEditingNote({ title: '', content: '', category: 'Umum', isPinned: false });
                setIsNoteModalOpen(true);
              } else {
                setEditingQuote({ quoteText: '', speaker: '', context: '' });
                setIsQuoteModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah {activeTab === 'notes' ? 'Catatan' : 'Kutipan'}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Cari dalam ${activeTab === 'notes' ? 'catatan...' : 'kutipan & dialog...'}`}
          className="w-full bg-transparent border-none focus:outline-hidden text-stone-900 dark:text-stone-100"
        />
      </div>

      {/* Notes View */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-stone-400 bg-white dark:bg-stone-900 rounded-2xl border">
              Belum ada catatan yang tersimpan.
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-2xs hover:border-amber-400 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {note.category || 'Catatan'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingNote(note);
                          setIsNoteModalOpen(true);
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus catatan "${note.title}"?`)) deleteNote(note.id);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                    {note.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed mt-2 line-clamp-6 whitespace-pre-line">
                    {note.content}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between">
                  <span>{new Date(note.updatedAt).toLocaleDateString('id-ID')}</span>
                  {note.isPinned && <span className="text-amber-600">Dipin</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Quotes View */}
      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredQuotes.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-stone-400 bg-white dark:bg-stone-900 rounded-2xl border">
              Belum ada kutipan atau dialog yang disimpan.
            </div>
          ) : (
            filteredQuotes.map(quo => (
              <div
                key={quo.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs hover:border-amber-400 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Quote className="w-6 h-6 text-amber-500/60" />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingQuote(quo);
                          setIsQuoteModalOpen(true);
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus kutipan ini?')) deleteQuote(quo.id);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg font-serif-reading italic text-stone-900 dark:text-stone-100 leading-relaxed">
                    "{quo.quoteText}"
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                    <span>— <strong>{quo.speaker || 'Anonim'}</strong></span>
                    {quo.source && <span>({quo.source})</span>}
                  </div>

                  {quo.context && (
                    <p className="text-xs text-stone-400 font-serif-reading bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-xl">
                      Konteks: {quo.context}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && editingNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingNote.id ? 'Edit Catatan' : 'Tambah Catatan Baru'}
              </h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Judul Catatan *</label>
                <input
                  type="text"
                  value={editingNote.title || ''}
                  onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                  placeholder="Misal: Catatan Nada Dialog Ayah"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Kategori</label>
                <input
                  type="text"
                  value={editingNote.category || ''}
                  onChange={e => setEditingNote({ ...editingNote, category: e.target.value })}
                  placeholder="Mis: Riset Cepat, Ide Dialog, Pengingat Revisi"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Isi Catatan *</label>
                <textarea
                  value={editingNote.content || ''}
                  onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows={5}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {isQuoteModalOpen && editingQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingQuote.id ? 'Edit Kutipan' : 'Tambah Kutipan Baru'}
              </h3>
              <button onClick={() => setIsQuoteModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Teks Kutipan / Dialog Emas *</label>
                <textarea
                  value={editingQuote.quoteText || ''}
                  onChange={e => setEditingQuote({ ...editingQuote, quoteText: e.target.value })}
                  rows={3}
                  placeholder="Misal: 'Rumah bukan sekadar dinding bata, melainkan tempat di mana seseorang selalu menunggumu pulang.'"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-serif-reading"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Pembicara / Penutur</label>
                  <input
                    type="text"
                    value={editingQuote.speaker || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, speaker: e.target.value })}
                    placeholder="Nama tokoh atau penulis"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Sumber / Buku</label>
                  <input
                    type="text"
                    value={editingQuote.source || ''}
                    onChange={e => setEditingQuote({ ...editingQuote, source: e.target.value })}
                    placeholder="Bab 3 atau nama buku referensi"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Konteks Adegan / Emosi</label>
                <input
                  type="text"
                  value={editingQuote.context || ''}
                  onChange={e => setEditingQuote({ ...editingQuote, context: e.target.value })}
                  placeholder="Diucapkan di stasiun saat perpisahan..."
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs"
                >
                  Simpan Kutipan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
