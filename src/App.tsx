import React, { useEffect } from 'react';
import { StoryOSProvider, useStoryOS } from './context/StoryOSContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { CommandPalette } from './components/CommandPalette';
import { QuickCreateModal } from './components/QuickCreateModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Views
import { MainDashboardView } from './views/MainDashboardView';
import { BooksManagerView } from './views/BooksManagerView';
import { BookDashboardView } from './views/BookDashboardView';
import { WritingStudioView } from './views/WritingStudioView';
import { StructureView } from './views/StructureView';
import { CharactersView } from './views/CharactersView';
import { LocationsView } from './views/LocationsView';
import { TimelineView } from './views/TimelineView';
import { MemoriesView } from './views/MemoriesView';
import { RealityToFictionView } from './views/RealityToFictionView';
import { IdeasBankView } from './views/IdeasBankView';
import { NotesQuotesView } from './views/NotesQuotesView';
import { ResearchVaultView } from './views/ResearchVaultView';
import { ThemesView } from './views/ThemesView';
import { PlotConflictsView } from './views/PlotConflictsView';
import { EmotionsView } from './views/EmotionsView';
import { WorldbuildingView } from './views/WorldbuildingView';
import { BookBibleView } from './views/BookBibleView';
import { RevisionsCenterView } from './views/RevisionsCenterView';
import { AnalyticsView } from './views/AnalyticsView';
import { CalendarView } from './views/CalendarView';
import { PublishingCenterView } from './views/PublishingCenterView';
import { BackupExportView } from './views/BackupExportView';
import { TaxonomiesView } from './views/TaxonomiesView';
import { AuthorProfileView } from './views/AuthorProfileView';
import { TrashView } from './views/TrashView';
import { SettingsView } from './views/SettingsView';
import { ManuscriptView } from './views/ManuscriptView';
import { FileLibraryView } from './views/FileLibraryView';
import { SystemBlueprintView } from './views/SystemBlueprintView';

const StoryOSApp: React.FC = () => {
  const {
    activeView,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    zenMode,
  } = useStoryOS();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K => Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // Cmd/Ctrl + / => Global Search
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen, setIsGlobalSearchOpen]);

  // View routing renderer
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <MainDashboardView />;
      case 'system_blueprint':
      case 'blueprint':
        return <SystemBlueprintView />;
      case 'books':
      case 'books_manager':
        return <BooksManagerView />;
      case 'book_dashboard':
        return <BookDashboardView />;
      case 'structure':
        return <StructureView />;
      case 'manuscript':
      case 'manuskrip':
        return <ManuscriptView />;
      case 'writing_studio':
        return <WritingStudioView />;
      case 'characters':
        return <CharactersView />;
      case 'locations':
        return <LocationsView />;
      case 'timeline':
        return <TimelineView />;
      case 'memories':
      case 'memories_archive':
        return <MemoriesView />;
      case 'reality_to_fiction':
        return <RealityToFictionView />;
      case 'ideas':
      case 'ideas_bank':
        return <IdeasBankView />;
      case 'notes_quotes':
        return <NotesQuotesView />;
      case 'research':
      case 'research_vault':
        return <ResearchVaultView />;
      case 'file_library':
      case 'file_library_assets':
        return <FileLibraryView />;
      case 'themes':
      case 'themes_motifs':
        return <ThemesView />;
      case 'plot_conflicts':
        return <PlotConflictsView />;
      case 'emotions':
      case 'emotional_journey':
        return <EmotionsView />;
      case 'worldbuilding':
        return <WorldbuildingView />;
      case 'book_bible':
        return <BookBibleView />;
      case 'revisions':
      case 'revisions_center':
        return <RevisionsCenterView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'calendar':
      case 'calendar_schedule':
        return <CalendarView />;
      case 'publishing':
      case 'publishing_center':
        return <PublishingCenterView />;
      case 'backup_export':
        return <BackupExportView />;
      case 'genres':
      case 'genres_manager':
        return <TaxonomiesView initialTab="genres" />;
      case 'tags':
      case 'tags_manager':
        return <TaxonomiesView initialTab="tags" />;
      case 'custom_fields':
        return <TaxonomiesView initialTab="custom_fields" />;
      case 'author_profile':
        return <AuthorProfileView />;
      case 'archive':
        return <BooksManagerView />;
      case 'trash':
        return <TrashView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-stone-100 dark:bg-stone-950 text-stone-800 dark:text-stone-200 overflow-hidden font-sans select-none antialiased">
      {/* Primary Sidebar (hidden when in Zen Mode) */}
      {!zenMode && (
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar (hidden in Zen Mode) */}
        {!zenMode && (
          <TopNavbar
            onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          />
        )}

        {/* Dynamic Content View Container */}
        <main
          className={`flex-1 overflow-y-auto ${
            zenMode
              ? 'p-0'
              : 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'
          }`}
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      {isCommandPaletteOpen && <CommandPalette />}
      {isQuickCreateOpen && <QuickCreateModal />}
      {isGlobalSearchOpen && <GlobalSearchModal />}
    </div>
  );
};

export default function App() {
  return (
    <StoryOSProvider>
      <StoryOSApp />
    </StoryOSProvider>
  );
}
