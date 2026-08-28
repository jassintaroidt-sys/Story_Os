import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Send,
  BookOpen,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Copy,
  Layers,
} from 'lucide-react';
import { Book } from '../types';

export const PublishingCenterView: React.FC = () => {
  const { currentBook, updateBook } = useStoryOS();

  const [activeTab, setActiveTab] = useState<'matter' | 'synopsis' | 'query'>('synopsis');

  // Book metadata & matter
  const [synopsisShort, setSynopsisShort] = useState(
    currentBook.synopsis ||
      'Sebuah eksplorasi intim tentang perantau yang kembali ke kampung halaman untuk merekonsiliasi masa lalu dan membedah rahasia keluarganya.'
  );
  const [synopsisFull, setSynopsisFull] = useState(
    'Rangkuman lengkap 1-2 halaman mencakup seluruh awal, konflik tengah, krisis puncak, hingga resolusi akhir cerita (termasuk spoiler) yang dibutuhkan oleh editor penerbit mayor.'
  );
  const [dedication, setDedication] = useState(
    'Untuk Ibu, yang selalu menunggu kepulangan tanpa pernah bertanya mengapa.'
  );
  const [epigraph, setEpigraph] = useState(
    '"Rumah bukanlah tempat yang kita tinggalkan, melainkan tempat yang kita bawa ke mana pun kita pergi." — Anonim'
  );
  const [authorBio, setAuthorBio] = useState(
    'Penulis naskah fiksi dan memoar yang mengeksplorasi tema memori, kerentanan manusia, dan identitas kultural.'
  );
  const [queryLetter, setQueryLetter] = useState(
    `Kepada Yth. Tim Redaksi / Editor Penerbit,

Dengan hormat,

Saya bermaksud mengajukan naskah novel/autofiksi berjudul "${currentBook.title}" (estimasi ~${currentBook.targetWordCount || 50000} kata).

Naskah ini mengeksplorasi pergulatan emosional perantau yang menolak melupakan akar kehidupannya. Cerita ini akan beresonansi dengan pembaca karya-karya sastra kontemporer yang menyukai eksplorasi batin yang jujur.

Terlampir sinopsis lengkap dan sampel 3 bab awal untuk dipertimbangkan. Terima kasih atas waktu dan perhatiannya.

Hormat saya,
${currentBook.author || 'Penulis'}`
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copyNotice, setCopyNotice] = useState(false);

  const handleSave = () => {
    updateBook(currentBook.id, {
      synopsis: synopsisShort,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(queryLetter);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Pusat Penerbitan & Front/Back Matter
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Persiapkan kelengkapan formal buku: sinopsis uji penerbit, query letter, persembahan (dedication), epigraph, dan profil penulis.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Dokumen</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs max-w-md">
        <button
          onClick={() => setActiveTab('synopsis')}
          className={`flex-1 py-2 rounded-lg font-medium transition text-center ${
            activeTab === 'synopsis'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
              : 'text-stone-500'
          }`}
        >
          Sinopsis Naskah
        </button>
        <button
          onClick={() => setActiveTab('matter')}
          className={`flex-1 py-2 rounded-lg font-medium transition text-center ${
            activeTab === 'matter'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
              : 'text-stone-500'
          }`}
        >
          Front & Back Matter
        </button>
        <button
          onClick={() => setActiveTab('query')}
          className={`flex-1 py-2 rounded-lg font-medium transition text-center ${
            activeTab === 'query'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
              : 'text-stone-500'
          }`}
        >
          Surat Pengajuan (Query)
        </button>
      </div>

      {/* Tab 1: Synopsis */}
      {activeTab === 'synopsis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-3">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Sinopsis Pendek (Elevator Pitch / Blurb Belakang Buku)
            </h3>
            <p className="text-xs text-stone-500">
              1-2 paragraf padat untuk menggugah rasa penasaran calon pembaca atau editor dalam 30 detik pertama.
            </p>
            <textarea
              value={synopsisShort}
              onChange={e => setSynopsisShort(e.target.value)}
              rows={6}
              className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading leading-relaxed"
            />
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-3">
            <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Sinopsis Lengkap (Untuk Editor Penerbit / Lomba)
            </h3>
            <p className="text-xs text-stone-500">
              Rinci dari awal, titik balik, hingga resolusi akhir cerita (editor butuh mengetahui ending secara gamblang).
            </p>
            <textarea
              value={synopsisFull}
              onChange={e => setSynopsisFull(e.target.value)}
              rows={6}
              className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Front & Back Matter */}
      {activeTab === 'matter' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-6">
          <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Halaman Awal & Akhir Buku (Front & Back Matter)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Halaman Persembahan (Dedication)
              </label>
              <textarea
                value={dedication}
                onChange={e => setDedication(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading italic"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Epigraph (Kutipan Pembuka Babak)
              </label>
              <textarea
                value={epigraph}
                onChange={e => setEpigraph(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading italic"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Tentang Penulis (Author Biography)
            </label>
            <textarea
              value={authorBio}
              onChange={e => setAuthorBio(e.target.value)}
              rows={4}
              className="w-full text-xs p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Query Letter */}
      {activeTab === 'query' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif-book text-stone-900 dark:text-stone-100">
                Surat Pengajuan Naskah ke Penerbit (Query Letter)
              </h3>
              <p className="text-xs text-stone-500">
                Gunakan template formal ini saat mengirim surel atau proposal naskah ke penerbit mayor ataupun indie.
              </p>
            </div>
            <button
              onClick={handleCopyQuery}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-amber-600 hover:text-white rounded-lg text-xs font-medium transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copyNotice ? 'Tersalin!' : 'Salin Surat'}</span>
            </button>
          </div>

          <textarea
            value={queryLetter}
            onChange={e => setQueryLetter(e.target.value)}
            rows={12}
            className="w-full text-xs p-4 bg-stone-50 dark:bg-stone-800 border rounded-xl font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
