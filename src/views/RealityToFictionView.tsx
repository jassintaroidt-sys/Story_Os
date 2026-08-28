import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Repeat,
  Sparkles,
  Plus,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Trash2,
  PenLine,
  Sliders,
} from 'lucide-react';
import { RealityTransformation } from '../types';

export const RealityToFictionView: React.FC = () => {
  const {
    transformations,
    addTransformation,
    updateTransformation,
    deleteTransformation,
    addScene,
    setActiveSceneId,
    setActiveView,
  } = useStoryOS();

  const [selectedId, setSelectedId] = useState<string | null>(transformations[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'real' | 'narrative_nonfiction' | 'autofiction' | 'pure_fiction'>('autofiction');

  const currentTrans = transformations.find(t => t.id === selectedId) || transformations[0];

  const handleAddNew = () => {
    const created = addTransformation({
      title: 'Transformasi Baru: Pengalaman Masa Kecil',
      realEvent: 'Tuliskan fakta mentah peristiwa nyata di sini...',
      narrativeNonfiction: 'Tuliskan versi nonfiksi naratif dengan teknik sastra...',
      autofiction: 'Tuliskan versi autofiksi dengan nama samaran dan dramaturgi alur...',
      pureFiction: 'Tuliskan versi fiksi murni dengan latar dunia baru...',
      transformationNotes: 'Catatan mengapa alur atau tokoh diubah...',
    });
    setSelectedId(created.id);
  };

  const handleSendToEditor = (content: string, stageTitle: string) => {
    if (!currentTrans) return;
    const scene = addScene({
      title: `${currentTrans.title} (${stageTitle})`,
      content: content,
      summary: `Dihasilkan dari Studio Transformasi Realita → Fiksi (${stageTitle}).`,
      status: 'first_draft',
    });
    setActiveSceneId(scene.id);
    setActiveView('writing_studio');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-semibold mb-1 uppercase">
            <Repeat className="w-3.5 h-3.5" />
            <span>Studio Metamorfosis Sastra</span>
          </div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Realita → Nonfiksi Naratif → Autofiksi → Fiksi Murni
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Eksplorasi bagaimana memori kehidupan nyata dapat bermutasi menjadi berbagai spektrum sastra dengan menjaga kebenaran emosionalnya.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Transformasi Baru</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Transformation Pipelines List */}
        <div className="lg:col-span-4 space-y-3">
          {transformations.map(t => {
            const isSelected = t.id === currentTrans?.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs space-y-1.5 ${
                  isSelected
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/20'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 font-serif-book line-clamp-1">
                    {t.title}
                  </h4>
                  {transformations.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('Hapus transformasi ini?')) deleteTransformation(t.id);
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 font-serif-reading">
                  {t.realEvent}
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-amber-700 dark:text-amber-400">
                  <span>4 Versi Tersedia</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: 4-Stage Studio Matrix */}
        <div className="lg:col-span-8">
          {currentTrans ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-hidden flex flex-col space-y-4 p-6">
              
              {/* Title input */}
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <input
                  type="text"
                  value={currentTrans.title}
                  onChange={e => updateTransformation(currentTrans.id, { title: e.target.value })}
                  className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100 bg-transparent border-none focus:outline-hidden w-full"
                />
                <p className="text-xs text-stone-400 mt-0.5">
                  Bandingkan dan sesuaikan setiap tingkatan penulisan naskah di bawah ini:
                </p>
              </div>

              {/* Stage Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-100 dark:bg-stone-800/60 p-1.5 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab('real')}
                  className={`p-2 rounded-lg font-medium transition text-center ${
                    activeTab === 'real'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  1. Realita Nyata
                </button>
                <button
                  onClick={() => setActiveTab('narrative_nonfiction')}
                  className={`p-2 rounded-lg font-medium transition text-center ${
                    activeTab === 'narrative_nonfiction'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  2. Nonfiksi Naratif
                </button>
                <button
                  onClick={() => setActiveTab('autofiction')}
                  className={`p-2 rounded-lg font-medium transition text-center ${
                    activeTab === 'autofiction'
                      ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  3. Autofiksi
                </button>
                <button
                  onClick={() => setActiveTab('pure_fiction')}
                  className={`p-2 rounded-lg font-medium transition text-center ${
                    activeTab === 'pure_fiction'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  4. Fiksi Murni
                </button>
              </div>

              {/* Stage Editor Area */}
              <div className="space-y-4">
                {activeTab === 'real' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Level 1: Fakta Mentah Dunia Nyata (Realita)
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">100% Kejadian Asli</span>
                    </div>
                    <textarea
                      value={currentTrans.realEvent}
                      onChange={e => updateTransformation(currentTrans.id, { realEvent: e.target.value })}
                      rows={8}
                      className="w-full p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-serif-reading leading-relaxed focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {activeTab === 'narrative_nonfiction' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Level 2: Nonfiksi Naratif / Memoar Sastra
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">Fakta Terjaga + Gaya Sastra</span>
                    </div>
                    <textarea
                      value={currentTrans.narrativeNonfiction}
                      onChange={e => updateTransformation(currentTrans.id, { narrativeNonfiction: e.target.value })}
                      rows={8}
                      className="w-full p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-serif-reading leading-relaxed focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {activeTab === 'autofiction' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        Level 3: Autofiksi (Dramatisasi & Perlindungan Privasi)
                      </span>
                      <span className="text-[11px] font-mono text-amber-600">Nama Disamarkan + Rekonstruksi Alur</span>
                    </div>
                    <textarea
                      value={currentTrans.autofiction}
                      onChange={e => updateTransformation(currentTrans.id, { autofiction: e.target.value })}
                      rows={8}
                      className="w-full p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-serif-reading leading-relaxed focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {activeTab === 'pure_fiction' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Level 4: Fiksi Murni
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">Dunia Baru + Esensi Emosional Sama</span>
                    </div>
                    <textarea
                      value={currentTrans.pureFiction}
                      onChange={e => updateTransformation(currentTrans.id, { pureFiction: e.target.value })}
                      rows={8}
                      className="w-full p-4 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-serif-reading leading-relaxed focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Transformation Notes */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Catatan Transformasi / Alasan Pengubahan:
                  </label>
                  <textarea
                    value={currentTrans.transformationNotes || ''}
                    onChange={e => updateTransformation(currentTrans.id, { transformationNotes: e.target.value })}
                    rows={2}
                    placeholder="Mengapa nama tokoh diubah? Bagian mana yang dipadatkan demi tensi cerita?"
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-serif-reading focus:outline-hidden"
                  />
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    Puas dengan versi ini? Bawa langsung ke naskah utama.
                  </span>

                  <button
                    onClick={() => {
                      const textToPush =
                        activeTab === 'real'
                          ? currentTrans.realEvent
                          : activeTab === 'narrative_nonfiction'
                          ? currentTrans.narrativeNonfiction
                          : activeTab === 'autofiction'
                          ? currentTrans.autofiction
                          : currentTrans.pureFiction;
                      const label =
                        activeTab === 'real'
                          ? 'Realita Nyata'
                          : activeTab === 'narrative_nonfiction'
                          ? 'Nonfiksi Naratif'
                          : activeTab === 'autofiction'
                          ? 'Autofiksi'
                          : 'Fiksi Murni';
                      handleSendToEditor(textToPush, label);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>Jadikan Adegan di Editor Naskah</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
