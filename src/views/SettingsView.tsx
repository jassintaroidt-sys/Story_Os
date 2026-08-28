import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Settings,
  Moon,
  Sun,
  Type,
  Volume2,
  Save,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useStoryOS();

  const [editorFont, setEditorFont] = useState('Lora (Sastra Klasik)');
  const [editorFontSize, setEditorFontSize] = useState('16px');
  const [editorLineHeight, setEditorLineHeight] = useState('1.8 (Sangat Lapang)');
  const [autosaveInterval, setAutosaveInterval] = useState('Real-time (Debounce 800ms)');
  const [typewriterScroll, setTypewriterScroll] = useState(true);
  const [spellcheck, setSpellcheck] = useState(true);
  const [ambientSounds, setAmbientSounds] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Pengaturan Aplikasi & Preferensi Menulis
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Sesuaikan kenyamanan ruang kerja, tipografi studio, perilaku editor, dan mekanisme penyimpanan.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          {savedNotice ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Terapkan Pengaturan</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Editor Aesthetics */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-600" />
            <span>Tipografi Studio Menulis</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Keluarga Font Naskah (Font Family)
            </label>
            <select
              value={editorFont}
              onChange={e => setEditorFont(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
            >
              <option value="Lora (Sastra Klasik)">Lora (Serif Sastra Indonesia & Terjemahan)</option>
              <option value="Cinzel (Novel Epik / Elegan)">Cinzel & Playfair Display (Elegan & Klasik)</option>
              <option value="Inter (Modern Minimalis)">Inter (Modern Sans-Serif)</option>
              <option value="JetBrains Mono (Mesin Tik)">JetBrains Mono (Monospace Mesin Tik)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Ukuran Huruf Teks
              </label>
              <select
                value={editorFontSize}
                onChange={e => setEditorFontSize(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              >
                <option value="14px">14px (Kompak)</option>
                <option value="16px">16px (Standar Nyaman)</option>
                <option value="18px">18px (Lapang & Jelas)</option>
                <option value="20px">20px (Besar / Ramah Mata)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Jarak Antar Baris (Line Height)
              </label>
              <select
                value={editorLineHeight}
                onChange={e => setEditorLineHeight(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              >
                <option value="1.5">1.5 (Rapat)</option>
                <option value="1.8 (Sangat Lapang)">1.8 (Standar Buku Bacaan)</option>
                <option value="2.0 (Double Spacing)">2.0 (Spasi Ganda untuk Koreksi Editor)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/50 dark:border-stone-700/50 space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
              Pratinjau Tipografi
            </span>
            <p className="text-sm font-serif-reading leading-relaxed italic text-stone-800 dark:text-stone-200">
              "Kereta senja itu membunyikan peluit panjang, mengiris kabut yang menggantung di stasiun tua. Tak ada pelukan perpisahan, hanya tatapan hening yang memahami bahwa segalanya telah berubah."
            </p>
          </div>
        </div>

        {/* Behavior & Theme */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Perilaku & Mekanisme Kerja</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Tema Tampilan Ruang Kerja
              </h4>
              <p className="text-[11px] text-stone-500">
                Saat ini: <span className="font-semibold capitalize">{theme}</span>
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>Ganti Mode</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Typewriter Scrolling (Fokus Baris Aktif)
              </h4>
              <p className="text-[11px] text-stone-500">
                Menjaga baris yang sedang diketik tetap berada di tengah layar mata.
              </p>
            </div>
            <input
              type="checkbox"
              checked={typewriterScroll}
              onChange={e => setTypewriterScroll(e.target.checked)}
              className="rounded text-amber-600"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Pemeriksaan Ejaan & Garis Bawah
              </h4>
              <p className="text-[11px] text-stone-500">
                Aktifkan koreksi otomatis bawaan peramban (browser spellchecker).
              </p>
            </div>
            <input
              type="checkbox"
              checked={spellcheck}
              onChange={e => setSpellcheck(e.target.checked)}
              className="rounded text-amber-600"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Suasana Audio Ambient (Hujan & Kafe)
              </h4>
              <p className="text-[11px] text-stone-500">
                Kondisi latar bebas distraksi untuk memicu konsentrasi mendalam.
              </p>
            </div>
            <input
              type="checkbox"
              checked={ambientSounds}
              onChange={e => setAmbientSounds(e.target.checked)}
              className="rounded text-amber-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
