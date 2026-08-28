import React, { useState, useEffect, useMemo } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Search,
  Book,
  FileText,
  Users,
  MapPin,
  Calendar,
  Lightbulb,
  FlaskConical,
  Sparkles,
  PenLine,
  Layers,
  CheckSquare,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveView,
    setActiveChapterId,
    setActiveSceneId,
    books,
    chapters,
    scenes,
    characters,
    locations,
    timelineEvents,
    memories,
    ideas,
    researchItems,
    addChapter,
    addScene,
    addCharacter,
    addIdea,
    addNote,
  } = useStoryOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  const actions = useMemo(() => [
    {
      id: 'act-write',
      title: 'Buka Studio Menulis',
      category: 'Tindakan Cepat',
      icon: PenLine,
      action: () => setActiveView('writing_studio'),
    },
    {
      id: 'act-new-chapter',
      title: 'Buat Bab Baru',
      category: 'Tindakan Cepat',
      icon: Plus,
      action: () => {
        const c = addChapter({});
        setActiveChapterId(c.id);
        setActiveView('writing_studio');
      },
    },
    {
      id: 'act-new-scene',
      title: 'Buat Adegan Baru',
      category: 'Tindakan Cepat',
      icon: Plus,
      action: () => {
        const s = addScene({});
        setActiveSceneId(s.id);
        setActiveView('writing_studio');
      },
    },
    {
      id: 'act-new-char',
      title: 'Tambah Tokoh / Karakter Baru',
      category: 'Tindakan Cepat',
      icon: Users,
      action: () => {
        addCharacter({});
        setActiveView('characters');
      },
    },
    {
      id: 'act-new-idea',
      title: 'Tambah Ide Baru ke Bank Ide',
      category: 'Tindakan Cepat',
      icon: Lightbulb,
      action: () => {
        addIdea({});
        setActiveView('ideas');
      },
    },
    {
      id: 'act-timeline',
      title: 'Lihat Timeline Kehidupan',
      category: 'Navigasi',
      icon: Calendar,
      action: () => setActiveView('timeline'),
    },
    {
      id: 'act-bible',
      title: 'Buka Book Bible & Panduan Gaya',
      category: 'Navigasi',
      icon: Book,
      action: () => setActiveView('book_bible'),
    },
    {
      id: 'act-revisions',
      title: 'Buka Pusat Revisi',
      category: 'Navigasi',
      icon: CheckSquare,
      action: () => setActiveView('revisions'),
    },
  ], [addChapter, addScene, addCharacter, addIdea, setActiveChapterId, setActiveSceneId, setActiveView]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return actions;
    }
    const q = query.toLowerCase();
    const results: Array<{
      id: string;
      title: string;
      subtitle?: string;
      category: string;
      icon: any;
      action: () => void;
    }> = [];

    // Filter actions
    actions.forEach(act => {
      if (act.title.toLowerCase().includes(q)) {
        results.push(act);
      }
    });

    // Search Chapters
    chapters.forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.summary?.toLowerCase().includes(q)) {
        results.push({
          id: `chap-${c.id}`,
          title: c.title,
          subtitle: `Bab • ${c.summary?.slice(0, 60) || ''}`,
          category: 'Bab Manuskrip',
          icon: FileText,
          action: () => {
            setActiveChapterId(c.id);
            setActiveView('writing_studio');
          },
        });
      }
    });

    // Search Scenes
    scenes.forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.content?.toLowerCase().includes(q)) {
        results.push({
          id: `scene-${s.id}`,
          title: s.title,
          subtitle: `Adegan • ${s.wordCount} kata`,
          category: 'Adegan',
          icon: PenLine,
          action: () => {
            setActiveSceneId(s.id);
            if (s.chapterId) setActiveChapterId(s.chapterId);
            setActiveView('writing_studio');
          },
        });
      }
    });

    // Search Characters
    characters.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.personality?.toLowerCase().includes(q)) {
        results.push({
          id: `char-${c.id}`,
          title: c.name,
          subtitle: `Tokoh • ${c.occupation || c.type}`,
          category: 'Tokoh',
          icon: Users,
          action: () => setActiveView('characters'),
        });
      }
    });

    // Search Memories
    memories.forEach(m => {
      if (m.title.toLowerCase().includes(q) || m.whatHappened.toLowerCase().includes(q)) {
        results.push({
          id: `mem-${m.id}`,
          title: m.title,
          subtitle: `Arsip Cerita • ${m.year || m.period || ''}`,
          category: 'Arsip Hidup',
          icon: Sparkles,
          action: () => setActiveView('memories'),
        });
      }
    });

    // Search Ideas
    ideas.forEach(i => {
      if (i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)) {
        results.push({
          id: `idea-${i.id}`,
          title: i.title,
          subtitle: `Ide • ${i.category}`,
          category: 'Bank Ide',
          icon: Lightbulb,
          action: () => setActiveView('ideas'),
        });
      }
    });

    // Search Research
    researchItems.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.source.toLowerCase().includes(q)) {
        results.push({
          id: `res-${r.id}`,
          title: r.title,
          subtitle: `Riset • ${r.source}`,
          category: 'Gudang Riset',
          icon: FlaskConical,
          action: () => setActiveView('research'),
        });
      }
    });

    return results;
  }, [query, actions, chapters, scenes, characters, memories, ideas, researchItems, setActiveChapterId, setActiveSceneId, setActiveView]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        searchResults[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ketik untuk mencari bab, tokoh, ide, atau perintah..."
            className="flex-1 bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden text-sm"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-stone-100 dark:divide-stone-800/40">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              Tidak ditemukan hasil untuk "{query}"
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-200/60 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-xs text-stone-400 truncate">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <span>Gunakan panah ↑↓ untuk navigasi</span>
          <span>Tekan ↵ untuk memilih • ESC untuk tutup</span>
        </div>
      </div>
    </div>
  );
};
