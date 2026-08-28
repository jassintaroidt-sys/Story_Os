import React, { useState, useMemo } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import { AssetFile } from '../types';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  FileAudio,
  File,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  Link2,
  Download,
  Eye,
  X,
  Check,
  Paperclip,
  HardDrive,
  Tag,
  Calendar,
  User,
  MapPin,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';

export const FileLibraryView: React.FC = () => {
  const {
    assetFiles,
    addAssetFile,
    updateAssetFile,
    deleteAssetFile,
    currentBook,
    characters,
    locations,
    chapters,
    researchItems,
    setActiveView,
    setActiveChapterId,
  } = useStoryOS();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetFile | null>(null);

  // New File Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('image/jpeg');
  const [newCategory, setNewCategory] = useState('Foto & Arsip Keluarga');
  const [newLinkedType, setNewLinkedType] = useState<'character' | 'location' | 'chapter' | 'scene' | 'research' | 'book'>('character');
  const [newLinkedId, setNewLinkedId] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newFileSize, setNewFileSize] = useState<number>(1024 * 500); // 500 KB default
  const [newDataUrl, setNewDataUrl] = useState('');

  // Categories list
  const categories = [
    'Foto & Arsip Keluarga',
    'Peta & Visualisasi Lokasi',
    'Audio & Wawancara Oral',
    'Dokumen Riset & PDF',
    'Sampul & Promosi',
    'Referensi Kostum & Era',
    'Lainnya',
  ];

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assetFiles.filter(asset => {
      const matchSearch =
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.notes && asset.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (asset.tags && asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCat = selectedCategory === 'all' || asset.category === selectedCategory;

      let matchType = true;
      if (selectedType === 'image') matchType = asset.fileType.startsWith('image/');
      else if (selectedType === 'audio') matchType = asset.fileType.startsWith('audio/');
      else if (selectedType === 'pdf') matchType = asset.fileType.includes('pdf');
      else if (selectedType === 'doc') matchType = !asset.fileType.startsWith('image/') && !asset.fileType.startsWith('audio/') && !asset.fileType.includes('pdf');

      return matchSearch && matchCat && matchType;
    });
  }, [assetFiles, searchQuery, selectedCategory, selectedType]);

  // Aggregate stats
  const totalSizeBytes = useMemo(() => {
    return assetFiles.reduce((sum, a) => sum + (a.fileSize || 0), 0);
  }, [assetFiles]);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-amber-500" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-stone-500" />;
  };

  // Resolve Linked Entity Name
  const getLinkedEntityInfo = (type: string, id: string) => {
    if (type === 'character') {
      const char = characters.find(c => c.id === id);
      return { label: char ? `Tokoh: ${char.name}` : 'Tokoh Terkait', icon: <User className="w-3.5 h-3.5" /> };
    }
    if (type === 'location') {
      const loc = locations.find(l => l.id === id);
      return { label: loc ? `Lokasi: ${loc.name}` : 'Lokasi Terkait', icon: <MapPin className="w-3.5 h-3.5" /> };
    }
    if (type === 'chapter') {
      const chap = chapters.find(c => c.id === id);
      return { label: chap ? `Bab ${chap.number}: ${chap.title}` : 'Bab Terkait', icon: <BookOpen className="w-3.5 h-3.5" /> };
    }
    if (type === 'research') {
      const res = researchItems.find(r => r.id === id);
      return { label: res ? `Riset: ${res.topic}` : 'Riset Terkait', icon: <Layers className="w-3.5 h-3.5" /> };
    }
    return { label: 'Buku Utama', icon: <BookOpen className="w-3.5 h-3.5" /> };
  };

  // Handle Create Asset
  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAssetFile({
      title: newTitle.trim(),
      fileName: newFileName.trim() || `${newTitle.toLowerCase().replace(/\s+/g, '_')}.dat`,
      fileType: newFileType,
      fileSize: newFileSize,
      category: newCategory,
      linkedEntityType: newLinkedType,
      linkedEntityId: newLinkedId || currentBook.id,
      notes: newNotes.trim(),
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      dataUrlOrContent: newDataUrl.trim() || undefined,
    });

    // Reset
    setNewTitle('');
    setNewFileName('');
    setNewNotes('');
    setNewTags('');
    setNewDataUrl('');
    setIsAddModalOpen(false);
  };

  // File upload simulation (or real FileReader if chosen)
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFileName(file.name);
      setNewFileType(file.type || 'application/octet-stream');
      setNewFileSize(file.size);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      }

      // Read as Data URL for preview if image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setNewDataUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <HardDrive className="w-4 h-4" />
              <span>Lapisan 3: Sumber, Arsip & Aset</span>
            </div>
            <h1 className="text-2xl font-bold font-serif-book text-stone-900 dark:text-stone-100">
              Library File & Aset — {currentBook.title}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
              Pusat penyimpanan aset visual, audio wawancara, kliping PDF sejarah, dan dokumen pendukung cerita. Hubungkan setiap aset ke Tokoh, Lokasi, Bab, atau Riset Anda.
            </p>
          </div>

          <button
            onClick={() => {
              setNewLinkedId(characters[0]?.id || '');
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah / Tambah Aset Baru</span>
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-stone-100 dark:border-stone-800/80 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl">
            <span className="text-stone-500 block">Total Aset Tersimpan</span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
              {assetFiles.length} file
            </span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl">
            <span className="text-stone-500 block">Total Estimasi Ukuran</span>
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5 block">
              {formatFileSize(totalSizeBytes)}
            </span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl">
            <span className="text-stone-500 block">Aset Gambar & Foto</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">
              {assetFiles.filter(a => a.fileType.startsWith('image/')).length} foto
            </span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl">
            <span className="text-stone-500 block">Audio Rekaman Wawancara</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
              {assetFiles.filter(a => a.fileType.startsWith('audio/')).length} audio
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari nama aset, tag, catatan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Type Filter */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg transition ${selectedType === 'all' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold' : 'text-stone-500'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-2.5 py-1 rounded-lg transition ${selectedType === 'image' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold' : 'text-stone-500'}`}
            >
              Gambar
            </button>
            <button
              onClick={() => setSelectedType('audio')}
              className={`px-2.5 py-1 rounded-lg transition ${selectedType === 'audio' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold' : 'text-stone-500'}`}
            >
              Audio
            </button>
            <button
              onClick={() => setSelectedType('pdf')}
              className={`px-2.5 py-1 rounded-lg transition ${selectedType === 'pdf' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold' : 'text-stone-500'}`}
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-12 text-center">
          <Paperclip className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">Belum ada aset file yang cocok</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Unggah foto referensi, hasil scan arsip koran, atau rekaman suara narasumber untuk memperkuat autentisitas cerita Anda.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition"
          >
            + Tambah Aset Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map(asset => {
            const linkedInfo = getLinkedEntityInfo(asset.linkedEntityType || 'book', asset.linkedEntityId || '');

            return (
              <div
                key={asset.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                {/* Top preview thumbnail if image */}
                {asset.fileType.startsWith('image/') && asset.dataUrlOrContent ? (
                  <div
                    onClick={() => setSelectedAsset(asset)}
                    className="h-36 bg-stone-100 dark:bg-stone-800 relative cursor-pointer overflow-hidden"
                  >
                    <img
                      src={asset.dataUrlOrContent}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Lihat Preview</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedAsset(asset)}
                    className="h-28 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-center cursor-pointer border-b border-stone-100 dark:border-stone-800/60"
                  >
                    <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl shadow-2xs flex items-center gap-3">
                      {getFileIcon(asset.fileType)}
                      <div className="text-left">
                        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block truncate max-w-[160px]">
                          {asset.fileName}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {formatFileSize(asset.fileSize || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-semibold rounded-md">
                        {asset.category || 'Referensi'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {formatFileSize(asset.fileSize || 0)}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedAsset(asset)}
                      className="text-sm font-semibold text-stone-900 dark:text-stone-100 hover:text-amber-600 transition cursor-pointer"
                    >
                      {asset.title}
                    </h3>

                    {asset.notes && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                        {asset.notes}
                      </p>
                    )}

                    {/* Linked Entity Pill */}
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                      <span className="p-1 bg-stone-100 dark:bg-stone-800 rounded text-stone-500">
                        {linkedInfo.icon}
                      </span>
                      <span className="truncate font-medium text-[11px]">{linkedInfo.label}</span>
                    </div>

                    {/* Tags */}
                    {asset.tags && asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="text-stone-600 dark:text-stone-400 hover:text-amber-600 text-xs font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Rincian</span>
                    </button>

                    <button
                      onClick={() => deleteAssetFile(asset.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      title="Hapus aset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add New Asset */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-xl">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Tambah Aset ke Library
                  </h3>
                  <p className="text-xs text-stone-500">Unggah berkas atau simpan referensi aset pendukung cerita</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="p-5 space-y-4 text-xs">
              {/* File Input */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Pilih Berkas dari Komputer (Opsional)
                </label>
                <input
                  type="file"
                  onChange={handleLocalFileChange}
                  className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-100 dark:file:bg-stone-800 file:text-stone-700 dark:file:text-stone-300 hover:file:bg-stone-200 cursor-pointer"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Judul Aset *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Foto Wajah Ayah Tahun 1982"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Kategori Aset
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Tipe Berkas
                  </label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="image/jpeg">Foto / Gambar (JPEG)</option>
                    <option value="image/png">Foto / Gambar (PNG)</option>
                    <option value="audio/mpeg">Audio / Rekaman (MP3)</option>
                    <option value="application/pdf">Dokumen Sejarah (PDF)</option>
                    <option value="text/plain">Catatan Teks (TXT)</option>
                  </select>
                </div>
              </div>

              {/* Linked Entity Type & Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Hubungkan ke Entitas
                  </label>
                  <select
                    value={newLinkedType}
                    onChange={e => {
                      const val = e.target.value as any;
                      setNewLinkedType(val);
                      if (val === 'character') setNewLinkedId(characters[0]?.id || '');
                      else if (val === 'location') setNewLinkedId(locations[0]?.id || '');
                      else if (val === 'chapter') setNewLinkedId(chapters[0]?.id || '');
                      else if (val === 'research') setNewLinkedId(researchItems[0]?.id || '');
                      else setNewLinkedId(currentBook.id);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="character">Tokoh Karakter</option>
                    <option value="location">Lokasi Tempat</option>
                    <option value="chapter">Bab Cerita</option>
                    <option value="research">Riset Vault</option>
                    <option value="book">Proyek Buku Utama</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Pilih Objek Spesifik
                  </label>
                  <select
                    value={newLinkedId}
                    onChange={e => setNewLinkedId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    {newLinkedType === 'character' && characters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {newLinkedType === 'location' && locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                    {newLinkedType === 'chapter' && chapters.map(c => (
                      <option key={c.id} value={c.id}>Bab {c.number}: {c.title}</option>
                    ))}
                    {newLinkedType === 'research' && researchItems.map(r => (
                      <option key={r.id} value={r.id}>{r.topic}</option>
                    ))}
                    {newLinkedType === 'book' && (
                      <option value={currentBook.id}>{currentBook.title}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Tag (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="arsip, 80-an, wawancara, stroke, semarang"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Catatan / Keterangan Konteks
                </label>
                <textarea
                  rows={3}
                  placeholder="Konteks pengambilan foto, menit penting dalam rekaman suara, atau catatan kutipan penting..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                >
                  Simpan Aset ke Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Asset Detail */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedAsset.fileType)}
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {selectedAsset.title}
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    {selectedAsset.fileName} • {formatFileSize(selectedAsset.fileSize || 0)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Media Preview */}
              {selectedAsset.fileType.startsWith('image/') && selectedAsset.dataUrlOrContent ? (
                <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 flex items-center justify-center max-h-72">
                  <img
                    src={selectedAsset.dataUrlOrContent}
                    alt={selectedAsset.title}
                    className="max-h-72 object-contain"
                  />
                </div>
              ) : selectedAsset.fileType.startsWith('audio/') ? (
                <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 flex flex-col items-center justify-center gap-3">
                  <FileAudio className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                    Berkas Audio: {selectedAsset.fileName}
                  </p>
                  {selectedAsset.dataUrlOrContent && (
                    <audio controls className="w-full max-w-md mt-2">
                      <source src={selectedAsset.dataUrlOrContent} type={selectedAsset.fileType} />
                      Browser tidak mendukung pemutar audio.
                    </audio>
                  )}
                </div>
              ) : null}

              {/* Linked Object Card */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-100 dark:border-stone-800">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                  Keterkaitan Cerita
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white dark:bg-stone-700 rounded-lg text-amber-600">
                      {getLinkedEntityInfo(selectedAsset.linkedEntityType || 'book', selectedAsset.linkedEntityId || '').icon}
                    </span>
                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                      {getLinkedEntityInfo(selectedAsset.linkedEntityType || 'book', selectedAsset.linkedEntityId || '').label}
                    </span>
                  </div>

                  {selectedAsset.linkedEntityType === 'character' && (
                    <button
                      onClick={() => {
                        setSelectedAsset(null);
                        setActiveView('characters');
                      }}
                      className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Buka di Profil Tokoh</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {selectedAsset.linkedEntityType === 'chapter' && (
                    <button
                      onClick={() => {
                        setSelectedAsset(null);
                        setActiveChapterId(selectedAsset.linkedEntityId || '');
                        setActiveView('writing_studio');
                      }}
                      className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Tulis di Bab Ini</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Catatan Konteks Penulis:
                </label>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-xl text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
                  {selectedAsset.notes || 'Belum ada catatan untuk aset ini.'}
                </div>
              </div>

              {/* Meta information */}
              <div className="grid grid-cols-2 gap-3 text-stone-500">
                <div>
                  <span className="block font-medium">Kategori:</span>
                  <span className="text-stone-800 dark:text-stone-200 font-semibold">{selectedAsset.category}</span>
                </div>
                <div>
                  <span className="block font-medium">Ditambahkan:</span>
                  <span className="text-stone-800 dark:text-stone-200 font-semibold">
                    {new Date(selectedAsset.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => {
                  deleteAssetFile(selectedAsset.id);
                  setSelectedAsset(null);
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-medium flex items-center gap-1 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Aset</span>
              </button>

              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-xl font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
