import React from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  Menu,
  Search,
  Plus,
  Sun,
  Moon,
  CheckCircle2,
  Cloud,
  Loader2,
  HardDrive,
  PenLine,
  BookOpen,
} from 'lucide-react';

interface TopNavbarProps {
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileMenu = () => {} }) => {
  const {
    activeView,
    setActiveView,
    activeBook,
    stats,
    autosaveStatus,
    setIsCommandPaletteOpen,
    setIsQuickCreateOpen,
    themeMode,
    setThemeMode,
  } = useStoryOS();

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Ruang Kerja Saya';
      case 'books': return 'Buku Saya';
      case 'book_dashboard': return 'Dashboard Buku';
      case 'structure': return 'Struktur Buku';
      case 'writing_studio': return 'Studio Menulis';
      case 'characters': return 'Database Tokoh & Hubungan';
      case 'locations': return 'Database Lokasi';
      case 'timeline': return 'Timeline Kehidupan';
      case 'memories': return 'Arsip Cerita Hidup';
      case 'reality_to_fiction': return 'Realita → Nonfiksi → Autofiksi → Fiksi';
      case 'ideas': return 'Bank Ide';
      case 'notes_quotes': return 'Catatan & Bank Kutipan';
      case 'research': return 'Gudang Riset';
      case 'themes': return 'Peta Tema';
      case 'plot_conflicts': return 'Peta Alur & Konflik';
      case 'emotions': return 'Perjalanan Emosi';
      case 'worldbuilding': return 'Pembangunan Dunia (Worldbuilding)';
      case 'book_bible': return 'Book Bible & Panduan Gaya';
      case 'revisions': return 'Pusat Revisi & Histori Versi';
      case 'analytics': return 'Statistik & Target Menulis';
      case 'calendar': return 'Kalender Menulis';
      case 'publishing': return 'Pusat Penerbitan';
      case 'genres': return 'Manajer Genre';
      case 'tags': return 'Manajer Tag';
      case 'custom_fields': return 'Custom Field Manager';
      case 'backup_export': return 'Ekspor, Impor & Cadangan';
      case 'author_profile': return 'Profil Penulis';
      case 'archive': return 'Arsip Buku';
      case 'trash': return 'Sampah';
      case 'settings': return 'Pengaturan';
      default: return 'MY STORY OS';
    }
  };

  const renderAutosaveBadge = () => {
    switch (autosaveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
            <span className="hidden sm:inline">Sedang menyimpan...</span>
          </div>
        );
      case 'offline_saved':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <HardDrive className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">Disimpan secara lokal</span>
          </div>
        );
      case 'synced':
      case 'saved':
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">✓ Tersimpan</span>
          </div>
        );
    }
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-stone-200/90 dark:border-stone-800/90 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 lg:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm lg:text-base font-serif-book">
            {getViewTitle()}
          </span>
          {activeBook && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 font-normal">
              <span>/</span>
              <span className="truncate max-w-[180px] font-medium text-stone-700 dark:text-stone-300">
                {activeBook.title}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Stats, Autosave, Tools */}
      <div className="flex items-center gap-2.5">
        {/* Book Live Stats Pill */}
        {activeBook && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-stone-200/50 dark:bg-stone-800/50 rounded-full border border-stone-200 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300 font-mono">
            <span className="font-semibold">{stats.totalWords.toLocaleString()}</span> kata
            <span className="text-stone-400">•</span>
            <span>~{stats.estimatedPages}</span> hlm
          </div>
        )}

        {/* Real-time Autosave Indicator */}
        {renderAutosaveBadge()}

        {/* Global Search Shortcut */}
        <button
          id="top-search-btn"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 rounded-lg shadow-2xs transition"
          title="Buka Pencarian Global (Ctrl+K atau ⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-stone-500">⌘K</span>
        </button>

        {/* Quick Write Jump Button */}
        {activeView !== 'writing_studio' && (
          <button
            id="top-write-btn"
            onClick={() => setActiveView('writing_studio')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium shadow-2xs transition"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Menulis</span>
          </button>
        )}

        {/* Quick Create '+' Button */}
        <button
          id="top-quick-create-btn"
          onClick={() => setIsQuickCreateOpen(true)}
          className="p-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition shadow-2xs"
          title="Tambah Cepat (+)"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-800 transition"
          title={themeMode === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
        </button>
      </div>
    </header>
  );
};
