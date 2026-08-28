import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BookPlus,
  Layers,
  FileText,
  PenLine,
  Users,
  MapPin,
  Calendar,
  BrainCircuit,
  Lightbulb,
  FileCode,
  FlaskConical,
  Quote,
  X,
} from 'lucide-react';

export const QuickCreateModal: React.FC = () => {
  const {
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    setActiveView,
    addPart,
    addChapter,
    addScene,
    addCharacter,
    addLocation,
    addTimelineEvent,
    addMemory,
    addIdea,
    addNote,
    addResearchItem,
    addQuote,
  } = useStoryOS();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [descInput, setDescInput] = useState('');

  if (!isQuickCreateOpen) return null;

  const creationTypes = [
    { id: 'book', label: 'Buku Baru', icon: BookPlus, desc: 'Buka wizard pembuatan buku baru', action: () => { setActiveView('books'); setIsQuickCreateOpen(false); } },
    { id: 'part', label: 'Bagian', icon: Layers, desc: 'Kelompok bab utama (Part/Bagian)' },
    { id: 'chapter', label: 'Bab', icon: FileText, desc: 'Bab baru dalam buku aktif' },
    { id: 'scene', label: 'Adegan', icon: PenLine, desc: 'Adegan narasi untuk ditulis' },
    { id: 'character', label: 'Tokoh / Karakter', icon: Users, desc: 'Profil tokoh baru' },
    { id: 'location', label: 'Lokasi', icon: MapPin, desc: 'Tempat atau latar baru' },
    { id: 'timeline', label: 'Peristiwa Timeline', icon: Calendar, desc: 'Peristiwa dalam kronologi atau cerita' },
    { id: 'memory', label: 'Arsip Cerita Hidup', icon: BrainCircuit, desc: 'Pengalaman & memori nyata' },
    { id: 'idea', label: 'Ide Baru', icon: Lightbulb, desc: 'Tampung ke dalam Bank Ide' },
    { id: 'note', label: 'Catatan Bebas', icon: FileCode, desc: 'Catatan pengingat penulisan' },
    { id: 'research', label: 'Item Riset', icon: FlaskConical, desc: 'Fakta, jurnal, referensi' },
    { id: 'quote', label: 'Kutipan', icon: Quote, desc: 'Kutipan inspiratif atau dialog' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    switch (selectedType) {
      case 'part':
        addPart({ title: nameInput, description: descInput });
        setActiveView('structure');
        break;
      case 'chapter':
        addChapter({ title: nameInput, summary: descInput });
        setActiveView('writing_studio');
        break;
      case 'scene':
        addScene({ title: nameInput, summary: descInput });
        setActiveView('writing_studio');
        break;
      case 'character':
        addCharacter({ name: nameInput, background: descInput });
        setActiveView('characters');
        break;
      case 'location':
        addLocation({ name: nameInput, description: descInput });
        setActiveView('locations');
        break;
      case 'timeline':
        addTimelineEvent({ title: nameInput, description: descInput });
        setActiveView('timeline');
        break;
      case 'memory':
        addMemory({ title: nameInput, whatHappened: descInput });
        setActiveView('memories');
        break;
      case 'idea':
        addIdea({ title: nameInput, content: descInput });
        setActiveView('ideas');
        break;
      case 'note':
        addNote({ title: nameInput, content: descInput });
        setActiveView('notes_quotes');
        break;
      case 'research':
        addResearchItem({ title: nameInput, summary: descInput });
        setActiveView('research');
        break;
      case 'quote':
        addQuote({ quoteText: nameInput, source: descInput });
        setActiveView('notes_quotes');
        break;
    }

    setIsQuickCreateOpen(false);
    setSelectedType(null);
    setNameInput('');
    setDescInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base font-serif-book">
              Tambah Cepat
            </h3>
            <p className="text-xs text-stone-500">Pilih entitas yang ingin kamu tambahkan langsung ke proyek buku.</p>
          </div>
          <button
            onClick={() => {
              setIsQuickCreateOpen(false);
              setSelectedType(null);
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {!selectedType ? (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[65vh] overflow-y-auto">
            {creationTypes.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setSelectedType(item.id);
                    }
                  }}
                  className="flex flex-col items-start p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-left transition group"
                >
                  <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 group-hover:bg-amber-100 group-hover:text-amber-700 dark:group-hover:bg-amber-900/50 dark:group-hover:text-amber-300 mb-2 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-stone-400 line-clamp-2">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCreate} className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <span>Menambahkan:</span>
              <span className="font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/50 rounded-full">
                {creationTypes.find(c => c.id === selectedType)?.label}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Judul / Nama <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Misal: Pertemuan di Kedai Kopi"
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Keterangan / Ringkasan Awal
              </label>
              <textarea
                value={descInput}
                onChange={e => setDescInput(e.target.value)}
                rows={3}
                placeholder="Catatan singkat atau tujuan..."
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="px-4 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition disabled:opacity-50"
              >
                Simpan & Buka
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
