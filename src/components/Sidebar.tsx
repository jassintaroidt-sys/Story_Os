import React, { useState } from 'react';
import { useStoryOS } from '../context/StoryOSContext';
import {
  LayoutDashboard,
  BookMarked,
  Layers,
  PenLine,
  Users,
  MapPin,
  CalendarDays,
  BrainCircuit,
  Lightbulb,
  FileText,
  FlaskConical,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  Repeat,
  Compass,
  BookOpenCheck,
  CheckSquare,
  BarChart3,
  Calendar,
  Send,
  Search,
  Tag,
  Palette,
  Sliders,
  Archive,
  Trash2,
  Settings,
  Plus,
  ChevronDown,
  UserCheck,
  Download,
  Book,
  X,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const closeMobile = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const {
    activeView,
    setActiveView,
    activeBook,
    books,
    setActiveBookId,
    setIsQuickCreateOpen,
    setIsGlobalSearchOpen,
    trash,
  } = useStoryOS();

  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Ruang Kerja Saya', icon: LayoutDashboard, section: 'main' },
    { id: 'system_blueprint', label: 'Peta & Cetak Biru OS', icon: Compass, section: 'main', badge: 'Blueprint' },
    { id: 'books', label: 'Daftar Buku Saya', icon: BookMarked, section: 'main', badge: books.length },

    // LAPISAN 1 — BUKU
    { id: 'book_dashboard', label: 'Dashboard Buku', icon: Book, section: 'layer1' },
    { id: 'structure', label: 'Struktur Kerangka', icon: Layers, section: 'layer1' },
    { id: 'manuskrip', label: 'Manuskrip Lengkap', icon: BookOpenCheck, section: 'layer1' },

    // LAPISAN 2 — CERITA
    { id: 'writing_studio', label: 'Studio Menulis', icon: PenLine, section: 'layer2', highlight: true },
    { id: 'characters', label: 'Tokoh & Hubungan', icon: Users, section: 'layer2' },
    { id: 'locations', label: 'Database Lokasi', icon: MapPin, section: 'layer2' },
    { id: 'timeline', label: 'Timeline Ganda', icon: CalendarDays, section: 'layer2' },
    { id: 'themes', label: 'Peta Tema & Motif', icon: Sparkles, section: 'layer2' },
    { id: 'plot_conflicts', label: 'Peta Alur & Konflik', icon: TrendingUp, section: 'layer2' },
    { id: 'emotions', label: 'Perjalanan Emosi', icon: HeartHandshake, section: 'layer2' },
    { id: 'worldbuilding', label: 'Pembangunan Dunia', icon: Compass, section: 'layer2' },
    { id: 'book_bible', label: 'Book Bible & Panduan Gaya', icon: BookOpenCheck, section: 'layer2' },

    // LAPISAN 3 — SUMBER & CATATAN
    { id: 'memories', label: 'Arsip Cerita Hidup', icon: BrainCircuit, section: 'layer3' },
    { id: 'reality_to_fiction', label: 'Realita → Fiksi', icon: Repeat, section: 'layer3' },
    { id: 'ideas', label: 'Bank Ide', icon: Lightbulb, section: 'layer3' },
    { id: 'notes_quotes', label: 'Catatan & Kutipan', icon: FileText, section: 'layer3' },
    { id: 'research', label: 'Gudang Riset', icon: FlaskConical, section: 'layer3' },
    { id: 'file_library', label: 'Library File & Aset', icon: Archive, section: 'layer3' },

    // LAPISAN 4 — PENYELESAIAN
    { id: 'revisions', label: 'Pusat Revisi', icon: CheckSquare, section: 'layer4' },
    { id: 'analytics', label: 'Statistik & Target', icon: BarChart3, section: 'layer4' },
    { id: 'calendar', label: 'Kalender Menulis', icon: Calendar, section: 'layer4' },
    { id: 'publishing', label: 'Pusat Penerbitan', icon: Send, section: 'layer4' },

    // SISTEM & PENGATURAN
    { id: 'genres', label: 'Manajer Genre', icon: Palette, section: 'system' },
    { id: 'tags', label: 'Manajer Tag', icon: Tag, section: 'system' },
    { id: 'custom_fields', label: 'Custom Fields', icon: Sliders, section: 'system' },
    { id: 'backup_export', label: 'Ekspor & Backup', icon: Download, section: 'system' },
    { id: 'author_profile', label: 'Profil Penulis', icon: UserCheck, section: 'system' },
    { id: 'archive', label: 'Arsip Buku', icon: Archive, section: 'system' },
    { id: 'trash', label: 'Tempat Sampah', icon: Trash2, section: 'system', badge: trash.length > 0 ? trash.length : undefined },
    { id: 'settings', label: 'Pengaturan', icon: Settings, section: 'system' },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    closeMobile();
  };

  const renderSection = (title: string, sectionKey: string) => {
    const items = navItems.filter(item => item.section === sectionKey);
    return (
      <div className="mb-5">
        <div className="px-3 mb-1.5 text-[11px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
          {title}
        </div>
        <div className="space-y-0.5">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors group text-left ${
                  isActive
                    ? 'bg-amber-600/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 font-medium'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                } ${item.highlight && !isActive ? 'border border-amber-500/20 text-amber-800 dark:text-amber-300/90' : ''}`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-400'
                        : item.highlight
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? 'bg-amber-200/60 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                        : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 h-full flex-shrink-0 bg-stone-100/95 dark:bg-stone-900/95 backdrop-blur border-r border-stone-200 dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Branding Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-sm font-serif-book font-bold text-lg">
              S
            </div>
            <div>
              <div className="font-bold tracking-tight text-stone-900 dark:text-stone-100 text-base leading-tight font-serif-book">
                MY STORY OS
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 tracking-wide font-mono uppercase">
                Sistem Penulisan Buku
              </div>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Book Selector & Quick Actions */}
        <div className="p-3 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="relative">
            <button
              id="active-book-selector-btn"
              onClick={() => setIsBookDropdownOpen(!isBookDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 hover:border-amber-400 dark:hover:border-amber-500/60 shadow-2xs transition text-left"
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                {activeBook?.coverUrl ? (
                  <img
                    src={activeBook.coverUrl}
                    alt={activeBook.title}
                    className="w-6 h-8 object-cover rounded shadow-2xs flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-8 bg-amber-200 dark:bg-amber-900 rounded flex items-center justify-center text-amber-800 dark:text-amber-200 flex-shrink-0 text-xs font-serif-book">
                    B
                  </div>
                )}
                <div className="truncate">
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {activeBook ? activeBook.title : 'Pilih Proyek Buku'}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono truncate">
                    {activeBook ? `${activeBook.progress}% selesai • ${activeBook.targetWords.toLocaleString()} kata` : 'Belum ada'}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform ${isBookDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Book Dropdown Menu */}
            {isBookDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg p-1.5 space-y-1 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-semibold text-stone-400 dark:text-stone-400 px-2 py-1 uppercase tracking-wider">
                  Ganti Proyek Buku
                </div>
                {books.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBookId(b.id);
                      setIsBookDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition ${
                      b.id === activeBook?.id
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="truncate">{b.title}</span>
                    <span className="text-[10px] text-stone-400 font-mono flex-shrink-0 ml-1">
                      {b.progress}%
                    </span>
                  </button>
                ))}
                <div className="pt-1 border-t border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => {
                      setIsBookDropdownOpen(false);
                      setActiveView('books');
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-md font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Buat Buku Baru</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search & Create Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              id="sidebar-quick-search-btn"
              onClick={() => setIsGlobalSearchOpen(true)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg text-xs font-medium transition shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari (⌘K)</span>
            </button>
            <button
              id="sidebar-quick-create-btn"
              onClick={() => setIsQuickCreateOpen(true)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah +</span>
            </button>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {renderSection('Ruang Kerja', 'main')}
          {renderSection('Lapisan 1 — Buku', 'layer1')}
          {renderSection('Lapisan 2 — Cerita', 'layer2')}
          {renderSection('Lapisan 3 — Sumber & Catatan', 'layer3')}
          {renderSection('Lapisan 4 — Penyelesaian', 'layer4')}
          {renderSection('Sistem & Pengaturan', 'system')}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono text-[10px]">v1.0 • Tanpa AI Penulis</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            100% Manusiawi
          </span>
        </div>
      </aside>
    </>
  );
};
