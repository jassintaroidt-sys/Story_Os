import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Layers,
  Plus,
  FileText,
  PenLine,
  ChevronDown,
  ChevronRight,
  MoveUp,
  MoveDown,
  Trash2,
  Edit2,
  Kanban,
  ListTree,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { SceneStatus } from '../types';

export const StructureView: React.FC = () => {
  const {
    parts,
    chapters,
    scenes,
    addPart,
    updatePart,
    deletePart,
    addChapter,
    updateChapter,
    deleteChapter,
    addScene,
    updateScene,
    deleteScene,
    setActiveChapterId,
    setActiveSceneId,
    setActiveView,
  } = useStoryOS();

  const [viewType, setViewType] = useState<'tree' | 'kanban'>('tree');
  const [collapsedParts, setCollapsedParts] = useState<Record<string, boolean>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const togglePartCollapse = (partId: string) => {
    setCollapsedParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const startRename = (id: string, currentTitle: string) => {
    setEditingItemId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = (type: 'part' | 'chapter' | 'scene', id: string) => {
    if (!editTitle.trim()) {
      setEditingItemId(null);
      return;
    }
    if (type === 'part') updatePart(id, { title: editTitle });
    if (type === 'chapter') updateChapter(id, { title: editTitle });
    if (type === 'scene') updateScene(id, { title: editTitle });
    setEditingItemId(null);
  };

  const statusColumns: Array<{ id: SceneStatus; label: string; color: string }> = [
    { id: 'idea', label: 'Ide / Konsep', color: 'border-stone-400' },
    { id: 'outline', label: 'Outline', color: 'border-blue-400' },
    { id: 'draft', label: 'Draf Kasar', color: 'border-amber-400' },
    { id: 'first_draft', label: 'Draf Pertama', color: 'border-orange-500' },
    { id: 'revised', label: 'Revisi 1', color: 'border-purple-500' },
    { id: 'polished', label: 'Revisi Poles', color: 'border-indigo-500' },
    { id: 'final', label: 'Final', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Struktur & Hierarki Naskah
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organisasi bertingkat: Bagian (Parts) → Bab (Chapters) → Adegan (Scenes).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tree vs Kanban Switcher */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => setViewType('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewType === 'tree'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Hierarki Pohon</span>
            </button>
            <button
              onClick={() => setViewType('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewType === 'kanban'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Papan Status Adegan</span>
            </button>
          </div>

          <button
            onClick={() => addPart({ title: `Bagian Baru ${parts.length + 1}` })}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Bagian</span>
          </button>
        </div>
      </div>

      {/* Tree Hierarchy View */}
      {viewType === 'tree' ? (
        <div className="space-y-4">
          {parts.map((part, pIdx) => {
            const isCollapsed = collapsedParts[part.id];
            const partChapters = chapters.filter(c => c.partId === part.id);
            const partWords = partChapters.reduce((sum, ch) => sum + ch.totalWords, 0);

            return (
              <div
                key={part.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-2xs"
              >
                {/* Part Header */}
                <div className="p-4 bg-stone-50/80 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => togglePartCollapse(part.id)}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <Layers className="w-4 h-4 text-amber-600 flex-shrink-0" />

                    {editingItemId === part.id ? (
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="px-2 py-1 text-sm bg-white dark:bg-stone-800 border border-stone-300 rounded font-serif-book w-full"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && saveRename('part', part.id)}
                        />
                        <button
                          onClick={() => saveRename('part', part.id)}
                          className="px-2 py-1 text-xs bg-amber-600 text-white rounded font-medium"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base font-serif-book text-stone-900 dark:text-stone-100 truncate">
                          {part.title}
                        </h3>
                        {part.description && (
                          <p className="text-xs text-stone-400 font-serif-reading truncate">{part.description}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-mono text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-2 py-0.5 rounded">
                      {partWords.toLocaleString()} kata
                    </span>
                    <button
                      onClick={() => startRename(part.id, part.title)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded"
                      title="Ubah Nama Bagian"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => addChapter({ partId: part.id, title: `Bab ${chapters.length + 1}` })}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-lg hover:bg-amber-100 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Bab</span>
                    </button>
                    {parts.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus ${part.title}?`)) deletePart(part.id);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Chapters & Scenes within Part */}
                {!isCollapsed && (
                  <div className="p-4 space-y-4">
                    {partChapters.length === 0 ? (
                      <div className="py-6 text-center text-xs text-stone-400">
                        Belum ada bab di bagian ini. Klik "+ Bab" di kanan atas untuk menambahkan.
                      </div>
                    ) : (
                      partChapters.map(chap => {
                        const chapScenes = scenes.filter(s => s.chapterId === chap.id);

                        return (
                          <div
                            key={chap.id}
                            className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-stone-50/40 dark:bg-stone-900/40"
                          >
                            {/* Chapter Bar */}
                            <div className="p-3 bg-stone-100/60 dark:bg-stone-800/40 flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-stone-500 flex-shrink-0" />
                                {editingItemId === chap.id ? (
                                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={e => setEditTitle(e.target.value)}
                                      className="px-2 py-0.5 text-xs bg-white dark:bg-stone-800 border rounded font-serif-book w-full"
                                      autoFocus
                                      onKeyDown={e => e.key === 'Enter' && saveRename('chapter', chap.id)}
                                    />
                                    <button
                                      onClick={() => saveRename('chapter', chap.id)}
                                      className="px-2 py-0.5 text-xs bg-amber-600 text-white rounded font-medium"
                                    >
                                      Simpan
                                    </button>
                                  </div>
                                ) : (
                                  <div className="min-w-0">
                                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book">
                                      {chap.title}
                                    </span>
                                    {chap.summary && (
                                      <span className="text-xs text-stone-400 font-serif-reading ml-2 truncate hidden sm:inline">
                                        — {chap.summary}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                                <span className="font-mono text-stone-400">{chap.totalWords} kata</span>
                                <button
                                  onClick={() => startRename(chap.id, chap.title)}
                                  className="p-1 text-stone-400 hover:text-stone-700"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => addScene({ chapterId: chap.id, title: `Adegan ${chapScenes.length + 1}` })}
                                  className="flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-[11px] text-stone-700 dark:text-stone-300 hover:border-amber-400 font-medium"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Adegan</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveChapterId(chap.id);
                                    setActiveView('writing_studio');
                                  }}
                                  className="p-1 text-amber-600 dark:text-amber-400 hover:underline"
                                  title="Tulis di Bab Ini"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Scenes List inside Chapter */}
                            <div className="p-2 space-y-1.5">
                              {chapScenes.map((scene, sIdx) => (
                                <div
                                  key={scene.id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60 hover:border-amber-400 transition"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <PenLine className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                                    {editingItemId === scene.id ? (
                                      <input
                                        type="text"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        className="px-2 py-0.5 text-xs bg-white dark:bg-stone-800 border rounded font-serif-book"
                                        autoFocus
                                        onKeyDown={e => e.key === 'Enter' && saveRename('scene', scene.id)}
                                      />
                                    ) : (
                                      <span
                                        onClick={() => {
                                          setActiveSceneId(scene.id);
                                          setActiveChapterId(chap.id);
                                          setActiveView('writing_studio');
                                        }}
                                        className="text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-amber-600 cursor-pointer truncate"
                                      >
                                        {scene.title}
                                      </span>
                                    )}
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-700 text-stone-500">
                                      {scene.status}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <span className="font-mono">{scene.wordCount} kata</span>
                                    <button
                                      onClick={() => startRename(scene.id, scene.title)}
                                      className="p-1 hover:text-stone-700"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveSceneId(scene.id);
                                        setActiveChapterId(chap.id);
                                        setActiveView('writing_studio');
                                      }}
                                      className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded hover:bg-amber-500/20 text-[11px] font-medium"
                                    >
                                      Buka di Editor
                                    </button>
                                    <button
                                      onClick={() => deleteScene(scene.id)}
                                      className="p-1 hover:text-rose-600"
                                      title="Hapus Adegan"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Kanban Board View by Scene Status */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {statusColumns.map(col => {
            const colScenes = scenes.filter(s => s.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col min-w-[200px]"
              >
                <div className={`p-3 border-b-2 ${col.color} bg-white dark:bg-stone-800/80 rounded-t-xl flex items-center justify-between`}>
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    {colScenes.length}
                  </span>
                </div>

                <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[70vh]">
                  {colScenes.map(sc => {
                    const parentChapter = chapters.find(c => c.id === sc.chapterId);
                    return (
                      <div
                        key={sc.id}
                        onClick={() => {
                          setActiveSceneId(sc.id);
                          if (sc.chapterId) setActiveChapterId(sc.chapterId);
                          setActiveView('writing_studio');
                        }}
                        className="p-2.5 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-amber-400 cursor-pointer shadow-2xs transition space-y-1"
                      >
                        <span className="text-[9px] font-mono text-stone-400 uppercase block truncate">
                          {parentChapter ? parentChapter.title : 'Bab Bebas'}
                        </span>
                        <h5 className="font-semibold text-xs text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                          {sc.title}
                        </h5>
                        <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 pt-1">
                          <span>{sc.wordCount} kata</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
