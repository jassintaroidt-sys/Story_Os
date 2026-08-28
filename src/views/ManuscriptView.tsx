import React, { useState, useMemo } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BookOpen,
  Eye,
  Edit3,
  Printer,
  Copy,
  Check,
  Download,
  Layers,
  ChevronDown,
  AlignLeft,
  AlignJustify,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
  Sliders,
  Bookmark,
  Users,
  MapPin,
  Heart,
} from 'lucide-react';

export const ManuscriptView: React.FC = () => {
  const {
    currentBook,
    parts,
    chapters,
    scenes,
    writingBlocks,
    characters,
    locations,
    setActiveView,
    setActiveChapterId,
    setActiveSceneId,
  } = useStoryOS();

  // Scope filter: 'all' | 'part' | 'chapter' | 'scene'
  const [scope, setScope] = useState<'all' | 'part' | 'chapter' | 'scene'>('all');
  const [selectedPartId, setSelectedPartId] = useState<string>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [selectedSceneId, setSelectedSceneId] = useState<string>('all');

  // Presentation settings
  const [fontFamily, setFontFamily] = useState<'font-serif-reading' | 'font-serif-book' | 'font-sans' | 'font-mono'>('font-serif-reading');
  const [fontSize, setFontSize] = useState<number>(18);
  const [textAlign, setTextAlign] = useState<'text-left' | 'text-justify'>('text-justify');
  const [lineHeight, setLineHeight] = useState<'leading-relaxed' | 'leading-loose' | 'leading-normal'>('leading-loose');
  const [showMetadata, setShowMetadata] = useState<boolean>(true);
  const [showSceneBreaks, setShowSceneBreaks] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Active book items (sorted)
  const bookParts = useMemo(() => {
    return parts
      .filter(p => !p.isTrashed)
      .sort((a, b) => a.order - b.order);
  }, [parts]);

  const bookChapters = useMemo(() => {
    return chapters
      .filter(c => !c.isTrashed)
      .sort((a, b) => a.order - b.order);
  }, [chapters]);

  const bookScenes = useMemo(() => {
    return scenes
      .filter(s => !s.isTrashed)
      .sort((a, b) => a.order - b.order);
  }, [scenes]);

  // Filtered compilation
  const compiledHierarchy = useMemo(() => {
    return bookParts.map(part => {
      // Find chapters in this part
      const partChapters = bookChapters.filter(c => c.partId === part.id);
      return {
        part,
        chapters: partChapters.map(chap => {
          const chapScenes = bookScenes.filter(s => s.chapterId === chap.id);
          return {
            chapter: chap,
            scenes: chapScenes.map(sc => {
              const blocks = writingBlocks
                .filter(b => b.sceneId === sc.id)
                .sort((a, b) => a.order - b.order);
              return {
                scene: sc,
                blocks,
              };
            }),
          };
        }),
      };
    });
  }, [bookParts, bookChapters, bookScenes, writingBlocks]);

  // Also include orphan chapters (no part assigned)
  const orphanChapters = useMemo(() => {
    return bookChapters.filter(c => !c.partId).map(chap => {
      const chapScenes = bookScenes.filter(s => s.chapterId === chap.id);
      return {
        chapter: chap,
        scenes: chapScenes.map(sc => {
          const blocks = writingBlocks
            .filter(b => b.sceneId === sc.id)
            .sort((a, b) => a.order - b.order);
          return {
            scene: sc,
            blocks,
          };
        }),
      };
    });
  }, [bookChapters, bookScenes, writingBlocks]);

  // Compute displayed scenes based on scope
  const displayedScenes = useMemo(() => {
    let list = bookScenes;
    if (scope === 'part' && selectedPartId !== 'all') {
      const chapsInPart = bookChapters.filter(c => c.partId === selectedPartId).map(c => c.id);
      list = list.filter(s => chapsInPart.includes(s.chapterId));
    } else if (scope === 'chapter' && selectedChapterId !== 'all') {
      list = list.filter(s => s.chapterId === selectedChapterId);
    } else if (scope === 'scene' && selectedSceneId !== 'all') {
      list = list.filter(s => s.id === selectedSceneId);
    }
    return list;
  }, [bookScenes, scope, selectedPartId, selectedChapterId, selectedSceneId, bookChapters]);

  // Aggregate stats
  const totalCompiledWords = useMemo(() => {
    return displayedScenes.reduce((acc, sc) => {
      const words = sc.content ? sc.content.trim().split(/\s+/).filter(Boolean).length : 0;
      return acc + words;
    }, 0);
  }, [displayedScenes]);

  const estimatedPages = Math.max(1, Math.round(totalCompiledWords / 275));
  const readingTimeMin = Math.max(1, Math.round(totalCompiledWords / 200));

  // Character and location lookup maps
  const charMap = useMemo(() => new Map(characters.map(c => [c.id, c.name])), [characters]);
  const locMap = useMemo(() => new Map(locations.map(l => [l.id, l.name])), [locations]);

  // Action: Open in Writing Studio
  const handleEditScene = (chapterId: string, sceneId: string) => {
    setActiveChapterId(chapterId);
    setActiveSceneId(sceneId);
    setActiveView('writing_studio');
  };

  // Action: Copy text
  const handleCopyManuscript = () => {
    let fullText = `${currentBook.title}\nOleh: ${currentBook.authorName || 'Penulis'}\n\n`;
    displayedScenes.forEach(sc => {
      const chap = bookChapters.find(c => c.id === sc.chapterId);
      fullText += `\n### ${chap?.title || 'Bab'} — ${sc.title}\n\n${sc.content || ''}\n\n* * *\n`;
    });
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Action: Print
  const handlePrint = () => {
    window.print();
  };

  // Action: Download text
  const handleDownload = () => {
    let fullText = `${currentBook.title}\nOleh: ${currentBook.authorName || 'Penulis'}\n\n`;
    displayedScenes.forEach(sc => {
      const chap = bookChapters.find(c => c.id === sc.chapterId);
      fullText += `\n=========================================\n${chap?.title || 'Bab'}\nAdegan: ${sc.title}\n=========================================\n\n${sc.content || ''}\n\n`;
    });
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(currentBook?.title || 'manuskrip').replace(/\s+/g, '_').toLowerCase()}_manuskrip.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Lapisan 1: Buku & Manuskrip</span>
            </div>
            <h1 className="text-2xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Manuskrip Lengkap — {currentBook.title}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
              Gabungan utuh dari seluruh bagian, bab, dan adegan yang telah ditulis. Baca naskah seperti buku fisik, periksa ritme narasi, atau cetak untuk penyuntingan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyManuscript}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-medium transition"
              title="Salin isi naskah yang tampil ke papan klip"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Naskah'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-medium transition"
              title="Unduh file naskah teks"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh TXT</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
              title="Cetak atau simpan ke format PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Aggregate Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-stone-100 dark:border-stone-800/80 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <span className="text-stone-500 block">Total Kata Terbaca</span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
              {totalCompiledWords.toLocaleString('id-ID')} kata
            </span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <span className="text-stone-500 block">Estimasi Halaman Cetak</span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
              ~{estimatedPages} halaman (A5)
            </span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <span className="text-stone-500 block">Waktu Baca Santai</span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
              ~{readingTimeMin} menit
            </span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <span className="text-stone-500 block">Adegan yang Ditampilkan</span>
            <span className="text-base font-bold text-amber-700 dark:text-amber-400 font-mono mt-0.5 block">
              {displayedScenes.length} dari {bookScenes.length} adegan
            </span>
          </div>
        </div>
      </div>

      {/* Scope Selector & Reader Typography Controls */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Scope Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Cakupan Baca:
          </span>
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scope === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Seluruh Buku
            </button>
            <button
              onClick={() => setScope('part')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scope === 'part'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Per Bagian
            </button>
            <button
              onClick={() => setScope('chapter')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scope === 'chapter'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Per Bab
            </button>
            <button
              onClick={() => setScope('scene')}
              className={`px-3 py-1.5 rounded-lg transition ${
                scope === 'scene'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Per Adegan
            </button>
          </div>

          {/* Conditional Dropdown based on scope */}
          {scope === 'part' && (
            <select
              value={selectedPartId}
              onChange={e => setSelectedPartId(e.target.value)}
              className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-stone-800 dark:text-stone-200"
            >
              <option value="all">Pilih Bagian (Semua)</option>
              {bookParts.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}

          {scope === 'chapter' && (
            <select
              value={selectedChapterId}
              onChange={e => setSelectedChapterId(e.target.value)}
              className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-stone-800 dark:text-stone-200"
            >
              <option value="all">Pilih Bab (Semua)</option>
              {bookChapters.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          )}

          {scope === 'scene' && (
            <select
              value={selectedSceneId}
              onChange={e => setSelectedSceneId(e.target.value)}
              className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-stone-800 dark:text-stone-200"
            >
              <option value="all">Pilih Adegan (Semua)</option>
              {bookScenes.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          )}
        </div>

        {/* Right: Typography & Formatting Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value as any)}
            className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-stone-700 dark:text-stone-300"
          >
            <option value="font-serif-reading">Lora (Serif Hangat)</option>
            <option value="font-serif-book">Merriweather (Klasik)</option>
            <option value="font-sans">Plus Jakarta (Modern)</option>
            <option value="font-mono">JetBrains (Naskah Mentah)</option>
          </select>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
              className="px-2 py-1 hover:bg-white dark:hover:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300"
              title="Perkecil Font"
            >
              A-
            </button>
            <span className="px-1.5 font-mono text-xs text-stone-700 dark:text-stone-300">{fontSize}</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
              className="px-2 py-1 hover:bg-white dark:hover:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300"
              title="Perbesar Font"
            >
              A+
            </button>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5">
            <button
              onClick={() => setTextAlign('text-left')}
              className={`p-1.5 rounded-lg ${textAlign === 'text-left' ? 'bg-white dark:bg-stone-700 text-stone-900 shadow-2xs' : 'text-stone-500'}`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('text-justify')}
              className={`p-1.5 rounded-lg ${textAlign === 'text-justify' ? 'bg-white dark:bg-stone-700 text-stone-900 shadow-2xs' : 'text-stone-500'}`}
              title="Rata Kanan Kiri (Justified)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              showMetadata
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-stone-50 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
            }`}
          >
            {showMetadata ? 'Meta Adegan: Aktif' : 'Meta Adegan: Tersembunyi'}
          </button>
        </div>
      </div>

      {/* Manuscript Reader Book View */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm p-6 sm:p-12 md:p-16 transition-colors">
        
        {/* Book Title & Front Title Page */}
        <div className="text-center pb-12 mb-12 border-b border-stone-200 dark:border-stone-800">
          <span className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-mono block mb-2">
            Manuskrip Buku
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-book text-stone-900 dark:text-stone-100 tracking-tight">
            {currentBook.title}
          </h2>
          {currentBook.subtitle && (
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 mt-2 font-serif-reading italic">
              {currentBook.subtitle}
            </p>
          )}
          <div className="mt-4 text-xs sm:text-sm text-stone-500 font-serif-reading">
            Oleh: <span className="font-semibold text-stone-800 dark:text-stone-200">{currentBook.authorName || 'Penulis'}</span>
            {currentBook.penName && ` (Nama Pena: ${currentBook.penName})`}
          </div>
        </div>

        {/* Reading Body by Parts or Chapters */}
        {displayedScenes.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">Belum ada adegan tulisan yang cocok dengan filter yang dipilih.</p>
            <button
              onClick={() => setScope('all')}
              className="mt-3 text-xs text-amber-600 hover:underline"
            >
              Tampilkan Seluruh Naskah Buku
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Render grouped by Part */}
            {compiledHierarchy.map(partGroup => {
              // Check if any scenes in this part match the current displayedScenes filter
              const partScenes = partGroup.chapters.flatMap(c => c.scenes).filter(s => displayedScenes.some(ds => ds.id === s.scene.id));
              if (partScenes.length === 0) return null;

              return (
                <section key={partGroup.part.id} className="space-y-12">
                  {/* Part Divider Header */}
                  <div className="text-center py-8 border-y border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-950/30 rounded-2xl">
                    <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold block mb-1">
                      BAGIAN {partGroup.part.number}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
                      {partGroup.part.title}
                    </h3>
                    {partGroup.part.description && (
                      <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto mt-2 font-serif-reading italic">
                        {partGroup.part.description}
                      </p>
                    )}
                  </div>

                  {/* Chapters within Part */}
                  {partGroup.chapters.map(chapGroup => {
                    const chapterScenes = chapGroup.scenes.filter(s => displayedScenes.some(ds => ds.id === s.scene.id));
                    if (chapterScenes.length === 0) return null;

                    return (
                      <article key={chapGroup.chapter.id} className="space-y-10">
                        {/* Chapter Title Header */}
                        <div className="text-center pb-6 border-b border-stone-100 dark:border-stone-800">
                          <span className="text-xs font-mono uppercase text-stone-400 block mb-1">
                            Bab {chapGroup.chapter.number}
                          </span>
                          <h4 className="text-xl sm:text-2xl font-bold font-serif-book text-stone-800 dark:text-stone-200">
                            {chapGroup.chapter.title}
                          </h4>
                          {chapGroup.chapter.summary && (
                            <p className="text-xs text-stone-500 max-w-lg mx-auto mt-1 italic">
                              "{chapGroup.chapter.summary}"
                            </p>
                          )}
                        </div>

                        {/* Scenes in this Chapter */}
                        <div className="space-y-12">
                          {chapterScenes.map((scItem, idx) => {
                            const { scene, blocks } = scItem;
                            const sceneWordCount = scene.content ? scene.content.trim().split(/\s+/).filter(Boolean).length : 0;
                            const sceneChars = characters.filter(c => scene.characterIds?.includes(c.id));
                            const sceneLocs = locations.filter(l => scene.locationIds?.includes(l.id));

                            return (
                              <div key={scene.id} className="space-y-4 group">
                                {/* Optional Scene Metadata Header */}
                                {showMetadata && (
                                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-100 dark:border-stone-800/60 text-xs">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                                        Adegan {scene.number}: {scene.title}
                                      </span>
                                      <span className="text-stone-400">•</span>
                                      <span className="font-mono text-stone-500">{sceneWordCount} kata</span>
                                      {scene.pov && (
                                        <span className="px-2 py-0.5 bg-stone-200/70 dark:bg-stone-700/70 rounded text-[11px] text-stone-600 dark:text-stone-300">
                                          POV: {scene.pov}
                                        </span>
                                      )}
                                      {sceneChars.length > 0 && (
                                        <span className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400">
                                          <Users className="w-3 h-3 text-stone-400" />
                                          {sceneChars.map(c => c.name).join(', ')}
                                        </span>
                                      )}
                                      {sceneLocs.length > 0 && (
                                        <span className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400">
                                          <MapPin className="w-3 h-3 text-stone-400" />
                                          {sceneLocs.map(l => l.name).join(', ')}
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => handleEditScene(scene.chapterId, scene.id)}
                                      className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition"
                                      title="Buka di Studio Menulis"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Edit di Studio</span>
                                    </button>
                                  </div>
                                )}

                                {/* Scene Body Text */}
                                <div
                                  className={`${fontFamily} ${textAlign} ${lineHeight} text-stone-800 dark:text-stone-200 whitespace-pre-wrap`}
                                  style={{ fontSize: `${fontSize}px` }}
                                >
                                  {scene.content && scene.content.trim() ? (
                                    scene.content
                                  ) : (
                                    <em className="text-stone-400 font-sans text-xs italic block py-4">
                                      [Adegan ini belum memiliki teks draf. Klik "Edit di Studio" untuk mulai menulis.]
                                    </em>
                                  )}
                                </div>

                                {/* Scene break divider */}
                                {showSceneBreaks && idx < chapterScenes.length - 1 && (
                                  <div className="text-center py-6 text-stone-300 dark:text-stone-700 tracking-widest font-serif">
                                    * * *
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </section>
              );
            })}

            {/* Render Orphan Chapters if any */}
            {orphanChapters.map(chapGroup => {
              const chapterScenes = chapGroup.scenes.filter(s => displayedScenes.some(ds => ds.id === s.scene.id));
              if (chapterScenes.length === 0) return null;

              return (
                <article key={chapGroup.chapter.id} className="space-y-10">
                  <div className="text-center pb-6 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-mono uppercase text-stone-400 block mb-1">
                      Bab {chapGroup.chapter.number}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold font-serif-book text-stone-800 dark:text-stone-200">
                      {chapGroup.chapter.title}
                    </h4>
                  </div>

                  <div className="space-y-12">
                    {chapterScenes.map((scItem, idx) => {
                      const { scene } = scItem;
                      const sceneWordCount = scene.content ? scene.content.trim().split(/\s+/).filter(Boolean).length : 0;

                      return (
                        <div key={scene.id} className="space-y-4">
                          {showMetadata && (
                            <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-100 dark:border-stone-800/60 text-xs">
                              <span className="font-semibold text-stone-700 dark:text-stone-300">
                                Adegan {scene.number}: {scene.title} ({sceneWordCount} kata)
                              </span>
                              <button
                                onClick={() => handleEditScene(scene.chapterId, scene.id)}
                                className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit di Studio</span>
                              </button>
                            </div>
                          )}
                          <div
                            className={`${fontFamily} ${textAlign} ${lineHeight} text-stone-800 dark:text-stone-200 whitespace-pre-wrap`}
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            {scene.content || <em className="text-stone-400 font-sans text-xs italic">[Belum ada isi naskah]</em>}
                          </div>
                          {showSceneBreaks && idx < chapterScenes.length - 1 && (
                            <div className="text-center py-6 text-stone-300 dark:text-stone-700 tracking-widest font-serif">
                              * * *
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* End of Manuscript Marker */}
        <div className="mt-20 pt-10 text-center border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-mono">
            — AKHIR DARI NASKAH TAMPILAN —
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Perlu melanjutkan babak berikutnya? Kunjungi{' '}
            <button
              onClick={() => setActiveView('writing_studio')}
              className="font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Studio Menulis
            </button>{' '}
            atau atur struktur di{' '}
            <button
              onClick={() => setActiveView('structure')}
              className="font-medium text-amber-700 dark:text-amber-400 hover:underline"
            >
              Kerangka Struktur
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
