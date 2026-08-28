import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  Users,
  BrainCircuit,
  CheckCircle2,
} from 'lucide-react';

export const TrashView: React.FC = () => {
  const [trashedItems, setTrashedItems] = useState<Array<{ id: string; title: string; type: string; deletedAt: string }>>([
    { id: 't1', title: 'Adegan Awal di Pasar Malam (Draf Kasar)', type: 'Adegan', deletedAt: '2 hari lalu' },
    { id: 't2', title: 'Paman Broto (Versi Lama yang terlalu antagonistik)', type: 'Tokoh', deletedAt: '5 hari lalu' },
    { id: 't3', title: 'Percakapan di Warung Soto', type: 'Catatan Ide', deletedAt: '1 minggu lalu' },
  ]);

  const [notice, setNotice] = useState<string | null>(null);

  const handleRestore = (id: string, title: string) => {
    setTrashedItems(trashedItems.filter(item => item.id !== id));
    setNotice(`✓ "${title}" berhasil dikembalikan!`);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Kosongkan semua item di tempat sampah secara permanen?')) {
      setTrashedItems([]);
      setNotice('✓ Tempat sampah telah dikosongkan.');
      setTimeout(() => setNotice(null), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Tempat Sampah & Pemulihan Data
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap adegan, tokoh, atau draf yang kamu hapus disimpan di sini sebelum dihapus permanen. Jangan takut bereksperimen.
          </p>
        </div>

        {trashedItems.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Tempat Sampah</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 text-xs font-medium">
          {notice}
        </div>
      )}

      {/* Trashed list */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
        {trashedItems.length === 0 ? (
          <div className="text-center py-12 text-stone-400 space-y-2">
            <Trash2 className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-sm font-serif-book">Tempat sampah bersih dan kosong.</p>
            <p className="text-xs">Tidak ada naskah atau tokoh yang terbuang.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trashedItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 text-xs">
                    {item.type === 'Adegan' ? <FileText className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif-book text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-mono text-stone-400">
                      Kategori: {item.type} • Dihapus: {item.deletedAt}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRestore(item.id, item.title)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-200 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-600 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pulihkan</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
