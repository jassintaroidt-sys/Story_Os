import React, { useState, useEffect, useRef } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Maximize2,
  Minimize2,
  Type,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  MapPin,
  Clock,
  FileText,
  Save,
  History,
  BookOpen,
  Plus,
  Compass,
  CheckCircle2,
  Eye,
  Sliders,
  AlignLeft,
  AlignJustify,
  Layers,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Copy,
  PlusCircle,
  Check,
} from 'lucide-react';
import { SceneStatus, WritingBlock } from '../types';

export const WritingStudioView: React.FC = () => {
  const {
    activeBook,
    chapters,
    scenes,
    activeChapterId,
    setActiveChapterId,
    activeSceneId,
    setActiveSceneId,
    updateScene,
    updateChapter,
    addScene,
    characters,
    locations,
    saveSceneSnapshot,
    writingBlocks,
    addWritingBlock,
    updateWritingBlock,
    deleteWritingBlock,
    reorderWritingBlocks,
    stats,
  } = useStoryOS();

  // Typography state
  const [fontFamily, setFontFamily] = useState<'font-serif-book' | 'font-serif-reading' | 'font-sans' | 'font-mono'>('font-serif-reading');
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<'leading-relaxed' | 'leading-loose' | 'leading-normal'>('leading-relaxed');
  const [textAlign, setTextAlign] = useState<'text-left' | 'text-justify'>('text-left');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [typewriterMode, setTypewriterMode] = useState<boolean>(false);

  // Panels visibility
  const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [activeInspectTab, setActiveInspectTab] = useState<'meta' | 'blocks' | 'characters' | 'history'>('meta');

  // Writing block creation/edit state
  const [isCreatingBlock, setIsCreatingBlock] = useState(false);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockType, setNewBlockType] = useState<'prose' | 'dialogue' | 'beat' | 'sensory' | 'note'>('prose');
  const [newBlockContent, setNewBlockContent] = useState('');
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Snapshot note modal/input
  const [snapshotNote, setSnapshotNote] = useState<string>('');
  const [showSnapshotInput, setShowSnapshotInput] = useState<boolean>(false);

  // Target current scene and chapter
  const currentScene = scenes.find(s => s.id === activeSceneId) || scenes[0];
  const currentChapter = chapters.find(c => c.id === currentScene?.chapterId) || chapters.find(c => c.id === activeChapterId) || chapters[0];

  // Editor ref for typewriter scrolling
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep state synced if currentScene changes
  useEffect(() => {
    if (currentScene && currentScene.id !== activeSceneId) {
      setActiveSceneId(currentScene.id);
      if (currentScene.chapterId && currentScene.chapterId !== activeChapterId) {
        setActiveChapterId(currentScene.chapterId);
      }
    }
  }, [currentScene, activeSceneId, activeChapterId, setActiveChapterId, setActiveSceneId]);

  const handleContentChange = (newContent: string) => {
    if (!currentScene) return;
    updateScene(currentScene.id, {
      content: newContent,
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (!currentScene) return;
    updateScene(currentScene.id, {
      title: newTitle,
    });
  };

  const handleStatusChange = (status: SceneStatus) => {
    if (!currentScene) return;
    updateScene(currentScene.id, { status });
  };

  const handleSaveSnapshot = () => {
    if (!currentScene) return;
    saveSceneSnapshot(currentScene.id, snapshotNote.trim() || `Draf ${new Date().toLocaleTimeString('id-ID')}`);
    setSnapshotNote('');
    setShowSnapshotInput(false);
  };

  // Structured writing blocks for current scene
  const sceneBlocks = currentScene
    ? writingBlocks
        .filter(b => b.sceneId === currentScene.id)
        .sort((a, b) => a.order - b.order)
    : [];

  const handleCreateBlock = () => {
    if (!currentScene || !activeBook) return;
    const order = sceneBlocks.length;
    addWritingBlock({
      bookId: activeBook.id,
      chapterId: currentScene.chapterId,
      sceneId: currentScene.id,
      order,
      blockType: newBlockType,
      title: newBlockTitle.trim() || undefined,
      content: newBlockContent,
      wordCount: newBlockContent.trim() ? newBlockContent.trim().split(/\s+/).length : 0,
    });
    setNewBlockTitle('');
    setNewBlockContent('');
    setIsCreatingBlock(false);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!currentScene) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sceneBlocks.length) return;
    const newBlocks = [...sceneBlocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    reorderWritingBlocks(currentScene.id, newBlocks.map(b => b.id));
  };

  const handleInsertBlockToDraft = (blockContent: string) => {
    if (!currentScene) return;
    const updated = currentScene.content ? `${currentScene.content}\n\n${blockContent}` : blockContent;
    updateScene(currentScene.id, { content: updated });
  };

  const handleCombineAllBlocksToDraft = () => {
    if (!currentScene || sceneBlocks.length === 0) return;
    const combined = sceneBlocks.map(b => b.content).join('\n\n');
    updateScene(currentScene.id, { content: combined });
  };

  const handleSplitDraftToBlocks = () => {
    if (!currentScene || !activeBook || !currentScene.content.trim()) return;
    const paragraphs = currentScene.content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length === 0) return;
    paragraphs.forEach((p, idx) => {
      addWritingBlock({
        bookId: activeBook.id,
        chapterId: currentScene.chapterId,
        sceneId: currentScene.id,
        order: sceneBlocks.length + idx,
        blockType: 'prose',
        title: `Paragraf ${sceneBlocks.length + idx + 1}`,
        content: p,
        wordCount: p.split(/\s+/).length,
      });
    });
  };

  // Word count & stats for active scene
  const sceneText = currentScene?.content || '';
  const sceneWords = sceneText.trim() ? sceneText.trim().split(/\s+/).length : 0;
  const sceneChars = sceneText.length;
  const sceneCharsNoSpace = sceneText.replace(/\s+/g, '').length;
  const sceneReadingMin = Math.ceil(sceneWords / 200);
  const scenePages = (sceneWords / 300).toFixed(1);

  return (
    <div className={`relative flex flex-col h-[calc(100vh-4rem)] overflow-hidden ${isZenMode ? 'fixed inset-0 z-50 bg-stone-50 dark:bg-stone-950 p-4 sm:p-8' : ''}`}>
      
      {/* Writing Studio Top Toolbar */}
      <div className="h-12 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur flex items-center justify-between px-3 sm:px-4 flex-shrink-0">
        {/* Left: Toggle navigation drawer & Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="Sembunyikan / Tampilkan Daftar Adegan"
          >
            {isNavOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 min-w-0">
            <span className="truncate max-w-[120px] font-medium text-stone-700 dark:text-stone-300">
              {currentChapter ? currentChapter.title : 'Bab'}
            </span>
            <span>/</span>
            <span className="truncate max-w-[160px] font-bold text-stone-900 dark:text-stone-100">
              {currentScene ? currentScene.title : 'Pilih Adegan'}
            </span>
          </div>
        </div>

        {/* Center: Formatting & Typography controls */}
        <div className="hidden md:flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/70 p-1 rounded-xl">
          {/* Font selector */}
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value as any)}
            className="text-xs bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 focus:outline-hidden"
          >
            <option value="font-serif-reading">Lora (Serif Hangat)</option>
            <option value="font-serif-book">Merriweather (Klasik)</option>
            <option value="font-sans">Plus Jakarta (Modern)</option>
            <option value="font-mono">JetBrains (Naskah Mentah)</option>
          </select>

          {/* Font size adjustments */}
          <div className="flex items-center text-xs text-stone-600 dark:text-stone-300 px-1 font-mono">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
              className="px-1.5 py-0.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded"
              title="Perkecil Huruf"
            >
              A-
            </button>
            <span className="w-5 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
              className="px-1.5 py-0.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded"
              title="Perbesar Huruf"
            >
              A+
            </button>
          </div>

          {/* Text Alignment */}
          <button
            onClick={() => setTextAlign(textAlign === 'text-left' ? 'text-justify' : 'text-left')}
            className={`p-1 rounded text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 ${textAlign === 'text-justify' ? 'bg-white dark:bg-stone-900 shadow-2xs' : ''}`}
            title="Rata Kiri / Rata Kanan-Kiri"
          >
            {textAlign === 'text-justify' ? <AlignJustify className="w-3.5 h-3.5" /> : <AlignLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Typewriter toggle */}
          <button
            onClick={() => setTypewriterMode(!typewriterMode)}
            className={`px-2 py-1 text-[11px] rounded transition ${typewriterMode ? 'bg-amber-600 text-white font-medium' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            title="Fokus Baris Aktif di Tengah Layar"
          >
            Mesin Tik
          </button>
        </div>

        {/* Right: Zen Mode, Save Snapshot, Inspector toggle */}
        <div className="flex items-center gap-1.5">
          {/* Status Badge Dropdown */}
          {currentScene && (
            <select
              value={currentScene.status}
              onChange={e => handleStatusChange(e.target.value as SceneStatus)}
              className="text-[11px] font-mono px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 focus:outline-hidden"
            >
              <option value="draft">Draf Kasar</option>
              <option value="first_draft">Draf Pertama</option>
              <option value="revised">Revisi 1</option>
              <option value="polished">Revisi Poles</option>
              <option value="final">Final Selesai</option>
            </select>
          )}

          {/* Snapshot Button */}
          <button
            onClick={() => setShowSnapshotInput(true)}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            title="Simpan Versi Snapshot Naskah Ini"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Zen / Distraction-free Mode */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`p-1.5 rounded-lg transition ${isZenMode ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            title={isZenMode ? 'Keluar Mode Zen (Fokus)' : 'Masuk Mode Zen Tanpa Gangguan'}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Inspector Panel Toggle */}
          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className={`p-1.5 rounded-lg transition ${isInspectorOpen ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            title="Panel Detail Adegan & Referensi Cepat"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Snapshot creation modal prompt */}
      {showSnapshotInput && (
        <div className="absolute top-14 right-4 z-40 bg-white dark:bg-stone-900 p-3 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 w-72 space-y-2">
          <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
            Simpan Snapshot Versi Adegan
          </div>
          <input
            type="text"
            value={snapshotNote}
            onChange={e => setSnapshotNote(e.target.value)}
            placeholder="Keterangan (misal: Sebelum potong paragraf akhir)"
            className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
            autoFocus
          />
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => setShowSnapshotInput(false)}
              className="px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
            >
              Batal
            </button>
            <button
              onClick={handleSaveSnapshot}
              className="px-3 py-1 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded"
            >
              Simpan Versi
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace: 3 Columns (Nav Drawer, Editor Canvas, Inspector Drawer) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAV DRAWER: Chapters & Scenes Tree */}
        {isNavOpen && !isZenMode && (
          <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/70 flex flex-col flex-shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-serif-book">
                Daftar Bab & Adegan
              </span>
              <button
                onClick={() => {
                  const s = addScene({ chapterId: currentChapter?.id });
                  setActiveSceneId(s.id);
                }}
                className="p-1 rounded-md text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950"
                title="Tambah Adegan Baru ke Bab Ini"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 space-y-3">
              {chapters.map(chap => {
                const chapScenes = scenes.filter(s => s.chapterId === chap.id);
                const isSelectedChapter = chap.id === currentChapter?.id;

                return (
                  <div key={chap.id} className="space-y-1">
                    <div
                      onClick={() => setActiveChapterId(chap.id)}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        isSelectedChapter
                          ? 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                      }`}
                    >
                      <span className="truncate">{chap.title}</span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {chapScenes.length} adegan
                      </span>
                    </div>

                    <div className="pl-3 space-y-0.5 border-l border-stone-200 dark:border-stone-800 ml-2">
                      {chapScenes.map(sc => {
                        const isSelectedScene = sc.id === currentScene?.id;
                        return (
                          <div
                            key={sc.id}
                            onClick={() => {
                              setActiveSceneId(sc.id);
                              setActiveChapterId(chap.id);
                            }}
                            className={`flex items-center justify-between px-2 py-1 rounded-md text-xs cursor-pointer transition ${
                              isSelectedScene
                                ? 'bg-amber-600 text-white font-medium shadow-2xs'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/40'
                            }`}
                          >
                            <span className="truncate">{sc.title}</span>
                            <span className={`text-[10px] font-mono ml-1 ${isSelectedScene ? 'text-amber-100' : 'text-stone-400'}`}>
                              {sc.wordCount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER: Editor Canvas */}
        <main className="flex-1 flex flex-col bg-white dark:bg-stone-900 overflow-y-auto relative">
          <div className="max-w-3xl w-full mx-auto px-6 sm:px-12 py-8 flex-1 flex flex-col">
            
            {/* Scene Title Input */}
            <input
              type="text"
              value={currentScene?.title || ''}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Judul Adegan..."
              className="text-2xl sm:text-3xl font-bold font-serif-book text-stone-900 dark:text-stone-100 bg-transparent border-b border-transparent hover:border-stone-200 dark:hover:border-stone-800 focus:border-amber-500 focus:outline-hidden pb-2 mb-4 transition"
            />

            {/* Scene Content Textarea */}
            <textarea
              ref={textareaRef}
              value={currentScene?.content || ''}
              onChange={e => handleContentChange(e.target.value)}
              placeholder="Mulailah menenun kisahmu di sini..."
              style={{ fontSize: `${fontSize}px` }}
              className={`flex-1 w-full bg-transparent text-stone-800 dark:text-stone-200 placeholder-stone-400 resize-none focus:outline-hidden ${fontFamily} ${lineHeight} ${textAlign} leading-relaxed min-h-[500px]`}
            />
          </div>

          {/* Bottom Live Status Bar */}
          <div className="border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur px-4 py-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono">
            <div className="flex items-center gap-3">
              <span><strong>{sceneWords}</strong> kata</span>
              <span>•</span>
              <span>{sceneChars} karakter ({sceneCharsNoSpace} tanpa spasi)</span>
              <span>•</span>
              <span>~{scenePages} hal cetak</span>
              <span>•</span>
              <span>~{sceneReadingMin} menit baca</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Autosave Aktif
              </span>
            </div>
          </div>
        </main>

        {/* RIGHT INSPECTOR DRAWER: Scene Meta, Characters, Fast References */}
        {isInspectorOpen && !isZenMode && (
          <aside className="w-80 border-l border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/70 flex flex-col flex-shrink-0 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 text-xs">
              <button
                onClick={() => setActiveInspectTab('meta')}
                className={`flex-1 py-2.5 font-medium text-center border-b-2 transition ${
                  activeInspectTab === 'meta'
                    ? 'border-amber-600 text-amber-700 dark:text-amber-300 bg-white dark:bg-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Tujuan
              </button>
              <button
                onClick={() => setActiveInspectTab('blocks')}
                className={`flex-1 py-2.5 font-medium text-center border-b-2 transition ${
                  activeInspectTab === 'blocks'
                    ? 'border-amber-600 text-amber-700 dark:text-amber-300 bg-white dark:bg-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Blok ({sceneBlocks.length})
              </button>
              <button
                onClick={() => setActiveInspectTab('characters')}
                className={`flex-1 py-2.5 font-medium text-center border-b-2 transition ${
                  activeInspectTab === 'characters'
                    ? 'border-amber-600 text-amber-700 dark:text-amber-300 bg-white dark:bg-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Tokoh
              </button>
              <button
                onClick={() => setActiveInspectTab('history')}
                className={`flex-1 py-2.5 font-medium text-center border-b-2 transition ${
                  activeInspectTab === 'history'
                    ? 'border-amber-600 text-amber-700 dark:text-amber-300 bg-white dark:bg-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Versi ({currentScene?.snapshots?.length || 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeInspectTab === 'meta' && currentScene && (
                <>
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Ringkasan Singkat Adegan
                    </label>
                    <textarea
                      value={currentScene.summary || ''}
                      onChange={e => updateScene(currentScene.id, { summary: e.target.value })}
                      rows={2}
                      placeholder="Apa yang terjadi di adegan ini?"
                      className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Tujuan Tokoh di Adegan Ini (Scene Goal)
                    </label>
                    <input
                      type="text"
                      value={currentScene.goal || ''}
                      onChange={e => updateScene(currentScene.id, { goal: e.target.value })}
                      placeholder="Apa yang ingin dicapai tokoh utama?"
                      className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Konflik / Rintangan (Conflict)
                    </label>
                    <input
                      type="text"
                      value={currentScene.conflict || ''}
                      onChange={e => updateScene(currentScene.id, { conflict: e.target.value })}
                      placeholder="Rintangan internal atau eksternal?"
                      className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Emosi Awal
                      </label>
                      <input
                        type="text"
                        value={currentScene.emotionalShiftStart || ''}
                        onChange={e => updateScene(currentScene.id, { emotionalShiftStart: e.target.value })}
                        placeholder="Mis: Cemas (+)"
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Emosi Akhir
                      </label>
                      <input
                        type="text"
                        value={currentScene.emotionalShiftEnd || ''}
                        onChange={e => updateScene(currentScene.id, { emotionalShiftEnd: e.target.value })}
                        placeholder="Mis: Hampa (-)"
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Sudut Pandang (POV)
                      </label>
                      <input
                        type="text"
                        value={currentScene.povCharacterId || 'Orang Pertama (Aku)'}
                        onChange={e => updateScene(currentScene.id, { povCharacterId: e.target.value })}
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Nuansa / Nada (Tone)
                      </label>
                      <input
                        type="text"
                        value={currentScene.tone || ''}
                        onChange={e => updateScene(currentScene.id, { tone: e.target.value })}
                        placeholder="Mis: Sunyi, Melankolis"
                        className="w-full p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeInspectTab === 'blocks' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        Writing Blocks ({sceneBlocks.length})
                      </span>
                      <p className="text-[11px] text-stone-500">Unit teks modular adegan</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingBlock(true)}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Tambah
                    </button>
                  </div>

                  {/* Batch Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={handleCombineAllBlocksToDraft}
                      disabled={sceneBlocks.length === 0}
                      className="px-2 py-1.5 bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-md text-[11px] font-medium disabled:opacity-40 transition"
                      title="Gabungkan seluruh blok teks ke lembar naskah utama"
                    >
                      Satukan ke Draf
                    </button>
                    <button
                      onClick={handleSplitDraftToBlocks}
                      disabled={!currentScene?.content?.trim()}
                      className="px-2 py-1.5 bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-md text-[11px] font-medium disabled:opacity-40 transition"
                      title="Pecah paragraf naskah utama menjadi blok terpisah"
                    >
                      Ekstrak Draf → Blok
                    </button>
                  </div>

                  {/* Block Creation Form */}
                  {isCreatingBlock && (
                    <div className="p-3 bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-amber-900 dark:text-amber-300 text-xs">
                          Buat Writing Block Baru
                        </span>
                        <button
                          onClick={() => setIsCreatingBlock(false)}
                          className="text-stone-400 hover:text-stone-600 text-xs"
                        >
                          Batal
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-stone-500 mb-1">
                          Tipe Blok
                        </label>
                        <select
                          value={newBlockType}
                          onChange={e => setNewBlockType(e.target.value as any)}
                          className="w-full p-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                        >
                          <option value="prose">Narasi / Prosa</option>
                          <option value="dialogue">Dialog Antartokoh</option>
                          <option value="beat">Ketukan Adegan (Beat)</option>
                          <option value="sensory">Deskripsi Sensorik</option>
                          <option value="note">Catatan Penulis</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newBlockTitle}
                          onChange={e => setNewBlockTitle(e.target.value)}
                          placeholder="Judul / Label blok (opsional)"
                          className="w-full p-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={3}
                          value={newBlockContent}
                          onChange={e => setNewBlockContent(e.target.value)}
                          placeholder="Ketik isi teks blok di sini..."
                          className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-serif-reading"
                        />
                      </div>
                      <button
                        onClick={handleCreateBlock}
                        disabled={!newBlockContent.trim()}
                        className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium"
                      >
                        Simpan Blok
                      </button>
                    </div>
                  )}

                  {/* List of blocks */}
                  {sceneBlocks.length === 0 && !isCreatingBlock ? (
                    <div className="p-4 text-center text-stone-400 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-800 space-y-2">
                      <p className="text-xs">Belum ada blok terstruktur untuk adegan ini.</p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Writing block membantu membedah adegan menjadi fragmen narasi, dialog, atau beat sensorik yang bisa ditata ulang.
                      </p>
                      <button
                        onClick={() => setIsCreatingBlock(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600/10 text-amber-700 dark:text-amber-300 hover:bg-amber-600/20 rounded-lg text-xs font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        Mulai Buat Blok
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {sceneBlocks.map((block, idx) => {
                        const typeLabels: Record<string, { label: string; badge: string }> = {
                          prose: { label: 'Narasi', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
                          dialogue: { label: 'Dialog', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
                          beat: { label: 'Beat', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
                          sensory: { label: 'Sensorik', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
                          note: { label: 'Catatan', badge: 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300' },
                        };
                        const typeInfo = typeLabels[block.blockType] || typeLabels.prose;

                        return (
                          <div
                            key={block.id}
                            className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2 transition shadow-2xs hover:border-amber-400/60"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 truncate min-w-0">
                                <span className="font-mono text-[10px] text-stone-400">#{idx + 1}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono ${typeInfo.badge}`}>
                                  {typeInfo.label}
                                </span>
                                {block.title && (
                                  <span className="font-medium text-stone-800 dark:text-stone-200 truncate text-[11px]">
                                    {block.title}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleMoveBlock(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20"
                                  title="Pindah Naik"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveBlock(idx, 'down')}
                                  disabled={idx === sceneBlocks.length - 1}
                                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20"
                                  title="Pindah Turun"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteWritingBlock(block.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600"
                                  title="Hapus Blok"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Block Content Editing */}
                            {editingBlockId === block.id ? (
                              <div className="space-y-1.5">
                                <textarea
                                  value={block.content}
                                  onChange={e => updateWritingBlock(block.id, { content: e.target.value, wordCount: e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0 })}
                                  rows={4}
                                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-serif-reading focus:outline-hidden"
                                />
                                <button
                                  onClick={() => setEditingBlockId(null)}
                                  className="px-2 py-1 bg-amber-600 text-white rounded text-[10px] font-medium"
                                >
                                  Selesai Edit
                                </button>
                              </div>
                            ) : (
                              <p
                                onClick={() => setEditingBlockId(block.id)}
                                className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading line-clamp-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 p-1.5 rounded transition"
                                title="Klik untuk mengedit teks blok"
                              >
                                {block.content || <span className="italic text-stone-400">Blok kosong. Klik untuk mengetik...</span>}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400">
                              <span>{block.wordCount} kata</span>
                              <button
                                onClick={() => handleInsertBlockToDraft(block.content)}
                                className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
                                title="Salin teks blok ini ke akhir naskah draf"
                              >
                                <Copy className="w-3 h-3" />
                                Tempel ke Draf
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeInspectTab === 'characters' && (
                <div className="space-y-3">
                  <div className="text-xs text-stone-500">
                    Tokoh dalam proyek ini untuk referensi cepat saat menulis:
                  </div>
                  {characters.map(char => (
                    <div
                      key={char.id}
                      className="p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {char.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase font-mono">
                          {char.role}
                        </span>
                      </div>
                      {char.wound && (
                        <div className="text-[11px] text-stone-500">
                          <strong>Luka Batin:</strong> {char.wound}
                        </div>
                      )}
                      {char.want && (
                        <div className="text-[11px] text-stone-500">
                          <strong>Keinginan:</strong> {char.want}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeInspectTab === 'history' && (
                <div className="space-y-2">
                  <div className="text-xs text-stone-500">
                    Histori draf snapshot yang telah kamu simpan:
                  </div>
                  {(!currentScene?.snapshots || currentScene.snapshots.length === 0) ? (
                    <div className="p-4 text-center text-stone-400 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                      Belum ada snapshot tersimpan. Klik tombol riwayat di atas untuk menyimpan versi cadangan draf adegan ini.
                    </div>
                  ) : (
                    currentScene.snapshots.map((snap, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                            {snap.note || `Versi #${idx + 1}`}
                          </span>
                          <span className="text-stone-400">{snap.wordCount} kata</span>
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {new Date(snap.timestamp).toLocaleString('id-ID')}
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm('Pulihkan teks adegan ke versi snapshot ini? Teks saat ini akan ditimpa.')) {
                              updateScene(currentScene.id, { content: snap.content });
                            }
                          }}
                          className="mt-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                        >
                          Pulihkan Draf Ini
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
