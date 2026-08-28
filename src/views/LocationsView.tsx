import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  MapPin,
  Plus,
  Search,
  Compass,
  Edit2,
  Trash2,
  X,
  Eye,
  Wind,
  Sun,
  Volume2,
} from 'lucide-react';
import { Location } from '../types';

export const LocationsView: React.FC = () => {
  const {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    scenes,
    setActiveSceneId,
    setActiveView,
  } = useStoryOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocId, setSelectedLocId] = useState<string | null>(locations[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Partial<Location> | null>(null);

  const activeLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  const filteredLocations = locations.filter(l => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.type?.toLowerCase().includes(q) ||
      l.atmosphere?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q)
    );
  });

  const openCreateModal = () => {
    setEditingLoc({
      name: '',
      type: 'Ruangan / Rumah',
      description: '',
      atmosphere: '',
      sensorySmell: '',
      sensorySound: '',
      sensoryLight: '',
      emotionalSignificance: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (loc: Location) => {
    setEditingLoc(loc);
    setIsModalOpen(true);
  };

  const handleSaveLoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoc || !editingLoc.name?.trim()) return;

    if (editingLoc.id) {
      updateLocation(editingLoc.id, editingLoc);
    } else {
      const created = addLocation(editingLoc);
      setSelectedLocId(created.id);
    }
    setIsModalOpen(false);
    setEditingLoc(null);
  };

  const linkedScenes = scenes.filter(s => s.locationId === activeLoc?.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Database Lokasi & Ruang Latar
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Latar bukan sekadar tempat, melainkan pemicu memori, atmosfer sensorik, dan wadah konflik.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lokasi Baru</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-2 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari lokasi berdasarkan nama, suasana, atau deskripsi..."
          className="w-full bg-transparent border-none focus:outline-hidden text-stone-900 dark:text-stone-100"
        />
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Locations List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredLocations.length === 0 ? (
            <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-400">
              Tidak ada lokasi yang ditemukan.
            </div>
          ) : (
            filteredLocations.map(loc => {
              const isSelected = loc.id === activeLoc?.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocId(loc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate font-serif-book">
                        {loc.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {loc.type || 'Latar'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-1">
                      {loc.atmosphere || loc.description || 'Belum ada catatan suasana'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Location Details & Sensory Mapping */}
        <div className="lg:col-span-7">
          {activeLoc ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-6 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                      {activeLoc.type || 'Latar'}
                    </span>
                    {activeLoc.realCounterpart && (
                      <span className="text-xs text-stone-400 font-mono">
                        Dunia Nyata: {activeLoc.realCounterpart}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
                    {activeLoc.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(activeLoc)}
                    className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Edit Lokasi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {locations.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus lokasi "${activeLoc.name}"?`)) {
                          deleteLocation(activeLoc.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Hapus Lokasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Atmosphere & Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">
                  Deskripsi & Nuansa Ruang
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif-reading">
                  {activeLoc.description || 'Belum ada deskripsi mendalam.'}
                </p>
                {activeLoc.atmosphere && (
                  <p className="text-xs text-amber-800 dark:text-amber-300 italic font-serif-reading bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/40">
                    Atmosfer: "{activeLoc.atmosphere}"
                  </p>
                )}
              </div>

              {/* Sensory Details (Bau, Suara, Cahaya) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">
                  Detail Sensorik (Show Don't Tell)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                    <div className="flex items-center gap-1.5 text-stone-500 mb-1 text-xs font-semibold">
                      <Wind className="w-3.5 h-3.5 text-blue-500" />
                      <span>Aroma / Bau</span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeLoc.sensorySmell || 'Belum ada'}
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                    <div className="flex items-center gap-1.5 text-stone-500 mb-1 text-xs font-semibold">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Suara Latar</span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeLoc.sensorySound || 'Belum ada'}
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                    <div className="flex items-center gap-1.5 text-stone-500 mb-1 text-xs font-semibold">
                      <Sun className="w-3.5 h-3.5 text-orange-500" />
                      <span>Pencahayaan</span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeLoc.sensoryLight || 'Belum ada'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emotional Significance */}
              {activeLoc.emotionalSignificance && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400 mb-1">
                    Makna Emosional bagi Tokoh Utama
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-serif-reading bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl">
                    {activeLoc.emotionalSignificance}
                  </p>
                </div>
              )}

              {/* Linked Scenes */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-400">
                  Adegan yang Terjadi di Sini ({linkedScenes.length})
                </h4>
                {linkedScenes.length === 0 ? (
                  <div className="text-xs text-stone-400 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-xl">
                    Belum ada adegan yang ditautkan ke lokasi ini. Kamu bisa memilih lokasi ini pada tab detail adegan di Studio Menulis.
                  </div>
                ) : (
                  linkedScenes.map(sc => (
                    <div
                      key={sc.id}
                      onClick={() => {
                        setActiveSceneId(sc.id);
                        setActiveView('writing_studio');
                      }}
                      className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 flex items-center justify-between hover:bg-amber-50/50 cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                        {sc.title}
                      </span>
                      <span className="text-[10px] font-mono text-amber-600">Buka di Editor →</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && editingLoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base font-serif-book">
                {editingLoc.id ? 'Edit Data Lokasi' : 'Tambah Lokasi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLoc} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Nama Tempat / Lokasi *</label>
                  <input
                    type="text"
                    value={editingLoc.name || ''}
                    onChange={e => setEditingLoc({ ...editingLoc, name: e.target.value })}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Kategori / Tipe</label>
                  <input
                    type="text"
                    value={editingLoc.type || ''}
                    onChange={e => setEditingLoc({ ...editingLoc, type: e.target.value })}
                    placeholder="Mis: Kedai Kopi, Rumah Tua, Pantai"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Padanan Dunia Nyata (Autofiksi)</label>
                <input
                  type="text"
                  value={editingLoc.realCounterpart || ''}
                  onChange={e => setEditingLoc({ ...editingLoc, realCounterpart: e.target.value })}
                  placeholder="Nama asli tempat jika dalam novel disamarkan"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deskripsi Fisik</label>
                <textarea
                  value={editingLoc.description || ''}
                  onChange={e => setEditingLoc({ ...editingLoc, description: e.target.value })}
                  rows={2}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Atmosfer & Suasana</label>
                <input
                  type="text"
                  value={editingLoc.atmosphere || ''}
                  onChange={e => setEditingLoc({ ...editingLoc, atmosphere: e.target.value })}
                  placeholder="Mis: Remang-remang dengan aroma tembakau dan kopi tubruk"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Aroma / Bau</label>
                  <input
                    type="text"
                    value={editingLoc.sensorySmell || ''}
                    onChange={e => setEditingLoc({ ...editingLoc, sensorySmell: e.target.value })}
                    className="w-full text-xs p-1.5 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Suara Latar</label>
                  <input
                    type="text"
                    value={editingLoc.sensorySound || ''}
                    onChange={e => setEditingLoc({ ...editingLoc, sensorySound: e.target.value })}
                    className="w-full text-xs p-1.5 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Pencahayaan</label>
                  <input
                    type="text"
                    value={editingLoc.sensoryLight || ''}
                    onChange={e => setEditingLoc({ ...editingLoc, sensoryLight: e.target.value })}
                    className="w-full text-xs p-1.5 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Makna Emosional Tokoh</label>
                <textarea
                  value={editingLoc.emotionalSignificance || ''}
                  onChange={e => setEditingLoc({ ...editingLoc, emotionalSignificance: e.target.value })}
                  rows={2}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                >
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
