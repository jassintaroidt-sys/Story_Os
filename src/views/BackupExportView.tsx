import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Download,
  Upload,
  FileCode,
  FileText,
  FileDown,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const BackupExportView: React.FC = () => {
  const {
    currentBook,
    exportManuscriptMarkdown,
    exportManuscriptText,
    exportFullProjectJSON,
    importFullProjectJSON,
    resetToInitialData,
  } = useStoryOS();

  const [importJsonText, setImportJsonText] = useState('');
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const md = exportManuscriptMarkdown();
    const safeTitle = (currentBook?.title || 'manuskrip').replace(/\s+/g, '_').toLowerCase();
    downloadFile(md, `${safeTitle}_manuskrip.md`, 'text/markdown');
  };

  const handleExportText = () => {
    const txt = exportManuscriptText();
    const safeTitle = (currentBook?.title || 'manuskrip').replace(/\s+/g, '_').toLowerCase();
    downloadFile(txt, `${safeTitle}_naskah.txt`, 'text/plain');
  };

  const handleExportJSON = () => {
    const json = exportFullProjectJSON();
    downloadFile(json, `story_os_backup_${Date.now()}.json`, 'application/json');
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) return;
    const ok = importFullProjectJSON(importJsonText);
    if (ok) {
      setImportNotice('✓ Data proyek berhasil dipulihkan!');
      setImportJsonText('');
      setTimeout(() => setImportNotice(null), 3000);
    } else {
      setImportNotice('✗ Gagal memulihkan: Format JSON tidak valid.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Yakin ingin mereset data ke contoh awal? Semua perubahan tersimpan lokal akan digantikan.')) {
      resetToInitialData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-semibold uppercase mb-1">
          <Database className="w-4 h-4" />
          <span>Keamanan Data & Ekspor Naskah</span>
        </div>
        <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
          Ekspor Naskah Lengkap & Backup Cadangan
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Unduh naskah utuh dalam berbagai format atau simpan seluruh database Story OS ke file JSON untuk cadangan bebas khawatir.
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <FileDown className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Format Markdown (.md)
            </h3>
            <p className="text-xs text-stone-500 font-serif-reading">
              Format terstruktur dengan heading bab, garis batas, dan metadata yang siap diolah di aplikasi lain seperti Obsidian atau Scrivener.
            </p>
          </div>
          <button
            onClick={handleExportMarkdown}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Markdown</span>
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Format Teks Murni (.txt)
            </h3>
            <p className="text-xs text-stone-500 font-serif-reading">
              Naskah bersih tanpa simbol formatting rumit, ideal untuk dibaca seketika di peranti apa pun atau dicopy-paste ke dokumen Word.
            </p>
          </div>
          <button
            onClick={handleExportText}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Plain Text</span>
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Backup Lengkap (.json)
            </h3>
            <p className="text-xs text-stone-500 font-serif-reading">
              Mencakup semua buku, bab, adegan, database tokoh, riset, timeline, worldbuilding, dan ide dalam 1 file cadangan utuh.
            </p>
          </div>
          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan JSON</span>
          </button>
        </div>
      </div>

      {/* Restore Section */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-600" />
          <span>Pulihkan Proyek dari Cadangan JSON</span>
        </h3>
        <p className="text-xs text-stone-500 font-serif-reading">
          Tempel isi file backup JSON yang pernah kamu unduh sebelumnya untuk mengembalikan seluruh ekosistem naskah.
        </p>

        <textarea
          value={importJsonText}
          onChange={e => setImportJsonText(e.target.value)}
          rows={4}
          placeholder="Paste isi data JSON cadangan di sini..."
          className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-mono"
        />

        {importNotice && (
          <p className="text-xs font-medium text-amber-600">{importNotice}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleResetData}
            className="text-xs text-rose-600 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Naskah Contoh Asli</span>
          </button>

          <button
            onClick={handleImportJSON}
            disabled={!importJsonText.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition"
          >
            Pulihkan Database Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
