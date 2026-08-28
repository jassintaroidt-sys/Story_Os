import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  BookMarked,
  Save,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { StyleGuide } from '../types';

export const BookBibleView: React.FC = () => {
  const { currentBook, updateBook } = useStoryOS();

  const [styleGuide, setStyleGuide] = useState<StyleGuide>(
    currentBook.styleGuide || {
      pointOfView: 'Orang Pertama ("Aku") - Intim & Subjektif',
      tense: 'Campuran (Masa Lalu untuk narasi, Masa Kini untuk refleksi batin)',
      toneOfVoice: 'Liris, reflektif, jujur tanpa pretensi, dengan sentuhan nostalgia yang hangat namun getir.',
      puebiRules: [
        'Dialog menggunakan tanda petik dua ("...").',
        'Istilah bahasa daerah (Jawa/Sunda) atau serapan asing dicetak miring (italic).',
        'Gunakan tanda pisah em-dash (—) tanpa spasi untuk jeda pikiran yang terputus.',
      ],
      glossary: [
        { term: 'Weton', definition: 'Hari kelahiran dalam penanggalan Jawa yang memengaruhi nasib dan jodoh.' },
        { term: 'Merantau', definition: 'Perjalanan meninggalkan kampung halaman untuk mencari penghidupan atau jati diri.' },
      ],
    }
  );

  const [newGlossTerm, setNewGlossTerm] = useState('');
  const [newGlossDef, setNewGlossDef] = useState('');
  const [newRule, setNewRule] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateBook(currentBook.id, { styleGuide });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddGlossary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGlossTerm.trim()) return;
    setStyleGuide({
      ...styleGuide,
      glossary: [...styleGuide.glossary, { term: newGlossTerm, definition: newGlossDef }],
    });
    setNewGlossTerm('');
    setNewGlossDef('');
  };

  const handleRemoveGlossary = (idx: number) => {
    setStyleGuide({
      ...styleGuide,
      glossary: styleGuide.glossary.filter((_, i) => i !== idx),
    });
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;
    setStyleGuide({
      ...styleGuide,
      puebiRules: [...styleGuide.puebiRules, newRule],
    });
    setNewRule('');
  };

  const handleRemoveRule = (idx: number) => {
    setStyleGuide({
      ...styleGuide,
      puebiRules: styleGuide.puebiRules.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Kitab Naskah (Book Bible) & Panduan Gaya Penulisan
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Jaga konsistensi sudut pandang (POV), nada suara naratif, glosarium istilah khas, dan standar tata bahasa/PUEBI.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Voice, POV, Tense */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Sudut Pandang (POV) & Kala Cerita (Tense)
            </h3>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Sudut Pandang Utama (Point of View)
              </label>
              <input
                type="text"
                value={styleGuide.pointOfView}
                onChange={e => setStyleGuide({ ...styleGuide, pointOfView: e.target.value })}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Kala Waktu Narasi (Narrative Tense)
              </label>
              <input
                type="text"
                value={styleGuide.tense}
                onChange={e => setStyleGuide({ ...styleGuide, tense: e.target.value })}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nada Suara & Gaya Bahasa (Tone of Voice)
              </label>
              <textarea
                value={styleGuide.toneOfVoice}
                onChange={e => setStyleGuide({ ...styleGuide, toneOfVoice: e.target.value })}
                rows={4}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading leading-relaxed"
              />
            </div>
          </div>

          {/* PUEBI & Rules */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Konvensi Tipografi & Ejaan (PUEBI)
            </h3>

            <div className="space-y-2">
              {styleGuide.puebiRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs font-serif-reading"
                >
                  <span>• {rule}</span>
                  <button
                    onClick={() => handleRemoveRule(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRule} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newRule}
                onChange={e => setNewRule(e.target.value)}
                placeholder="Tambah aturan format naskah..."
                className="flex-1 text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-amber-600 hover:text-white rounded-xl text-xs font-medium transition"
              >
                + Tambah
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Glossary of Terms */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100 mb-1">
              Glosarium & Kamus Istilah Khas Cerita
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Daftar istilah lokal, dialek daerah, atau panggilan khas antar tokoh untuk menjaga kepatuhan ejaan.
            </p>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {styleGuide.glossary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/50 dark:border-stone-700/50 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400 font-mono">
                      {item.term}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading mt-0.5">
                      {item.definition}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveGlossary(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddGlossary} className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Tambah Istilah Baru:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newGlossTerm}
                onChange={e => setNewGlossTerm(e.target.value)}
                placeholder="Kata / Istilah"
                className="text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-xl font-mono"
                required
              />
              <input
                type="text"
                value={newGlossDef}
                onChange={e => setNewGlossDef(e.target.value)}
                placeholder="Makna / Konteks"
                className="text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-xl sm:col-span-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-amber-600 hover:text-white rounded-xl text-xs font-medium transition"
            >
              + Masukkan ke Glosarium
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
