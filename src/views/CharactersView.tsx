import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Users,
  UserPlus,
  Search,
  Sparkles,
  Heart,
  ShieldAlert,
  Trash2,
  Edit2,
  X,
  Plus,
  ArrowRight,
  Eye,
  Link2,
} from 'lucide-react';
import { Character, CharacterRole, CharacterType } from '../types';

export const CharactersView: React.FC = () => {
  const {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    characterRelationships,
    addCharacterRelationship,
    deleteCharacterRelationship,
  } = useStoryOS();

  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(characters[0]?.id || null);

  // Edit / Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<Partial<Character> | null>(null);

  // Relationship modal state
  const [isRelModalOpen, setIsRelModalOpen] = useState(false);
  const [relTargetId, setRelTargetId] = useState('');
  const [relType, setRelType] = useState('Sahabat');
  const [relTension, setRelTension] = useState('Harmonis');
  const [relNotes, setRelNotes] = useState('');

  const activeChar = characters.find(c => c.id === selectedCharId) || characters[0];

  const filteredCharacters = characters.filter(c => {
    if (selectedRole !== 'all' && c.role !== selectedRole) return false;
    if (selectedType !== 'all' && c.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.pseudonym?.toLowerCase().includes(q) ||
        c.occupation?.toLowerCase().includes(q) ||
        c.personality?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingChar({
      name: '',
      role: 'supporting',
      type: 'fictional',
      occupation: '',
      want: '',
      need: '',
      wound: '',
      lieBelieved: '',
      characterArc: '',
      physicalAppearance: '',
      personality: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (char: Character) => {
    setEditingChar(char);
    setIsModalOpen(true);
  };

  const handleSaveChar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChar || !editingChar.name?.trim()) return;

    if (editingChar.id) {
      updateCharacter(editingChar.id, editingChar);
    } else {
      const created = addCharacter(editingChar);
      setSelectedCharId(created.id);
    }
    setIsModalOpen(false);
    setEditingChar(null);
  };

  const handleAddRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChar || !relTargetId) return;

    addCharacterRelationship({
      characterId1: activeChar.id,
      characterId2: relTargetId,
      relationshipType: relType,
      tensionLevel: relTension,
      notes: relNotes,
    });

    setIsRelModalOpen(false);
    setRelTargetId('');
    setRelNotes('');
  };

  const activeCharRelationships = characterRelationships.filter(
    r => r.characterId1 === activeChar?.id || r.characterId2 === activeChar?.id
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
            Database Tokoh & Hubungan Karakter
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Petakan tokoh nyata (autofiksi), fiksi murni, atau gabungan. Rinci luka batin, want vs need, dan jaringan relasi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium shadow-2xs transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Tokoh Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama, profesi, watak..."
            className="w-full bg-transparent border-none focus:outline-hidden text-stone-900 dark:text-stone-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="all">Semua Peran</option>
            <option value="protagonist">Protagonis</option>
            <option value="antagonist">Antagonis</option>
            <option value="supporting">Tokoh Pendukung</option>
            <option value="minor">Figuran</option>
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="all">Semua Jenis</option>
            <option value="real_person">Orang Nyata</option>
            <option value="fictional">Tokoh Fiksi</option>
            <option value="composite">Kombinasi Nyata & Fiksi</option>
          </select>
        </div>
      </div>

      {/* Main Split View: Left Character Cards, Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Character Grid / Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCharacters.length === 0 ? (
            <div className="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-400">
              Tidak ada tokoh yang sesuai dengan filter.
            </div>
          ) : (
            filteredCharacters.map(char => {
              const isSelected = char.id === activeChar?.id;
              return (
                <div
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 dark:from-amber-900 dark:to-amber-700 flex items-center justify-center text-amber-950 dark:text-amber-100 font-bold font-serif-book text-base flex-shrink-0">
                    {char.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate font-serif-book">
                        {char.name}
                      </h4>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {char.role}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center gap-2 mb-1.5">
                      <span>{char.type === 'real_person' ? 'Orang Nyata' : char.type === 'composite' ? 'Kombinasi' : 'Fiksi'}</span>
                      {char.occupation && <span>• {char.occupation}</span>}
                    </div>

                    {char.wound && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 italic font-serif-reading">
                        "{char.wound}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Character Deep Inspector */}
        <div className="lg:col-span-7">
          {activeChar ? (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs p-6 space-y-6">
              
              {/* Profile Top Bar */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white font-bold font-serif-book text-2xl shadow-md">
                    {activeChar.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                        {activeChar.role}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        {activeChar.type === 'real_person' ? 'Orang Nyata' : activeChar.type === 'composite' ? 'Kombinasi Realita & Fiksi' : 'Tokoh Fiksi'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
                      {activeChar.name}
                    </h3>
                    {activeChar.pseudonym && (
                      <p className="text-xs text-stone-500 italic font-serif-reading">
                        Nama Samaran / Alias: {activeChar.pseudonym}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(activeChar)}
                    className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Edit Profil Tokoh"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {characters.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus tokoh "${activeChar.name}"?`)) {
                          deleteCharacter(activeChar.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Hapus Tokoh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Psychological Depth (Want, Need, Wound, Lie) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400">
                  Kedalaman Psikologis & Busur Karakter (Arc)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-600 block mb-0.5">
                      Want (Keinginan Luar)
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeChar.want || 'Belum dirumuskan.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 block mb-0.5">
                      Need (Kebutuhan Batin Sejati)
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeChar.need || 'Belum dirumuskan.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-600 block mb-0.5">
                      Luka Batin (Ghost / Wound)
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeChar.wound || 'Belum dirumuskan.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 block mb-0.5">
                      Kebohongan yang Dipercaya (The Lie)
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading">
                      {activeChar.lieBelieved || 'Belum dirumuskan.'}
                    </p>
                  </div>
                </div>

                {activeChar.characterArc && (
                  <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 block mb-1">
                      Perjalanan Transformasi (Character Arc)
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-serif-reading leading-relaxed">
                      {activeChar.characterArc}
                    </p>
                  </div>
                )}
              </div>

              {/* Physical & Personality Traits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                    Ciri Fisik & Penampilan
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed">
                    {activeChar.physicalAppearance || 'Belum diisi.'}
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                    Watak & Kebiasaan Khas
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-serif-reading leading-relaxed">
                    {activeChar.personality || 'Belum diisi.'}
                  </p>
                </div>
              </div>

              {/* Character Relationships Section */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Jejaring Hubungan dengan Tokoh Lain</span>
                  </h4>
                  <button
                    onClick={() => setIsRelModalOpen(true)}
                    className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Hubungkan Tokoh</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {activeCharRelationships.length === 0 ? (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl text-center text-xs text-stone-400">
                      Belum ada relasi terhubung dengan tokoh lain.
                    </div>
                  ) : (
                    activeCharRelationships.map(rel => {
                      const otherId = rel.characterId1 === activeChar.id ? rel.characterId2 : rel.characterId1;
                      const otherChar = characters.find(c => c.id === otherId);
                      return (
                        <div
                          key={rel.id}
                          className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-stone-900 dark:text-stone-100 font-serif-book">
                                {otherChar?.name || 'Tokoh Lain'}
                              </span>
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                                {rel.relationshipType}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                ({rel.tensionLevel})
                              </span>
                            </div>
                            {rel.notes && (
                              <p className="text-[11px] text-stone-500 mt-1 font-serif-reading">
                                {rel.notes}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteCharacterRelationship(rel.id)}
                            className="p-1 text-stone-400 hover:text-rose-600"
                            title="Hapus Relasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
              Pilih salah satu tokoh di sisi kiri untuk melihat profil lengkap.
            </div>
          )}
        </div>
      </div>

      {/* Modal Edit / Create Character */}
      {isModalOpen && editingChar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-bold text-base font-serif-book text-stone-900 dark:text-stone-100">
                {editingChar.id ? 'Edit Profil Tokoh' : 'Tambah Tokoh Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveChar} className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Tokoh dalam Cerita <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingChar.name || ''}
                    onChange={e => setEditingChar({ ...editingChar, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Samaran / Nama Asli (Autofiksi)
                  </label>
                  <input
                    type="text"
                    value={editingChar.pseudonym || ''}
                    onChange={e => setEditingChar({ ...editingChar, pseudonym: e.target.value })}
                    placeholder="Nama asli di dunia nyata jika disamarkan"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Peran Naratif
                  </label>
                  <select
                    value={editingChar.role}
                    onChange={e => setEditingChar({ ...editingChar, role: e.target.value as CharacterRole })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  >
                    <option value="protagonist">Protagonis</option>
                    <option value="antagonist">Antagonis</option>
                    <option value="supporting">Pendukung</option>
                    <option value="minor">Figuran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Jenis Tokoh
                  </label>
                  <select
                    value={editingChar.type}
                    onChange={e => setEditingChar({ ...editingChar, type: e.target.value as CharacterType })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  >
                    <option value="real_person">Orang Nyata</option>
                    <option value="fictional">Tokoh Fiksi</option>
                    <option value="composite">Kombinasi Realita & Fiksi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Profesi / Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={editingChar.occupation || ''}
                    onChange={e => setEditingChar({ ...editingChar, occupation: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Want (Keinginan Luar)
                  </label>
                  <textarea
                    value={editingChar.want || ''}
                    onChange={e => setEditingChar({ ...editingChar, want: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Need (Kebutuhan Batin Sejati)
                  </label>
                  <textarea
                    value={editingChar.need || ''}
                    onChange={e => setEditingChar({ ...editingChar, need: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Luka Batin (Ghost / Wound)
                  </label>
                  <textarea
                    value={editingChar.wound || ''}
                    onChange={e => setEditingChar({ ...editingChar, wound: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Kebohongan yang Dipercaya (The Lie)
                  </label>
                  <textarea
                    value={editingChar.lieBelieved || ''}
                    onChange={e => setEditingChar({ ...editingChar, lieBelieved: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Busur Karakter / Transformasi (Arc)
                </label>
                <textarea
                  value={editingChar.characterArc || ''}
                  onChange={e => setEditingChar({ ...editingChar, characterArc: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs"
                >
                  Simpan Tokoh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Relationship Modal */}
      {isRelModalOpen && activeChar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm font-serif-book">
                Hubungkan {activeChar.name} dengan Tokoh Lain
              </h3>
              <button onClick={() => setIsRelModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelationship} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Pilih Tokoh Lain</label>
                <select
                  value={relTargetId}
                  onChange={e => setRelTargetId(e.target.value)}
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                >
                  <option value="">-- Pilih Tokoh --</option>
                  {characters
                    .filter(c => c.id !== activeChar.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Jenis Hubungan</label>
                  <input
                    type="text"
                    value={relType}
                    onChange={e => setRelType(e.target.value)}
                    placeholder="Misal: Sahabat, Rival"
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tingkat Ketegangan</label>
                  <select
                    value={relTension}
                    onChange={e => setRelTension(e.target.value)}
                    className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  >
                    <option value="Harmonis">Harmonis</option>
                    <option value="Ada Rahasia">Ada Rahasia</option>
                    <option value="Bermusuhan">Bermusuhan</option>
                    <option value="Rivalitas Sehat">Rivalitas Sehat</option>
                    <option value="Romansa Terpendam">Romansa Terpendam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Catatan Dinamika Interaksi</label>
                <textarea
                  value={relNotes}
                  onChange={e => setRelNotes(e.target.value)}
                  rows={2}
                  placeholder="Bagaimana mereka saling memicu emosi saat bertemu?"
                  className="w-full text-xs p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsRelModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!relTargetId}
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
                >
                  Simpan Hubungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
