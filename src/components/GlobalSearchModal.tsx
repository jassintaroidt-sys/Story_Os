import React, { useState, useMemo } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Search,
  FileText,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Lightbulb,
  FlaskConical,
  Quote,
  X,
  ArrowRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    setActiveView,
    setActiveChapterId,
    setActiveSceneId,
    chapters,
    scenes,
    characters,
    locations,
    timelineEvents,
    memories,
    ideas,
    notes,
    quotes,
    researchItems,
  } = useStoryOS();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'manuscript', label: 'Manuskrip (Bab & Adegan)' },
    { id: 'characters', label: 'Tokoh' },
    { id: 'locations', label: 'Lokasi' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'memories', label: 'Arsip Hidup' },
    { id: 'ideas', label: 'Bank Ide' },
    { id: 'research', label: 'Riset' },
    { id: 'notes', label: 'Catatan & Kutipan' },
  ];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: Array<{
      id: string;
      title: string;
      snippet: string;
      category: string;
      categoryKey: string;
      icon: any;
      onClick: () => void;
    }> = [];

    // Chapters
    if (selectedCategory === 'all' || selectedCategory === 'manuscript') {
      chapters.forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.summary?.toLowerCase().includes(q) || c.keyIdea?.toLowerCase().includes(q)) {
          items.push({
            id: `chap-${c.id}`,
            title: c.title,
            snippet: c.summary || c.keyIdea || 'Bab buku',
            category: 'Bab',
            categoryKey: 'manuscript',
            icon: FileText,
            onClick: () => {
              setActiveChapterId(c.id);
              setActiveView('writing_studio');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });

      scenes.forEach(s => {
        if (s.title.toLowerCase().includes(q) || s.content?.toLowerCase().includes(q) || s.summary?.toLowerCase().includes(q)) {
          items.push({
            id: `scene-${s.id}`,
            title: s.title,
            snippet: s.content?.slice(0, 100) || s.summary || '',
            category: 'Adegan',
            categoryKey: 'manuscript',
            icon: FileText,
            onClick: () => {
              setActiveSceneId(s.id);
              if (s.chapterId) setActiveChapterId(s.chapterId);
              setActiveView('writing_studio');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Characters
    if (selectedCategory === 'all' || selectedCategory === 'characters') {
      characters.forEach(c => {
        if (c.name.toLowerCase().includes(q) || c.personality?.toLowerCase().includes(q) || c.background?.toLowerCase().includes(q)) {
          items.push({
            id: `char-${c.id}`,
            title: c.name,
            snippet: `${c.type === 'real_person' ? 'Orang Nyata' : 'Tokoh Fiksi'} • ${c.occupation || ''} • ${c.personality?.slice(0, 80) || ''}`,
            category: 'Tokoh',
            categoryKey: 'characters',
            icon: Users,
            onClick: () => {
              setActiveView('characters');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Locations
    if (selectedCategory === 'all' || selectedCategory === 'locations') {
      locations.forEach(l => {
        if (l.name.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.atmosphere?.toLowerCase().includes(q)) {
          items.push({
            id: `loc-${l.id}`,
            title: l.name,
            snippet: `${l.type || 'Tempat'} • ${l.atmosphere || l.description?.slice(0, 80) || ''}`,
            category: 'Lokasi',
            categoryKey: 'locations',
            icon: MapPin,
            onClick: () => {
              setActiveView('locations');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Timeline
    if (selectedCategory === 'all' || selectedCategory === 'timeline') {
      timelineEvents.forEach(t => {
        if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
          items.push({
            id: `time-${t.id}`,
            title: t.title,
            snippet: `${t.year || t.period || t.dateValue || ''} • ${t.description.slice(0, 90)}`,
            category: 'Timeline',
            categoryKey: 'timeline',
            icon: Calendar,
            onClick: () => {
              setActiveView('timeline');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Memories
    if (selectedCategory === 'all' || selectedCategory === 'memories') {
      memories.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.whatHappened.toLowerCase().includes(q) || m.lessonsLearned?.toLowerCase().includes(q)) {
          items.push({
            id: `mem-${m.id}`,
            title: m.title,
            snippet: m.whatHappened.slice(0, 100),
            category: 'Arsip Hidup',
            categoryKey: 'memories',
            icon: Sparkles,
            onClick: () => {
              setActiveView('memories');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Ideas
    if (selectedCategory === 'all' || selectedCategory === 'ideas') {
      ideas.forEach(i => {
        if (i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)) {
          items.push({
            id: `idea-${i.id}`,
            title: i.title,
            snippet: i.content.slice(0, 100),
            category: 'Ide',
            categoryKey: 'ideas',
            icon: Lightbulb,
            onClick: () => {
              setActiveView('ideas');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Research
    if (selectedCategory === 'all' || selectedCategory === 'research') {
      researchItems.forEach(r => {
        if (r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.source.toLowerCase().includes(q)) {
          items.push({
            id: `res-${r.id}`,
            title: r.title,
            snippet: `${r.source} • ${r.summary.slice(0, 90)}`,
            category: 'Riset',
            categoryKey: 'research',
            icon: FlaskConical,
            onClick: () => {
              setActiveView('research');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    // Notes & Quotes
    if (selectedCategory === 'all' || selectedCategory === 'notes') {
      notes.forEach(n => {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
          items.push({
            id: `note-${n.id}`,
            title: n.title,
            snippet: n.content.slice(0, 90),
            category: 'Catatan',
            categoryKey: 'notes',
            icon: FileText,
            onClick: () => {
              setActiveView('notes_quotes');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });

      quotes.forEach(quo => {
        if (quo.quoteText.toLowerCase().includes(q) || quo.speaker?.toLowerCase().includes(q)) {
          items.push({
            id: `quote-${quo.id}`,
            title: `"${quo.quoteText.slice(0, 50)}..."`,
            snippet: `${quo.speaker || 'Anonim'} • ${quo.context || ''}`,
            category: 'Kutipan',
            categoryKey: 'notes',
            icon: Quote,
            onClick: () => {
              setActiveView('notes_quotes');
              setIsGlobalSearchOpen(false);
            },
          });
        }
      });
    }

    return items;
  }, [query, selectedCategory, chapters, scenes, characters, locations, timelineEvents, memories, ideas, researchItems, notes, quotes, setActiveChapterId, setActiveSceneId, setActiveView, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-4">
      <div
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari kata kunci di seluruh manuskrip, tokoh, riset, memori..."
            className="flex-1 bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              Bersihkan
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50 dark:bg-stone-950/50 flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white font-medium shadow-2xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1 divide-y divide-stone-100 dark:divide-stone-800/40">
          {!query.trim() ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              Ketikkan kata kunci untuk mencari di seluruh bagian naskah dan basis data MY STORY OS.
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              Tidak ditemukan hasil untuk "{query}". Coba kata kunci yang lebih umum.
            </div>
          ) : (
            results.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className="p-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800/50 cursor-pointer transition flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 group-hover:bg-amber-100 group-hover:text-amber-700 dark:group-hover:bg-amber-900/40 dark:group-hover:text-amber-300 transition flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono font-semibold px-2 py-0.2 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                        {item.snippet}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition flex-shrink-0 mt-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Hasil pencarian: {results.length} item</span>
          <span>Tekan ESC untuk keluar</span>
        </div>
      </div>
    </div>
  );
};
