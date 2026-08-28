import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  User,
  Save,
  CheckCircle2,
  Feather,
  Coffee,
  Sparkles,
  Heart,
} from 'lucide-react';

export const AuthorProfileView: React.FC = () => {
  const { currentBook, updateBook } = useStoryOS();

  const [authorName, setAuthorName] = useState(currentBook.author || 'Penulis');
  const [penName, setPenName] = useState('A. R. Danu');
  const [artisticManifesto, setArtisticManifesto] = useState(
    'Saya menulis bukan untuk menghibur dunia dengan ilusi sempurna, melainkan untuk membongkar kerentanan manusia dan mengabadikan apa yang luput dari ingatan orang banyak.'
  );
  const [writingRitual, setWritingRitual] = useState(
    'Menulis setiap subuh pukul 05.00 - 07.00 di meja kayu dekat jendela. Satu cangkir kopi hitam tanpa gula, musik instrumental tanpa lirik, dan ponsel berada di luar ruangan.'
  );
  const [favoriteAuthors, setFavoriteAuthors] = useState(
    'Pramoedya Ananta Toer, Haruki Murakami, Annie Ernaux, Gabriel García Márquez.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateBook(currentBook.id, {
      author: authorName,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Profil Penulis & Manifestasi Kreatif
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dokumentasikan identitas kepenulisan, manifesto artistik, serta ritual dan etos kerja menulismu.
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
              <span>Simpan Profil</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white text-4xl font-serif-book shadow-lg font-bold">
            {authorName.charAt(0)}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
              {authorName}
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-mono">
              Nama Pena: {penName}
            </p>
          </div>

          <div className="w-full pt-4 border-t border-stone-100 dark:border-stone-800 text-left space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nama Lengkap / Hak Cipta
              </label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nama Pena (Pseudonym)
              </label>
              <input
                type="text"
                value={penName}
                onChange={e => setPenName(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-book"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Creative Depth & Rituals */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Feather className="w-4 h-4 text-amber-600" />
              <label className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
                Manifesto Artistik & Alasan Menulis
              </label>
            </div>
            <p className="text-xs text-stone-400 mb-2">
              Apa dorongan batin terdalam yang membuatmu harus melahirkan naskah ini?
            </p>
            <textarea
              value={artisticManifesto}
              onChange={e => setArtisticManifesto(e.target.value)}
              rows={4}
              className="w-full text-xs sm:text-sm p-3.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-1.5">
              <Coffee className="w-4 h-4 text-amber-600" />
              <label className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
                Ritual & Kebiasaan Menulis
              </label>
            </div>
            <p className="text-xs text-stone-400 mb-2">
              Kondisi ideal lingkungan, waktu, dan kebiasaan yang memicu flow state terbaikmu.
            </p>
            <textarea
              value={writingRitual}
              onChange={e => setWritingRitual(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm p-3.5 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-1.5">
              <Heart className="w-4 h-4 text-amber-600" />
              <label className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
                Pengaruh & Inspirasi Sastra Utama
              </label>
            </div>
            <input
              type="text"
              value={favoriteAuthors}
              onChange={e => setFavoriteAuthors(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 bg-stone-50 dark:bg-stone-800 border rounded-xl font-serif-reading"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
