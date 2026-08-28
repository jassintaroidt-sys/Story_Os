import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Book,
  BookType,
  BookStatusConfig,
  Genre,
  Part,
  Chapter,
  Scene,
  Character,
  CharacterRelationship,
  Location,
  TimelineEvent,
  Memory,
  ResearchItem,
  Idea,
  Note,
  QuoteItem,
  ThemeItem,
  PlotThread,
  ConflictItem,
  EmotionalPoint,
  BookBible,
  StyleGuide,
  RevisionStage,
  WritingGoal,
  WritingLog,
  CalendarEventItem,
  WorldbuildingItem,
  PublishingData,
  AuthorProfile,
  TagItem,
  CustomField,
  CustomFieldValue,
  VersionSnapshot,
  WorldElement,
  PlotPoint,
  RealityTransformation,
  AssetFile,
  WritingBlock,
} from '../types';
import {
  INITIAL_STATUSES,
  INITIAL_BOOK_TYPES,
  INITIAL_GENRES,
  INITIAL_TAGS,
  DEMO_BOOK,
  DEMO_PARTS,
  DEMO_CHAPTERS,
  DEMO_SCENES,
  DEMO_CHARACTERS,
  DEMO_RELATIONSHIPS,
  DEMO_LOCATIONS,
  DEMO_TIMELINE_EVENTS,
  DEMO_MEMORIES,
  DEMO_RESEARCH,
  DEMO_IDEAS,
  DEMO_THEMES,
  DEMO_PLOT_THREADS,
  DEMO_CONFLICTS,
  DEMO_EMOTIONAL_POINTS,
  DEMO_BOOK_BIBLE,
  DEMO_STYLE_GUIDE,
  DEMO_REVISION_STAGES,
  DEMO_WRITING_GOAL,
  DEMO_WRITING_LOGS,
  DEMO_CALENDAR_EVENTS,
  DEMO_PUBLISHING_DATA,
  DEMO_AUTHOR_PROFILE,
  DEMO_CUSTOM_FIELDS,
  DEMO_CUSTOM_FIELD_VALUES,
  DEMO_QUOTES,
  DEMO_NOTES,
  DEMO_WORLDBUILDING_ELEMENTS,
  DEMO_PLOT_POINTS,
  DEMO_TRANSFORMATIONS,
  DEMO_ASSET_FILES,
  DEMO_WRITING_BLOCKS,
} from '../data/initialData';

const DEMO_BOOK_ID = DEMO_BOOK.id;

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'offline_saved' | 'synced';

export interface TrashItem {
  id: string;
  type: 'book' | 'part' | 'chapter' | 'scene' | 'character' | 'location' | 'timeline' | 'memory' | 'research' | 'idea' | 'note' | 'quote' | 'theme' | 'worldbuilding';
  name: string;
  bookId?: string;
  deletedAt: string;
  data: any;
}

interface StoryOSContextType {
  // Navigation & View
  activeView: string;
  setActiveView: (view: string) => void;
  activeBookId: string | null;
  setActiveBookId: (id: string | null) => void;
  activeChapterId: string | null;
  setActiveChapterId: (id: string | null) => void;
  activeSceneId: string | null;
  setActiveSceneId: (id: string | null) => void;

  // Global Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Theme & Preferences
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  wordsPerPage: number;
  setWordsPerPage: (wpp: number) => void;
  zenMode: boolean;
  setZenMode: (zen: boolean | ((prev: boolean) => boolean)) => void;

  // Autosave
  autosaveStatus: AutosaveStatus;
  triggerAutosave: () => void;

  // Active book convenience
  activeBook: Book | null;
  activeChapter: Chapter | null;
  activeScene: Scene | null;

  // Data Collections
  books: Book[];
  bookStatuses: BookStatusConfig[];
  bookTypes: BookType[];
  genres: Genre[];
  tags: TagItem[];
  parts: Part[];
  chapters: Chapter[];
  scenes: Scene[];
  characters: Character[];
  characterRelationships: CharacterRelationship[];
  locations: Location[];
  timelineEvents: TimelineEvent[];
  memories: Memory[];
  researchItems: ResearchItem[];
  ideas: Idea[];
  notes: Note[];
  quotes: QuoteItem[];
  themes: ThemeItem[];
  plotThreads: PlotThread[];
  conflicts: ConflictItem[];
  emotionalPoints: EmotionalPoint[];
  bookBibles: Record<string, BookBible>;
  styleGuides: Record<string, StyleGuide>;
  revisionStages: RevisionStage[];
  writingGoals: Record<string, WritingGoal>;
  writingLogs: WritingLog[];
  calendarEvents: CalendarEventItem[];
  worldbuildingItems: WorldbuildingItem[];
  publishingData: Record<string, PublishingData>;
  authorProfiles: AuthorProfile[];
  customFields: CustomField[];
  customFieldValues: CustomFieldValue[];
  versionSnapshots: VersionSnapshot[];
  snapshots: VersionSnapshot[];
  worldElements: WorldElement[];
  plotPoints: PlotPoint[];
  transformations: RealityTransformation[];
  assetFiles: AssetFile[];
  writingBlocks: WritingBlock[];
  trash: TrashItem[];

  // Asset Files & Writing Blocks
  addAssetFile: (data: Partial<AssetFile>) => AssetFile;
  updateAssetFile: (id: string, updates: Partial<AssetFile>) => void;
  deleteAssetFile: (id: string) => void;
  addWritingBlock: (blockData: Partial<WritingBlock>) => WritingBlock;
  updateWritingBlock: (id: string, updates: Partial<WritingBlock>) => void;
  deleteWritingBlock: (id: string) => void;
  reorderWritingBlocks: (sceneId: string, orderedIds: string[]) => void;

  // Quick stats & helpers
  currentBook: Book;
  totalWords: number;
  streak: number;
  dailyGoal: number;
  todayWordCount: number;
  setTodayWordCount: (count: number | ((prev: number) => number)) => void;

  // Book CRUD
  addBook: (bookData: Partial<Book>) => Book;
  duplicateBook: (id: string) => Book | null;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  archiveBook: (id: string, archive?: boolean) => void;

  // Part CRUD
  addPart: (partData: Partial<Part>) => Part;
  updatePart: (id: string, updates: Partial<Part>) => void;
  deletePart: (id: string) => void;

  // Chapter CRUD
  addChapter: (chapterData: Partial<Chapter>) => Chapter;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;

  // Scene CRUD & Writing
  addScene: (sceneData: Partial<Scene>) => Scene;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  deleteScene: (id: string) => void;
  updateSceneContent: (sceneId: string, newContent: string) => void;
  createVersionSnapshot: (sceneId: string, versionName: string, changeNotes?: string) => void;
  saveSceneSnapshot: (sceneId: string, versionName: string, changeNotes?: string) => void;
  createSnapshot: (label: string) => void;
  restoreSnapshot: (id: string) => void;

  // Character CRUD
  addCharacter: (charData: Partial<Character>) => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  addRelationship: (relData: Partial<CharacterRelationship>) => void;
  deleteRelationship: (id: string) => void;
  addCharacterRelationship: (relData: Partial<CharacterRelationship>) => void;
  deleteCharacterRelationship: (id: string) => void;

  // Location CRUD
  addLocation: (locData: Partial<Location>) => Location;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  // Timeline CRUD
  addTimelineEvent: (eventData: Partial<TimelineEvent>) => TimelineEvent;
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;

  // Memory (Life Archive) CRUD
  addMemory: (memData: Partial<Memory>) => Memory;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;

  // Reality To Fiction Transformations CRUD
  addTransformation: (tData: Partial<RealityTransformation>) => RealityTransformation;
  updateTransformation: (id: string, updates: Partial<RealityTransformation>) => void;
  deleteTransformation: (id: string) => void;

  // Research Vault CRUD
  addResearchItem: (resData: Partial<ResearchItem>) => ResearchItem;
  updateResearchItem: (id: string, updates: Partial<ResearchItem>) => void;
  deleteResearchItem: (id: string) => void;

  // Idea Bank CRUD & Conversion
  addIdea: (ideaData: Partial<Idea>) => Idea;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  convertIdea: (ideaId: string, convertTo: 'chapter' | 'scene' | 'character' | 'note' | 'theme' | 'research') => void;
  convertIdeaToEntity: (ideaId: string, convertTo: 'chapter' | 'scene' | 'character' | 'note' | 'theme' | 'research') => void;

  // Notes & Quotes CRUD
  addNote: (noteData: Partial<Note>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addQuote: (quoteData: Partial<QuoteItem>) => QuoteItem;
  updateQuote: (id: string, updates: Partial<QuoteItem>) => void;
  deleteQuote: (id: string) => void;

  // Themes, Plot, Conflicts, Emotions
  addTheme: (themeData: Partial<ThemeItem>) => ThemeItem;
  updateTheme: (id: string, updates: Partial<ThemeItem>) => void;
  deleteTheme: (id: string) => void;

  addPlotThread: (plotData: Partial<PlotThread>) => PlotThread;
  updatePlotThread: (id: string, updates: Partial<PlotThread>) => void;
  deletePlotThread: (id: string) => void;

  addPlotPoint: (pointData: Partial<PlotPoint>) => PlotPoint;
  updatePlotPoint: (id: string, updates: Partial<PlotPoint>) => void;
  deletePlotPoint: (id: string) => void;

  addConflict: (conflictData: Partial<ConflictItem>) => ConflictItem;
  updateConflict: (id: string, updates: Partial<ConflictItem>) => void;
  deleteConflict: (id: string) => void;

  addEmotionalPoint: (epData: Partial<EmotionalPoint>) => EmotionalPoint;
  updateEmotionalPoint: (id: string, updates: Partial<EmotionalPoint>) => void;
  deleteEmotionalPoint: (id: string) => void;

  // Worldbuilding Elements CRUD
  addWorldElement: (itemData: Partial<WorldElement>) => WorldElement;
  updateWorldElement: (id: string, updates: Partial<WorldElement>) => void;
  deleteWorldElement: (id: string) => void;

  // Book Bible, Style Guide & Publishing
  updateBookBible: (bookId: string, updates: Partial<BookBible>) => void;
  updateStyleGuide: (bookId: string, updates: Partial<StyleGuide>) => void;
  updatePublishingData: (bookId: string, updates: Partial<PublishingData>) => void;
  togglePublishingChecklistItem: (bookId: string, itemId: string) => void;

  // Revision stages
  toggleRevisionStage: (stageId: string) => void;
  addRevisionStage: (name: string, description: string) => void;

  // Writing Goals & Calendar
  updateWritingGoal: (bookId: string, goals: Partial<WritingGoal>) => void;
  addCalendarEvent: (evt: Partial<CalendarEventItem>) => CalendarEventItem;
  toggleCalendarEvent: (id: string) => void;
  deleteCalendarEvent: (id: string) => void;

  // Genres & Statuses CRUD
  addGenre: (genreData: Partial<Genre>) => Genre;
  updateGenre: (id: string, updates: Partial<Genre>) => void;
  deleteGenre: (id: string) => void;

  addBookStatus: (statusData: Partial<BookStatusConfig>) => void;
  updateBookStatus: (id: string, updates: Partial<BookStatusConfig>) => void;
  deleteBookStatus: (id: string) => void;

  // Tags & Custom Fields
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
  addCustomField: (fieldData: Partial<CustomField>) => void;
  setCustomFieldValue: (entityId: string, fieldId: string, value: any) => void;

  // Trash & Recovery
  restoreFromTrash: (trashId: string) => void;
  permanentlyDelete: (trashId: string) => void;
  emptyTrash: () => void;

  // Author Profile
  authorProfile: AuthorProfile;
  updateAuthorProfile: (profile: Partial<AuthorProfile>) => void;

  // Export / Import / Reset
  exportProjectJson: () => string;
  exportBookManuscript: (format: 'txt' | 'markdown' | 'html', scope?: 'full' | 'chapter' | 'scene') => string;
  exportManuscriptMarkdown: () => string;
  exportManuscriptText: () => string;
  exportFullProjectJSON: () => string;
  importProjectJson: (jsonStr: string) => boolean;
  importFullProjectJSON: (jsonStr: string) => boolean;
  resetToDemoData: () => void;
  resetToInitialData: () => void;

  // Writing stats helper
  stats: {
    totalWords: number;
    estimatedPages: number;
    totalParts: number;
    totalChapters: number;
    totalScenes: number;
    totalCharacters: number;
    totalNotes: number;
    totalIdeas: number;
    totalResearch: number;
    totalMemories: number;
    streakDays: number;
    todayWords: number;
  };
}

const StoryOSContext = createContext<StoryOSContextType | undefined>(undefined);

const STORAGE_KEY = 'mystory_os_data_v1';

export const StoryOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeBookId, setActiveBookId] = useState<string | null>(DEMO_BOOK_ID);
  const [activeChapterId, setActiveChapterId] = useState<string | null>('chap-6');
  const [activeSceneId, setActiveSceneId] = useState<string | null>('sc-12');

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Settings
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [accentColor, setAccentColor] = useState<string>('#f59e0b'); // Warm amber
  const [wordsPerPage, setWordsPerPage] = useState<number>(250);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('saved');

  // Primary Entities
  const [books, setBooks] = useState<Book[]>([DEMO_BOOK]);
  const [bookStatuses, setBookStatuses] = useState<BookStatusConfig[]>(INITIAL_STATUSES);
  const [bookTypes, setBookTypes] = useState<BookType[]>(INITIAL_BOOK_TYPES);
  const [genres, setGenres] = useState<Genre[]>(INITIAL_GENRES);
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [parts, setParts] = useState<Part[]>(DEMO_PARTS);
  const [chapters, setChapters] = useState<Chapter[]>(DEMO_CHAPTERS);
  const [scenes, setScenes] = useState<Scene[]>(DEMO_SCENES);
  const [characters, setCharacters] = useState<Character[]>(DEMO_CHARACTERS);
  const [characterRelationships, setCharacterRelationships] = useState<CharacterRelationship[]>(DEMO_RELATIONSHIPS);
  const [locations, setLocations] = useState<Location[]>(DEMO_LOCATIONS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(DEMO_TIMELINE_EVENTS);
  const [memories, setMemories] = useState<Memory[]>(DEMO_MEMORIES);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(DEMO_RESEARCH);
  const [ideas, setIdeas] = useState<Idea[]>(DEMO_IDEAS);
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [quotes, setQuotes] = useState<QuoteItem[]>(DEMO_QUOTES);
  const [themes, setThemes] = useState<ThemeItem[]>(DEMO_THEMES);
  const [plotThreads, setPlotThreads] = useState<PlotThread[]>(DEMO_PLOT_THREADS);
  const [conflicts, setConflicts] = useState<ConflictItem[]>(DEMO_CONFLICTS);
  const [emotionalPoints, setEmotionalPoints] = useState<EmotionalPoint[]>(DEMO_EMOTIONAL_POINTS);
  const [bookBibles, setBookBibles] = useState<Record<string, BookBible>>({ [DEMO_BOOK_ID]: DEMO_BOOK_BIBLE });
  const [styleGuides, setStyleGuides] = useState<Record<string, StyleGuide>>({ [DEMO_BOOK_ID]: DEMO_STYLE_GUIDE });
  const [revisionStages, setRevisionStages] = useState<RevisionStage[]>(DEMO_REVISION_STAGES);
  const [writingGoals, setWritingGoals] = useState<Record<string, WritingGoal>>({ [DEMO_BOOK_ID]: DEMO_WRITING_GOAL });
  const [writingLogs, setWritingLogs] = useState<WritingLog[]>(DEMO_WRITING_LOGS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(DEMO_CALENDAR_EVENTS);
  const [worldbuildingItems, setWorldbuildingItems] = useState<WorldbuildingItem[]>([]);
  const [worldElements, setWorldElements] = useState<WorldElement[]>(DEMO_WORLDBUILDING_ELEMENTS);
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>(DEMO_PLOT_POINTS);
  const [transformations, setTransformations] = useState<RealityTransformation[]>(DEMO_TRANSFORMATIONS);
  const [assetFiles, setAssetFiles] = useState<AssetFile[]>(DEMO_ASSET_FILES);
  const [writingBlocks, setWritingBlocks] = useState<WritingBlock[]>(DEMO_WRITING_BLOCKS);
  const [todayWordCount, setTodayWordCount] = useState<number>(750);
  const [publishingData, setPublishingData] = useState<Record<string, PublishingData>>({ [DEMO_BOOK_ID]: DEMO_PUBLISHING_DATA });
  const [authorProfiles, setAuthorProfiles] = useState<AuthorProfile[]>([DEMO_AUTHOR_PROFILE]);
  const [customFields, setCustomFields] = useState<CustomField[]>(DEMO_CUSTOM_FIELDS);
  const [customFieldValues, setCustomFieldValues] = useState<CustomFieldValue[]>(DEMO_CUSTOM_FIELD_VALUES);
  const [versionSnapshots, setVersionSnapshots] = useState<VersionSnapshot[]>([]);
  const [trash, setTrash] = useState<TrashItem[]>([]);

  // Keyboard shortcut listener (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme effect (dark / light / system)
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [themeMode]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.books && parsed.books.length > 0) {
          setBooks(parsed.books);
          if (parsed.parts) setParts(parsed.parts);
          if (parsed.chapters) setChapters(parsed.chapters);
          if (parsed.scenes) setScenes(parsed.scenes);
          if (parsed.characters) setCharacters(parsed.characters);
          if (parsed.characterRelationships) setCharacterRelationships(parsed.characterRelationships);
          if (parsed.locations) setLocations(parsed.locations);
          if (parsed.timelineEvents) setTimelineEvents(parsed.timelineEvents);
          if (parsed.memories) setMemories(parsed.memories);
          if (parsed.researchItems) setResearchItems(parsed.researchItems);
          if (parsed.ideas) setIdeas(parsed.ideas);
          if (parsed.notes) setNotes(parsed.notes);
          if (parsed.quotes) setQuotes(parsed.quotes);
          if (parsed.themes) setThemes(parsed.themes);
          if (parsed.plotThreads) setPlotThreads(parsed.plotThreads);
          if (parsed.conflicts) setConflicts(parsed.conflicts);
          if (parsed.emotionalPoints) setEmotionalPoints(parsed.emotionalPoints);
          if (parsed.bookBibles) setBookBibles(parsed.bookBibles);
          if (parsed.styleGuides) setStyleGuides(parsed.styleGuides);
          if (parsed.revisionStages) setRevisionStages(parsed.revisionStages);
          if (parsed.writingGoals) setWritingGoals(parsed.writingGoals);
          if (parsed.writingLogs) setWritingLogs(parsed.writingLogs);
          if (parsed.calendarEvents) setCalendarEvents(parsed.calendarEvents);
          if (parsed.publishingData) setPublishingData(parsed.publishingData);
          if (parsed.worldElements) setWorldElements(parsed.worldElements);
          if (parsed.plotPoints) setPlotPoints(parsed.plotPoints);
          if (parsed.transformations) setTransformations(parsed.transformations);
          if (parsed.todayWordCount) setTodayWordCount(parsed.todayWordCount);
          if (parsed.genres) setGenres(parsed.genres);
          if (parsed.tags) setTags(parsed.tags);
          if (parsed.trash) setTrash(parsed.trash);
          if (parsed.activeBookId) setActiveBookId(parsed.activeBookId);
          if (parsed.wordsPerPage) setWordsPerPage(parsed.wordsPerPage);
        }
      }
    } catch (e) {
      console.warn('Could not load saved state from localStorage:', e);
    }
  }, []);

  // Autosave triggers debounce to localStorage
  const triggerAutosave = useCallback(() => {
    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const payload = {
          books,
          parts,
          chapters,
          scenes,
          characters,
          characterRelationships,
          locations,
          timelineEvents,
          memories,
          researchItems,
          ideas,
          notes,
          quotes,
          themes,
          plotThreads,
          conflicts,
          emotionalPoints,
          bookBibles,
          styleGuides,
          revisionStages,
          writingGoals,
          writingLogs,
          calendarEvents,
          worldbuildingItems,
          worldElements,
          plotPoints,
          transformations,
          todayWordCount,
          publishingData,
          authorProfiles,
          customFields,
          customFieldValues,
          genres,
          tags,
          trash,
          activeBookId,
          wordsPerPage,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setAutosaveStatus('saved');
      } catch (err) {
        setAutosaveStatus('offline_saved');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    books,
    parts,
    chapters,
    scenes,
    characters,
    characterRelationships,
    locations,
    timelineEvents,
    memories,
    researchItems,
    ideas,
    notes,
    quotes,
    themes,
    plotThreads,
    conflicts,
    emotionalPoints,
    bookBibles,
    styleGuides,
    revisionStages,
    writingGoals,
    writingLogs,
    calendarEvents,
    worldbuildingItems,
    publishingData,
    authorProfiles,
    customFields,
    customFieldValues,
    genres,
    tags,
    trash,
    activeBookId,
    wordsPerPage,
  ]);

  // Trigger autosave whenever data changes
  useEffect(() => {
    triggerAutosave();
  }, [
    books,
    parts,
    chapters,
    scenes,
    characters,
    locations,
    timelineEvents,
    memories,
    ideas,
    notes,
    quotes,
    themes,
    researchItems,
    triggerAutosave,
  ]);

  // Derived current book, chapter, scene
  const activeBook = useMemo(() => {
    return books.find(b => b.id === activeBookId) || books[0] || null;
  }, [books, activeBookId]);

  const activeChapter = useMemo(() => {
    if (!activeBook) return null;
    return chapters.find(c => c.id === activeChapterId && c.bookId === activeBook.id) || 
      chapters.find(c => c.bookId === activeBook.id) || null;
  }, [chapters, activeChapterId, activeBook]);

  const activeScene = useMemo(() => {
    if (!activeBook) return null;
    return scenes.find(s => s.id === activeSceneId && s.bookId === activeBook.id) ||
      scenes.find(s => s.bookId === activeBook.id && s.chapterId === activeChapter?.id) ||
      scenes.find(s => s.bookId === activeBook.id) || null;
  }, [scenes, activeSceneId, activeChapter, activeBook]);

  // Active book word counts & stats computation
  const stats = useMemo(() => {
    if (!activeBook) {
      return {
        totalWords: 0,
        estimatedPages: 0,
        totalParts: 0,
        totalChapters: 0,
        totalScenes: 0,
        totalCharacters: 0,
        totalNotes: 0,
        totalIdeas: 0,
        totalResearch: 0,
        totalMemories: 0,
        streakDays: 7,
        todayWords: 520,
      };
    }
    const bookScenes = scenes.filter(s => s.bookId === activeBook.id && !s.isTrashed);
    const totalWords = bookScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
    const estimatedPages = Math.ceil(totalWords / (activeBook.wordsPerPage || wordsPerPage || 250));
    const totalParts = parts.filter(p => p.bookId === activeBook.id && !p.isTrashed).length;
    const totalChapters = chapters.filter(c => c.bookId === activeBook.id && !c.isTrashed).length;
    const totalScenes = bookScenes.length;
    const totalCharacters = characters.filter(c => c.bookId === activeBook.id && !c.isTrashed).length;
    const totalNotes = notes.filter(n => n.bookId === activeBook.id && !n.isTrashed).length;
    const totalIdeas = ideas.filter(i => i.bookId === activeBook.id && !i.isTrashed).length;
    const totalResearch = researchItems.filter(r => r.bookId === activeBook.id && !r.isTrashed).length;
    const totalMemories = memories.filter(m => m.bookId === activeBook.id && !m.isTrashed).length;

    // Writing streak
    const streakDays = writingLogs.length > 0 ? 7 : 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayLog = writingLogs.find(l => l.date === todayStr && l.bookId === activeBook.id);

    return {
      totalWords,
      estimatedPages,
      totalParts,
      totalChapters,
      totalScenes,
      totalCharacters,
      totalNotes,
      totalIdeas,
      totalResearch,
      totalMemories,
      streakDays,
      todayWords: todayLog ? todayLog.wordsWritten : 520,
    };
  }, [activeBook, scenes, parts, chapters, characters, notes, ideas, researchItems, memories, wordsPerPage, writingLogs]);

  // Recalculate book progress based on target words
  useEffect(() => {
    if (activeBook && activeBook.targetWords > 0) {
      const progress = Math.min(100, Math.round((stats.totalWords / activeBook.targetWords) * 100));
      if (progress !== activeBook.progress) {
        setBooks(prev => prev.map(b => b.id === activeBook.id ? { ...b, progress } : b));
      }
    }
  }, [stats.totalWords, activeBook]);

  // Helper to count words
  const countWords = (text: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // --- CRUD ACTIONS ---

  // Book CRUD
  const addBook = useCallback((bookData: Partial<Book>): Book => {
    const id = `book-${Date.now()}`;
    const newBook: Book = {
      id,
      title: bookData.title || 'Buku Baru Tanpa Judul',
      subtitle: bookData.subtitle || '',
      authorName: bookData.authorName || authorProfiles[0]?.name || 'Penulis',
      penName: bookData.penName || authorProfiles[0]?.penName || '',
      description: bookData.description || '',
      premis: bookData.premis || '',
      bookGoal: bookData.bookGoal || '',
      coverUrl: bookData.coverUrl || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      bookTypeId: bookData.bookTypeId || 'novel',
      genreIds: bookData.genreIds && bookData.genreIds.length > 0 ? bookData.genreIds : ['g-fiksi'],
      subgenres: bookData.subgenres || [],
      tags: bookData.tags || [],
      status: bookData.status || 'planning',
      progress: 0,
      targetWords: bookData.targetWords || 50000,
      targetPages: bookData.targetPages || 200,
      targetChapters: bookData.targetChapters || 10,
      targetDate: bookData.targetDate || '',
      wordsPerPage: bookData.wordsPerPage || wordsPerPage || 250,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      isTrashed: false,
    };

    setBooks(prev => [newBook, ...prev]);
    setActiveBookId(id);

    // Initial Part and Chapter
    const initialPart: Part = {
      id: `part-${Date.now()}`,
      bookId: id,
      number: 1,
      title: 'Bagian I',
      description: 'Bagian Pembuka',
      status: 'Draft',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setParts(prev => [...prev, initialPart]);

    const initialChapter: Chapter = {
      id: `chap-${Date.now()}`,
      bookId: id,
      partId: initialPart.id,
      number: 1,
      title: 'Bab 01 — Langkah Pertama',
      summary: 'Awal perjalanan kisah.',
      characterIds: [],
      locationIds: [],
      status: 'Sedang Ditulis',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChapters(prev => [...prev, initialChapter]);

    const initialScene: Scene = {
      id: `sc-${Date.now()}`,
      bookId: id,
      partId: initialPart.id,
      chapterId: initialChapter.id,
      number: 1,
      title: 'Adegan 1: Pembuka',
      characterIds: [],
      locationIds: [],
      content: '',
      wordCount: 0,
      status: 'Sedang Ditulis',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setScenes(prev => [...prev, initialScene]);
    setActiveChapterId(initialChapter.id);
    setActiveSceneId(initialScene.id);

    return newBook;
  }, [authorProfiles, wordsPerPage]);

  const duplicateBook = useCallback((id: string): Book | null => {
    const original = books.find(b => b.id === id);
    if (!original) return null;
    const newBookId = `book-${Date.now()}`;
    const newBook: Book = {
      ...original,
      id: newBookId,
      title: `${original.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const originalParts = parts.filter(p => p.bookId === id);
    const partIdMap: Record<string, string> = {};
    const duplicatedParts = originalParts.map(p => {
      const newPartId = `part-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      partIdMap[p.id] = newPartId;
      return {
        ...p,
        id: newPartId,
        bookId: newBookId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const originalChapters = chapters.filter(c => c.bookId === id);
    const chapterIdMap: Record<string, string> = {};
    const duplicatedChapters = originalChapters.map(c => {
      const newChapterId = `chap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      chapterIdMap[c.id] = newChapterId;
      return {
        ...c,
        id: newChapterId,
        bookId: newBookId,
        partId: c.partId ? partIdMap[c.partId] || null : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const originalScenes = scenes.filter(s => s.bookId === id);
    const duplicatedScenes = originalScenes.map(s => {
      const newSceneId = `sc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return {
        ...s,
        id: newSceneId,
        bookId: newBookId,
        partId: s.partId ? partIdMap[s.partId] || null : null,
        chapterId: chapterIdMap[s.chapterId] || s.chapterId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    setBooks(prev => [newBook, ...prev]);
    setParts(prev => [...prev, ...duplicatedParts]);
    setChapters(prev => [...prev, ...duplicatedChapters]);
    setScenes(prev => [...prev, ...duplicatedScenes]);
    return newBook;
  }, [books, parts, chapters, scenes]);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b));
  }, []);

  const deleteBook = useCallback((id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return;
    setTrash(prev => [
      { id: `trash-${Date.now()}`, type: 'book', name: book.title, bookId: id, deletedAt: new Date().toISOString(), data: book },
      ...prev,
    ]);
    setBooks(prev => prev.filter(b => b.id !== id));
    if (activeBookId === id) {
      const remaining = books.filter(b => b.id !== id);
      setActiveBookId(remaining[0]?.id || null);
    }
  }, [books, activeBookId]);

  const archiveBook = useCallback((id: string, archive: boolean = true) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, isArchived: archive, updatedAt: new Date().toISOString() } : b));
  }, []);

  // Part CRUD
  const addPart = useCallback((partData: Partial<Part>): Part => {
    const bookId = partData.bookId || activeBookId || DEMO_BOOK_ID;
    const existing = parts.filter(p => p.bookId === bookId);
    const newPart: Part = {
      id: `part-${Date.now()}`,
      bookId,
      number: existing.length + 1,
      title: partData.title || `Bagian ${existing.length + 1}`,
      description: partData.description || '',
      objective: partData.objective || '',
      theme: partData.theme || '',
      status: partData.status || 'Perencanaan',
      order: existing.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setParts(prev => [...prev, newPart]);
    return newPart;
  }, [activeBookId, parts]);

  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  }, []);

  const deletePart = useCallback((id: string) => {
    const part = parts.find(p => p.id === id);
    if (part) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'part', name: part.title, bookId: part.bookId, deletedAt: new Date().toISOString(), data: part }, ...prev]);
      setParts(prev => prev.filter(p => p.id !== id));
    }
  }, [parts]);

  // Chapter CRUD
  const addChapter = useCallback((chapterData: Partial<Chapter>): Chapter => {
    const bookId = chapterData.bookId || activeBookId || DEMO_BOOK_ID;
    const existing = chapters.filter(c => c.bookId === bookId);
    const num = existing.length + 1;
    const newChapter: Chapter = {
      id: `chap-${Date.now()}`,
      bookId,
      partId: chapterData.partId || parts.find(p => p.bookId === bookId)?.id || null,
      number: num,
      title: chapterData.title || `Bab ${num < 10 ? '0' + num : num} — Judul Bab Baru`,
      summary: chapterData.summary || '',
      chapterObjective: chapterData.chapterObjective || '',
      keyIdea: chapterData.keyIdea || '',
      conflict: chapterData.conflict || '',
      theme: chapterData.theme || '',
      characterIds: chapterData.characterIds || [],
      locationIds: chapterData.locationIds || [],
      status: chapterData.status || 'Sedang Ditulis',
      order: num,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChapters(prev => [...prev, newChapter]);
    setActiveChapterId(newChapter.id);

    // Auto create an initial scene for this chapter
    const newScene: Scene = {
      id: `sc-${Date.now()}`,
      bookId,
      partId: newChapter.partId,
      chapterId: newChapter.id,
      number: 1,
      title: 'Adegan 1',
      characterIds: [],
      locationIds: [],
      content: '',
      wordCount: 0,
      status: 'Sedang Ditulis',
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setScenes(prev => [...prev, newScene]);
    setActiveSceneId(newScene.id);

    return newChapter;
  }, [activeBookId, chapters, parts]);

  const updateChapter = useCallback((id: string, updates: Partial<Chapter>) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    const chap = chapters.find(c => c.id === id);
    if (chap) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'chapter', name: chap.title, bookId: chap.bookId, deletedAt: new Date().toISOString(), data: chap }, ...prev]);
      setChapters(prev => prev.filter(c => c.id !== id));
    }
  }, [chapters]);

  // Scene CRUD
  const addScene = useCallback((sceneData: Partial<Scene>): Scene => {
    const bookId = sceneData.bookId || activeBookId || DEMO_BOOK_ID;
    const chapterId = sceneData.chapterId || activeChapterId || chapters.find(c => c.bookId === bookId)?.id || 'chap-1';
    const existingInChapter = scenes.filter(s => s.chapterId === chapterId);
    const num = existingInChapter.length + 1;
    const newScene: Scene = {
      id: `sc-${Date.now()}`,
      bookId,
      chapterId,
      partId: sceneData.partId || chapters.find(c => c.id === chapterId)?.partId || null,
      number: num,
      title: sceneData.title || `Adegan ${num}: Judul Adegan`,
      summary: sceneData.summary || '',
      objective: sceneData.objective || '',
      characterIds: sceneData.characterIds || [],
      locationIds: sceneData.locationIds || [],
      content: sceneData.content || '',
      wordCount: countWords(sceneData.content || ''),
      status: sceneData.status || 'Sedang Ditulis',
      order: num,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setScenes(prev => [...prev, newScene]);
    setActiveSceneId(newScene.id);
    return newScene;
  }, [activeBookId, activeChapterId, chapters, scenes]);

  const updateScene = useCallback((id: string, updates: Partial<Scene>) => {
    setScenes(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
        if (updates.content !== undefined) {
          updated.wordCount = countWords(updates.content);
        }
        return updated;
      }
      return s;
    }));
  }, []);

  const deleteScene = useCallback((id: string) => {
    const sc = scenes.find(s => s.id === id);
    if (sc) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'scene', name: sc.title, bookId: sc.bookId, deletedAt: new Date().toISOString(), data: sc }, ...prev]);
      setScenes(prev => prev.filter(s => s.id !== id));
    }
  }, [scenes]);

  const updateSceneContent = useCallback((sceneId: string, newContent: string) => {
    const wordCount = countWords(newContent);
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, content: newContent, wordCount, updatedAt: new Date().toISOString() } : s));

    // Update today's writing log
    const today = new Date().toISOString().slice(0, 10);
    setWritingLogs(prev => {
      const existing = prev.find(l => l.date === today && l.bookId === (activeBookId || DEMO_BOOK_ID));
      if (existing) {
        return prev.map(l => l.date === today && l.bookId === (activeBookId || DEMO_BOOK_ID) ? { ...l, wordsWritten: l.wordsWritten + 1 } : l);
      } else {
        return [{ date: today, wordsWritten: 1, minutesWritten: 5, bookId: activeBookId || DEMO_BOOK_ID }, ...prev];
      }
    });
  }, [activeBookId]);

  const createVersionSnapshot = useCallback((sceneId: string, versionName: string, changeNotes?: string) => {
    const sc = scenes.find(s => s.id === sceneId);
    if (!sc) return;
    const snap: VersionSnapshot = {
      id: `snap-${Date.now()}`,
      bookId: sc.bookId,
      entityType: 'scene',
      entityId: sceneId,
      versionName,
      content: sc.content,
      wordCount: sc.wordCount,
      changeNotes,
      createdAt: new Date().toISOString(),
    };
    setVersionSnapshots(prev => [snap, ...prev]);
  }, [scenes]);

  const saveSceneSnapshot = useCallback((sceneId: string, versionName: string, changeNotes?: string) => {
    createVersionSnapshot(sceneId, versionName, changeNotes);
  }, [createVersionSnapshot]);

  const createSnapshot = useCallback((label: string) => {
    const activeBk = activeBookId || DEMO_BOOK_ID;
    const currentScenes = scenes.filter(s => s.bookId === activeBk && !s.isTrashed);
    const totalWordsCount = currentScenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
    const snap: VersionSnapshot = {
      id: `snap-full-${Date.now()}`,
      bookId: activeBk,
      entityType: 'book',
      entityId: activeBk,
      versionName: label,
      label,
      content: JSON.stringify({ scenes: currentScenes, chapters: chapters.filter(c => c.bookId === activeBk) }),
      wordCount: totalWordsCount,
      changeNotes: `Snapshot naskah lengkap: ${label}`,
      createdAt: new Date().toISOString(),
    };
    setVersionSnapshots(prev => [snap, ...prev]);
  }, [scenes, chapters, activeBookId]);

  const restoreSnapshot = useCallback((id: string) => {
    const snap = versionSnapshots.find(s => s.id === id);
    if (!snap) return;
    if (snap.entityType === 'scene' && snap.entityId && snap.content) {
      updateScene(snap.entityId, { content: snap.content });
    } else if (snap.content) {
      try {
        const parsed = JSON.parse(snap.content);
        if (parsed.scenes && Array.isArray(parsed.scenes)) {
          setScenes(prev => {
            const otherScenes = prev.filter(s => s.bookId !== snap.bookId);
            return [...otherScenes, ...parsed.scenes];
          });
        }
      } catch (e) {
        console.error('Error restoring snapshot:', e);
      }
    }
  }, [versionSnapshots, updateScene]);

  // Character CRUD
  const addCharacter = useCallback((charData: Partial<Character>): Character => {
    const bookId = charData.bookId || activeBookId || DEMO_BOOK_ID;
    const newChar: Character = {
      id: `char-${Date.now()}`,
      bookId,
      name: charData.name || 'Tokoh Baru',
      nickname: charData.nickname || '',
      storyName: charData.storyName || '',
      fictionName: charData.fictionName || '',
      type: charData.type || 'real_person',
      age: charData.age || '',
      occupation: charData.occupation || '',
      personality: charData.personality || '',
      appearance: charData.appearance || '',
      background: charData.background || '',
      goal: charData.goal || '',
      fears: charData.fears || '',
      strengths: charData.strengths || '',
      weaknesses: charData.weaknesses || '',
      habits: charData.habits || '',
      speechMannerisms: charData.speechMannerisms || '',
      characterArc: charData.characterArc || '',
      secrets: charData.secrets || '',
      conflicts: charData.conflicts || '',
      notes: charData.notes || '',
      avatarUrl: charData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCharacters(prev => [...prev, newChar]);
    return newChar;
  }, [activeBookId]);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    const c = characters.find(item => item.id === id);
    if (c) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'character', name: c.name, bookId: c.bookId, deletedAt: new Date().toISOString(), data: c }, ...prev]);
      setCharacters(prev => prev.filter(item => item.id !== id));
    }
  }, [characters]);

  const addRelationship = useCallback((relData: Partial<CharacterRelationship>) => {
    const rel: CharacterRelationship = {
      id: `rel-${Date.now()}`,
      bookId: relData.bookId || activeBookId || DEMO_BOOK_ID,
      sourceCharacterId: relData.sourceCharacterId || '',
      targetCharacterId: relData.targetCharacterId || '',
      relationshipType: relData.relationshipType || 'Teman',
      intensity: relData.intensity || 5,
      notes: relData.notes || '',
    };
    setCharacterRelationships(prev => [...prev, rel]);
  }, [activeBookId]);

  const deleteRelationship = useCallback((id: string) => {
    setCharacterRelationships(prev => prev.filter(r => r.id !== id));
  }, []);

  const addCharacterRelationship = useCallback((relData: Partial<CharacterRelationship>) => {
    addRelationship(relData);
  }, [addRelationship]);

  const deleteCharacterRelationship = useCallback((id: string) => {
    deleteRelationship(id);
  }, [deleteRelationship]);

  // Location CRUD
  const addLocation = useCallback((locData: Partial<Location>): Location => {
    const bookId = locData.bookId || activeBookId || DEMO_BOOK_ID;
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      bookId,
      name: locData.name || 'Lokasi Baru',
      type: locData.type || 'Tempat',
      description: locData.description || '',
      atmosphere: locData.atmosphere || '',
      visualLook: locData.visualLook || '',
      history: locData.history || '',
      charactersVisited: locData.charactersVisited || [],
      notes: locData.notes || '',
      photoUrl: locData.photoUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocations(prev => [...prev, newLoc]);
    return newLoc;
  }, [activeBookId]);

  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
  }, []);

  const deleteLocation = useCallback((id: string) => {
    const l = locations.find(item => item.id === id);
    if (l) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'location', name: l.name, bookId: l.bookId, deletedAt: new Date().toISOString(), data: l }, ...prev]);
      setLocations(prev => prev.filter(item => item.id !== id));
    }
  }, [locations]);

  // Timeline CRUD
  const addTimelineEvent = useCallback((eventData: Partial<TimelineEvent>): TimelineEvent => {
    const bookId = eventData.bookId || activeBookId || DEMO_BOOK_ID;
    const existing = timelineEvents.filter(t => t.bookId === bookId);
    const newEvt: TimelineEvent = {
      id: `time-${Date.now()}`,
      bookId,
      dateType: eventData.dateType || 'approximate',
      dateValue: eventData.dateValue || '',
      year: eventData.year || '',
      period: eventData.period || '',
      title: eventData.title || 'Peristiwa Baru',
      description: eventData.description || '',
      characterIds: eventData.characterIds || [],
      locationId: eventData.locationId || undefined,
      emotion: eventData.emotion || '',
      impact: eventData.impact || '',
      notes: eventData.notes || '',
      orderReal: existing.length + 1,
      orderStory: existing.length + 1,
      linkedChapterId: eventData.linkedChapterId,
      linkedSceneId: eventData.linkedSceneId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTimelineEvents(prev => [...prev, newEvt]);
    return newEvt;
  }, [activeBookId, timelineEvents]);

  const updateTimelineEvent = useCallback((id: string, updates: Partial<TimelineEvent>) => {
    setTimelineEvents(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTimelineEvent = useCallback((id: string) => {
    const t = timelineEvents.find(item => item.id === id);
    if (t) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'timeline', name: t.title, bookId: t.bookId, deletedAt: new Date().toISOString(), data: t }, ...prev]);
      setTimelineEvents(prev => prev.filter(item => item.id !== id));
    }
  }, [timelineEvents]);

  // Memory (Life Archive) CRUD
  const addMemory = useCallback((memData: Partial<Memory>): Memory => {
    const bookId = memData.bookId || activeBookId || DEMO_BOOK_ID;
    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      bookId,
      title: memData.title || 'Pengalaman Hidup Baru',
      period: memData.period || '',
      year: memData.year || '',
      location: memData.location || '',
      peopleInvolved: memData.peopleInvolved || '',
      whatHappened: memData.whatHappened || '',
      whatIsRemembered: memData.whatIsRemembered || '',
      feelings: memData.feelings || '',
      sensoryVisual: memData.sensoryVisual || '',
      sensorySound: memData.sensorySound || '',
      sensorySmell: memData.sensorySmell || '',
      rememberedDialogue: memData.rememberedDialogue || '',
      lessonsLearned: memData.lessonsLearned || '',
      impact: memData.impact || '',
      personalNotes: memData.personalNotes || '',
      potentialChapter: memData.potentialChapter || '',
      potentialScene: memData.potentialScene || '',
      publicationStatus: memData.publicationStatus || 'Belum Dipublikasikan',
      privacyLevel: memData.privacyLevel || 'development_only',
      versions: memData.versions || {
        original: memData.whatHappened || '',
        nonfiction: '',
        autofiction: '',
        fiction: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemories(prev => [newMem, ...prev]);
    return newMem;
  }, [activeBookId]);

  const updateMemory = useCallback((id: string, updates: Partial<Memory>) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
  }, []);

  const deleteMemory = useCallback((id: string) => {
    const m = memories.find(item => item.id === id);
    if (m) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'memory', name: m.title, bookId: m.bookId, deletedAt: new Date().toISOString(), data: m }, ...prev]);
      setMemories(prev => prev.filter(item => item.id !== id));
    }
  }, [memories]);

  // Research Item CRUD
  const addResearchItem = useCallback((resData: Partial<ResearchItem>): ResearchItem => {
    const bookId = resData.bookId || activeBookId || DEMO_BOOK_ID;
    const newRes: ResearchItem = {
      id: `res-${Date.now()}`,
      bookId,
      title: resData.title || 'Item Riset Baru',
      source: resData.source || 'Buku / Artikel',
      author: resData.author || '',
      url: resData.url || '',
      date: resData.date || '',
      category: resData.category || 'Umum',
      summary: resData.summary || '',
      quoteExcerpt: resData.quoteExcerpt || '',
      notes: resData.notes || '',
      credibility: resData.credibility || 'high',
      chapterIds: resData.chapterIds || [],
      sceneIds: resData.sceneIds || [],
      tags: resData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResearchItems(prev => [newRes, ...prev]);
    return newRes;
  }, [activeBookId]);

  const updateResearchItem = useCallback((id: string, updates: Partial<ResearchItem>) => {
    setResearchItems(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
  }, []);

  const deleteResearchItem = useCallback((id: string) => {
    const r = researchItems.find(item => item.id === id);
    if (r) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'research', name: r.title, bookId: r.bookId, deletedAt: new Date().toISOString(), data: r }, ...prev]);
      setResearchItems(prev => prev.filter(item => item.id !== id));
    }
  }, [researchItems]);

  // Idea Bank CRUD & Conversion
  const addIdea = useCallback((ideaData: Partial<Idea>): Idea => {
    const bookId = ideaData.bookId || activeBookId || DEMO_BOOK_ID;
    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      bookId,
      title: ideaData.title || 'Ide Baru',
      content: ideaData.content || '',
      category: ideaData.category || 'story_idea',
      tags: ideaData.tags || [],
      status: ideaData.status || 'inbox',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIdeas(prev => [newIdea, ...prev]);
    return newIdea;
  }, [activeBookId]);

  const updateIdea = useCallback((id: string, updates: Partial<Idea>) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
  }, []);

  const deleteIdea = useCallback((id: string) => {
    const i = ideas.find(item => item.id === id);
    if (i) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'idea', name: i.title, bookId: i.bookId, deletedAt: new Date().toISOString(), data: i }, ...prev]);
      setIdeas(prev => prev.filter(item => item.id !== id));
    }
  }, [ideas]);

  const convertIdea = useCallback((ideaId: string, convertTo: 'chapter' | 'scene' | 'character' | 'note' | 'theme' | 'research') => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    let targetId = '';
    if (convertTo === 'chapter') {
      const chap = addChapter({ title: idea.title, summary: idea.content, bookId: idea.bookId });
      targetId = chap.id;
    } else if (convertTo === 'scene') {
      const sc = addScene({ title: idea.title, summary: idea.content, bookId: idea.bookId });
      targetId = sc.id;
    } else if (convertTo === 'character') {
      const ch = addCharacter({ name: idea.title, background: idea.content, bookId: idea.bookId });
      targetId = ch.id;
    } else if (convertTo === 'note') {
      const n: Note = {
        id: `note-${Date.now()}`,
        bookId: idea.bookId,
        title: idea.title,
        content: idea.content,
        tags: idea.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes(prev => [n, ...prev]);
      targetId = n.id;
    } else if (convertTo === 'theme') {
      const th = {
        id: `theme-${Date.now()}`,
        bookId: idea.bookId,
        name: idea.title,
        description: idea.content,
        color: '#6366f1',
        linkedPartIds: [],
        linkedChapterIds: [],
        linkedSceneIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setThemes(prev => [...prev, th]);
      targetId = th.id;
    } else if (convertTo === 'research') {
      const r = addResearchItem({ title: idea.title, summary: idea.content, bookId: idea.bookId });
      targetId = r.id;
    }

    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: 'used', convertedTo: { type: convertTo, id: targetId } } : i));
  }, [ideas, addChapter, addScene, addCharacter, addResearchItem]);

  // Note CRUD
  const addNote = useCallback((noteData: Partial<Note>): Note => {
    const bookId = noteData.bookId || activeBookId || DEMO_BOOK_ID;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      bookId,
      title: noteData.title || 'Catatan Baru',
      content: noteData.content || '',
      category: noteData.category || 'Umum',
      tags: noteData.tags || [],
      isPinned: noteData.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, [activeBookId]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    const n = notes.find(item => item.id === id);
    if (n) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'note', name: n.title, bookId: n.bookId, deletedAt: new Date().toISOString(), data: n }, ...prev]);
      setNotes(prev => prev.filter(item => item.id !== id));
    }
  }, [notes]);

  // Quote CRUD
  const addQuote = useCallback((quoteData: Partial<QuoteItem>): QuoteItem => {
    const bookId = quoteData.bookId || activeBookId || DEMO_BOOK_ID;
    const newQuote: QuoteItem = {
      id: `q-${Date.now()}`,
      bookId,
      quoteText: quoteData.quoteText || '',
      source: quoteData.source || '',
      speaker: quoteData.speaker || '',
      context: quoteData.context || '',
      chapterId: quoteData.chapterId,
      sceneId: quoteData.sceneId,
      themeId: quoteData.themeId,
      notes: quoteData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setQuotes(prev => [newQuote, ...prev]);
    return newQuote;
  }, [activeBookId]);

  const updateQuote = useCallback((id: string, updates: Partial<QuoteItem>) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q));
  }, []);

  const deleteQuote = useCallback((id: string) => {
    const q = quotes.find(item => item.id === id);
    if (q) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'quote', name: q.quoteText.slice(0, 30), bookId: q.bookId, deletedAt: new Date().toISOString(), data: q }, ...prev]);
      setQuotes(prev => prev.filter(item => item.id !== id));
    }
  }, [quotes]);

  // Themes, Plot, Conflicts, Emotions
  const addTheme = useCallback((themeData: Partial<ThemeItem>): ThemeItem => {
    const bookId = themeData.bookId || activeBookId || DEMO_BOOK_ID;
    const newTheme: ThemeItem = {
      id: `theme-${Date.now()}`,
      bookId,
      name: themeData.name || 'Tema Baru',
      description: themeData.description || '',
      color: themeData.color || '#6366f1',
      progressionNotes: themeData.progressionNotes || '',
      linkedPartIds: themeData.linkedPartIds || [],
      linkedChapterIds: themeData.linkedChapterIds || [],
      linkedSceneIds: themeData.linkedSceneIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setThemes(prev => [...prev, newTheme]);
    return newTheme;
  }, [activeBookId]);

  const updateTheme = useCallback((id: string, updates: Partial<ThemeItem>) => {
    setThemes(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTheme = useCallback((id: string) => {
    const t = themes.find(item => item.id === id);
    if (t) {
      setTrash(prev => [{ id: `trash-${Date.now()}`, type: 'theme', name: t.name, bookId: t.bookId, deletedAt: new Date().toISOString(), data: t }, ...prev]);
      setThemes(prev => prev.filter(item => item.id !== id));
    }
  }, [themes]);

  const addPlotThread = useCallback((plotData: Partial<PlotThread>): PlotThread => {
    const bookId = plotData.bookId || activeBookId || DEMO_BOOK_ID;
    const newPlot: PlotThread = {
      id: `plot-${Date.now()}`,
      bookId,
      title: plotData.title || 'Alur Cerita Baru',
      type: plotData.type || 'subplot',
      beginning: plotData.beginning || '',
      development: plotData.development || '',
      conflict: plotData.conflict || '',
      climax: plotData.climax || '',
      resolution: plotData.resolution || '',
      linkedChapterIds: plotData.linkedChapterIds || [],
      color: plotData.color || '#3b82f6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlotThreads(prev => [...prev, newPlot]);
    return newPlot;
  }, [activeBookId]);

  const updatePlotThread = useCallback((id: string, updates: Partial<PlotThread>) => {
    setPlotThreads(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  }, []);

  const deletePlotThread = useCallback((id: string) => {
    setPlotThreads(prev => prev.filter(p => p.id !== id));
  }, []);

  const addConflict = useCallback((conflictData: Partial<ConflictItem>): ConflictItem => {
    const bookId = conflictData.bookId || activeBookId || DEMO_BOOK_ID;
    const newConf: ConflictItem = {
      id: `conf-${Date.now()}`,
      bookId,
      title: conflictData.title || 'Konflik Baru',
      type: conflictData.type || 'internal',
      description: conflictData.description || '',
      involvedCharacterIds: conflictData.involvedCharacterIds || [],
      resolution: conflictData.resolution || '',
      status: conflictData.status || 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConflicts(prev => [...prev, newConf]);
    return newConf;
  }, [activeBookId]);

  const updateConflict = useCallback((id: string, updates: Partial<ConflictItem>) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  }, []);

  const deleteConflict = useCallback((id: string) => {
    setConflicts(prev => prev.filter(c => c.id !== id));
  }, []);

  const addEmotionalPoint = useCallback((epData: Partial<EmotionalPoint>): EmotionalPoint => {
    const newEp: EmotionalPoint = {
      id: `ep-${Date.now()}`,
      bookId: epData.bookId || activeBookId || DEMO_BOOK_ID,
      entityType: epData.entityType || 'scene',
      entityId: epData.entityId || '',
      label: epData.label || 'Titik Emosi',
      emotionName: epData.emotionName || 'Resonansi',
      intensity: epData.intensity || 5,
      valence: epData.valence || 0,
      color: epData.color || '#6366f1',
      notes: epData.notes || '',
    };
    setEmotionalPoints(prev => [...prev, newEp]);
    return newEp;
  }, [activeBookId]);

  const updateEmotionalPoint = useCallback((id: string, updates: Partial<EmotionalPoint>) => {
    setEmotionalPoints(prev => prev.map(ep => ep.id === id ? { ...ep, ...updates } : ep));
  }, []);

  const deleteEmotionalPoint = useCallback((id: string) => {
    setEmotionalPoints(prev => prev.filter(ep => ep.id !== id));
  }, []);

  const convertIdeaToEntity = useCallback((ideaId: string, convertTo: 'chapter' | 'scene' | 'character' | 'note' | 'theme' | 'research') => {
    convertIdea(ideaId, convertTo);
  }, [convertIdea]);

  // Plot Points CRUD
  const addPlotPoint = useCallback((pointData: Partial<PlotPoint>): PlotPoint => {
    const newPoint: PlotPoint = {
      id: `pp-${Date.now()}`,
      bookId: pointData.bookId || activeBookId || DEMO_BOOK_ID,
      act: pointData.act || 1,
      stageName: pointData.stageName || 'Babak 1',
      beatName: pointData.beatName || pointData.title || 'Plot Beat',
      title: pointData.title || 'Titik Alur Baru',
      summary: pointData.summary || '',
      tensionLevel: pointData.tensionLevel || 5,
      chapterId: pointData.chapterId,
      sceneId: pointData.sceneId,
      isCompleted: pointData.isCompleted || false,
    };
    setPlotPoints(prev => [...prev, newPoint]);
    return newPoint;
  }, [activeBookId]);

  const updatePlotPoint = useCallback((id: string, updates: Partial<PlotPoint>) => {
    setPlotPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePlotPoint = useCallback((id: string) => {
    setPlotPoints(prev => prev.filter(p => p.id !== id));
  }, []);

  // Worldbuilding Elements CRUD
  const addWorldElement = useCallback((itemData: Partial<WorldElement>): WorldElement => {
    const newItem: WorldElement = {
      id: `we-${Date.now()}`,
      bookId: itemData.bookId || activeBookId || DEMO_BOOK_ID,
      title: itemData.title || 'Elemen Semesta Baru',
      category: itemData.category || 'Aturan & Hukum Sosial',
      description: itemData.description || '',
      rules: itemData.rules || [],
    };
    setWorldElements(prev => [newItem, ...prev]);
    return newItem;
  }, [activeBookId]);

  const updateWorldElement = useCallback((id: string, updates: Partial<WorldElement>) => {
    setWorldElements(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  const deleteWorldElement = useCallback((id: string) => {
    setWorldElements(prev => prev.filter(w => w.id !== id));
  }, []);

  // Reality To Fiction Transformations CRUD
  const addTransformation = useCallback((tData: Partial<RealityTransformation>): RealityTransformation => {
    const newT: RealityTransformation = {
      id: `tf-${Date.now()}`,
      bookId: tData.bookId || activeBookId || DEMO_BOOK_ID,
      title: tData.title || 'Transformasi Memori Baru',
      realMemoryId: tData.realMemoryId,
      realEventTitle: tData.realEventTitle || tData.title || '',
      realEvent: tData.realEvent || tData.realDescription || '',
      realDescription: tData.realDescription || tData.realEvent || '',
      narrativeNonfiction: tData.narrativeNonfiction || '',
      autofiction: tData.autofiction || '',
      pureFiction: tData.pureFiction || '',
      transformationNotes: tData.transformationNotes || '',
      fictionalTitle: tData.fictionalTitle || '',
      fictionalSummary: tData.fictionalSummary || '',
      literaryTechnique: tData.literaryTechnique || '',
      privacyShieldStatus: tData.privacyShieldStatus || 'Dalam Proses Adaptasi',
      targetChapterId: tData.targetChapterId,
      targetSceneId: tData.targetSceneId,
      sensoryTransferred: tData.sensoryTransferred || [],
    };
    setTransformations(prev => [newT, ...prev]);
    return newT;
  }, [activeBookId]);

  const updateTransformation = useCallback((id: string, updates: Partial<RealityTransformation>) => {
    setTransformations(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransformation = useCallback((id: string) => {
    setTransformations(prev => prev.filter(t => t.id !== id));
  }, []);

  // Asset File Library CRUD
  const addAssetFile = useCallback((fileData: Partial<AssetFile>): AssetFile => {
    const newFile: AssetFile = {
      id: `asset-${Date.now()}`,
      bookId: fileData.bookId || activeBookId || DEMO_BOOK_ID,
      title: fileData.title || fileData.fileName || 'Aset Dokumen Baru',
      fileName: fileData.fileName || 'dokumen.dat',
      fileType: fileData.fileType || 'application/octet-stream',
      fileSize: fileData.fileSize || 0,
      dataUrlOrContent: fileData.dataUrlOrContent,
      linkedEntityType: fileData.linkedEntityType || 'book',
      linkedEntityId: fileData.linkedEntityId || activeBookId || DEMO_BOOK_ID,
      category: fileData.category || 'Referensi Umum',
      tags: fileData.tags || [],
      notes: fileData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAssetFiles(prev => [newFile, ...prev]);
    return newFile;
  }, [activeBookId]);

  const updateAssetFile = useCallback((id: string, updates: Partial<AssetFile>) => {
    setAssetFiles(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
  }, []);

  const deleteAssetFile = useCallback((id: string) => {
    setAssetFiles(prev => prev.filter(a => a.id !== id));
  }, []);

  // Writing Blocks CRUD
  const addWritingBlock = useCallback((blockData: Partial<WritingBlock>): WritingBlock => {
    const sceneId = blockData.sceneId || activeSceneId || 'sc-12';
    const currentSceneBlocks = writingBlocks.filter(b => b.sceneId === sceneId);
    const words = blockData.content ? blockData.content.trim().split(/\s+/).filter(Boolean).length : 0;
    const newBlock: WritingBlock = {
      id: `wb-${Date.now()}`,
      bookId: blockData.bookId || activeBookId || DEMO_BOOK_ID,
      chapterId: blockData.chapterId || activeChapterId || 'chap-6',
      sceneId,
      order: blockData.order || (currentSceneBlocks.length + 1),
      title: blockData.title || `Blok Tulisan ${currentSceneBlocks.length + 1}`,
      content: blockData.content || '',
      wordCount: words,
      blockType: blockData.blockType || 'prose',
      notes: blockData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWritingBlocks(prev => [...prev, newBlock]);
    return newBlock;
  }, [activeBookId, activeChapterId, activeSceneId, writingBlocks]);

  const updateWritingBlock = useCallback((id: string, updates: Partial<WritingBlock>) => {
    setWritingBlocks(prev => prev.map(b => {
      if (b.id !== id) return b;
      const content = updates.content !== undefined ? updates.content : b.content;
      const words = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
      return {
        ...b,
        ...updates,
        content,
        wordCount: words,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const deleteWritingBlock = useCallback((id: string) => {
    setWritingBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const reorderWritingBlocks = useCallback((sceneId: string, orderedIds: string[]) => {
    setWritingBlocks(prev => {
      const otherBlocks = prev.filter(b => b.sceneId !== sceneId);
      const sceneBlocksMap = new Map<string, WritingBlock>();
      prev.filter(b => b.sceneId === sceneId).forEach(b => sceneBlocksMap.set(b.id, b));
      const reordered: WritingBlock[] = [];
      orderedIds.forEach((id, index) => {
        const block = sceneBlocksMap.get(id);
        if (block) {
          reordered.push({ ...block, order: index + 1 });
        }
      });
      return [...otherBlocks, ...reordered];
    });
  }, []);

  // Book Bible, Style Guide, Publishing
  const updateBookBible = useCallback((bookId: string, updates: Partial<BookBible>) => {
    setBookBibles(prev => {
      const current = prev[bookId] || { id: `bible-${bookId}`, bookId, premis: '', glossary: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return { ...prev, [bookId]: { ...current, ...updates, updatedAt: new Date().toISOString() } };
    });
  }, []);

  const updateStyleGuide = useCallback((bookId: string, updates: Partial<StyleGuide>) => {
    setStyleGuides(prev => {
      const current = prev[bookId] || { id: `style-${bookId}`, bookId, pov: '', tense: '', tone: '', voice: '', dialogueStyle: '', termsUsage: '', spellingRules: '', capitalizationRules: '', namingRules: '', customRules: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return { ...prev, [bookId]: { ...current, ...updates, updatedAt: new Date().toISOString() } };
    });
  }, []);

  const updatePublishingData = useCallback((bookId: string, updates: Partial<PublishingData>) => {
    setPublishingData(prev => {
      const current = prev[bookId] || { id: `pub-${bookId}`, bookId, synopsis: '', bookDescription: '', authorBio: '', tagline: '', elevatorPitch: '', checklist: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return { ...prev, [bookId]: { ...current, ...updates, updatedAt: new Date().toISOString() } };
    });
  }, []);

  const togglePublishingChecklistItem = useCallback((bookId: string, itemId: string) => {
    setPublishingData(prev => {
      const current = prev[bookId];
      if (!current) return prev;
      const updatedChecklist = current.checklist.map(item => item.id === itemId ? { ...item, isDone: !item.isDone } : item);
      return { ...prev, [bookId]: { ...current, checklist: updatedChecklist, updatedAt: new Date().toISOString() } };
    });
  }, []);

  // Revision stages
  const toggleRevisionStage = useCallback((stageId: string) => {
    setRevisionStages(prev => prev.map(s => s.id === stageId ? { ...s, isCompleted: !s.isCompleted } : s));
  }, []);

  const addRevisionStage = useCallback((name: string, description: string) => {
    const newStage: RevisionStage = {
      id: `rev-${Date.now()}`,
      bookId: activeBookId || DEMO_BOOK_ID,
      name,
      order: revisionStages.length + 1,
      description,
      isCompleted: false,
    };
    setRevisionStages(prev => [...prev, newStage]);
  }, [activeBookId, revisionStages.length]);

  // Writing Goals & Calendar
  const updateWritingGoal = useCallback((bookId: string, goals: Partial<WritingGoal>) => {
    setWritingGoals(prev => ({
      ...prev,
      [bookId]: { ...(prev[bookId] || DEMO_WRITING_GOAL), ...goals },
    }));
  }, []);

  const addCalendarEvent = useCallback((evt: Partial<CalendarEventItem>): CalendarEventItem => {
    const newEvt: CalendarEventItem = {
      id: `cal-${Date.now()}`,
      bookId: evt.bookId || activeBookId || DEMO_BOOK_ID,
      title: evt.title || 'Jadwal Baru',
      date: evt.date || new Date().toISOString().slice(0, 10),
      type: evt.type || 'writing',
      notes: evt.notes || '',
      isDone: false,
    };
    setCalendarEvents(prev => [...prev, newEvt]);
    return newEvt;
  }, [activeBookId]);

  const toggleCalendarEvent = useCallback((id: string) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, isDone: !e.isDone } : e));
  }, []);

  const deleteCalendarEvent = useCallback((id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  // Genres & Statuses
  const addGenre = useCallback((genreData: Partial<Genre>): Genre => {
    const newGenre: Genre = {
      id: `g-${Date.now()}`,
      name: genreData.name || 'Genre Baru',
      description: genreData.description || '',
      parentId: genreData.parentId || null,
      icon: genreData.icon || 'BookOpen',
      color: genreData.color || '#6366f1',
      isFavorite: genreData.isFavorite || false,
      order: genres.length + 1,
    };
    setGenres(prev => [...prev, newGenre]);
    return newGenre;
  }, [genres.length]);

  const updateGenre = useCallback((id: string, updates: Partial<Genre>) => {
    setGenres(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGenre = useCallback((id: string) => {
    setGenres(prev => prev.filter(g => g.id !== id));
  }, []);

  const addBookStatus = useCallback((statusData: Partial<BookStatusConfig>) => {
    const newStatus: BookStatusConfig = {
      id: statusData.id || `status-${Date.now()}`,
      name: statusData.name || 'Status Baru',
      color: statusData.color || '#94a3b8',
      order: bookStatuses.length + 1,
    };
    setBookStatuses(prev => [...prev, newStatus]);
  }, [bookStatuses.length]);

  const updateBookStatus = useCallback((id: string, updates: Partial<BookStatusConfig>) => {
    setBookStatuses(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteBookStatus = useCallback((id: string) => {
    setBookStatuses(prev => prev.filter(s => s.id !== id));
  }, []);

  // Tags & Custom Fields
  const addTag = useCallback((name: string, color: string) => {
    setTags(prev => [...prev, { id: `tag-${Date.now()}`, name, color }]);
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  }, []);

  const addCustomField = useCallback((fieldData: Partial<CustomField>) => {
    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      bookId: fieldData.bookId || activeBookId || DEMO_BOOK_ID,
      targetEntity: fieldData.targetEntity || 'scene',
      name: fieldData.name || 'Field Kustom',
      type: fieldData.type || 'text',
      options: fieldData.options || [],
    };
    setCustomFields(prev => [...prev, newField]);
  }, [activeBookId]);

  const setCustomFieldValue = useCallback((entityId: string, fieldId: string, value: any) => {
    setCustomFieldValues(prev => {
      const existing = prev.find(cfv => cfv.entityId === entityId && cfv.fieldId === fieldId);
      if (existing) {
        return prev.map(cfv => cfv.entityId === entityId && cfv.fieldId === fieldId ? { ...cfv, value } : cfv);
      }
      return [...prev, { id: `cfv-${Date.now()}`, entityId, fieldId, value }];
    });
  }, []);

  // Trash recovery
  const restoreFromTrash = useCallback((trashId: string) => {
    const item = trash.find(t => t.id === trashId);
    if (!item) return;
    const { type, data } = item;

    if (type === 'book') setBooks(prev => [data, ...prev]);
    else if (type === 'part') setParts(prev => [...prev, data]);
    else if (type === 'chapter') setChapters(prev => [...prev, data]);
    else if (type === 'scene') setScenes(prev => [...prev, data]);
    else if (type === 'character') setCharacters(prev => [...prev, data]);
    else if (type === 'location') setLocations(prev => [...prev, data]);
    else if (type === 'timeline') setTimelineEvents(prev => [...prev, data]);
    else if (type === 'memory') setMemories(prev => [data, ...prev]);
    else if (type === 'research') setResearchItems(prev => [data, ...prev]);
    else if (type === 'idea') setIdeas(prev => [data, ...prev]);
    else if (type === 'note') setNotes(prev => [data, ...prev]);
    else if (type === 'quote') setQuotes(prev => [data, ...prev]);
    else if (type === 'theme') setThemes(prev => [...prev, data]);

    setTrash(prev => prev.filter(t => t.id !== trashId));
  }, [trash]);

  const permanentlyDelete = useCallback((trashId: string) => {
    setTrash(prev => prev.filter(t => t.id !== trashId));
  }, []);

  const emptyTrash = useCallback(() => {
    setTrash([]);
  }, []);

  // Author Profile
  const authorProfile = authorProfiles[0] || DEMO_AUTHOR_PROFILE;
  const updateAuthorProfile = useCallback((updates: Partial<AuthorProfile>) => {
    setAuthorProfiles(prev => [{ ...(prev[0] || DEMO_AUTHOR_PROFILE), ...updates }]);
  }, []);

  // Export / Import
  const exportProjectJson = useCallback((): string => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      books,
      parts,
      chapters,
      scenes,
      characters,
      characterRelationships,
      locations,
      timelineEvents,
      memories,
      researchItems,
      ideas,
      notes,
      quotes,
      themes,
      plotThreads,
      conflicts,
      emotionalPoints,
      bookBibles,
      styleGuides,
      revisionStages,
      writingGoals,
      writingLogs,
      publishingData,
      genres,
      tags,
    };
    return JSON.stringify(data, null, 2);
  }, [
    books,
    parts,
    chapters,
    scenes,
    characters,
    characterRelationships,
    locations,
    timelineEvents,
    memories,
    researchItems,
    ideas,
    notes,
    quotes,
    themes,
    plotThreads,
    conflicts,
    emotionalPoints,
    bookBibles,
    styleGuides,
    revisionStages,
    writingGoals,
    writingLogs,
    publishingData,
    genres,
    tags,
  ]);

  const exportBookManuscript = useCallback((format: 'txt' | 'markdown' | 'html', scope: 'full' | 'chapter' | 'scene' = 'full'): string => {
    if (!activeBook) return '';
    const bookParts = parts.filter(p => p.bookId === activeBook.id && !p.isTrashed).sort((a, b) => a.order - b.order);
    const bookChapters = chapters.filter(c => c.bookId === activeBook.id && !c.isTrashed).sort((a, b) => a.order - b.order);
    const bookScenes = scenes.filter(s => s.bookId === activeBook.id && !s.isTrashed).sort((a, b) => a.order - b.order);

    if (format === 'markdown') {
      let md = `# ${activeBook.title}\n`;
      if (activeBook.subtitle) md += `*${activeBook.subtitle}*\n\n`;
      md += `**Oleh: ${activeBook.authorName}**\n\n---\n\n`;

      if (bookParts.length > 0) {
        bookParts.forEach(part => {
          md += `# ${part.title}\n\n`;
          if (part.description) md += `*${part.description}*\n\n`;

          const partChapters = bookChapters.filter(c => c.partId === part.id);
          partChapters.forEach(chap => {
            md += `## ${chap.title}\n\n`;
            const chapScenes = bookScenes.filter(s => s.chapterId === chap.id);
            chapScenes.forEach(sc => {
              if (sc.title) md += `### ${sc.title}\n\n`;
              md += `${sc.content || ''}\n\n`;
            });
          });
        });
      } else {
        bookChapters.forEach(chap => {
          md += `## ${chap.title}\n\n`;
          const chapScenes = bookScenes.filter(s => s.chapterId === chap.id);
          chapScenes.forEach(sc => {
            if (sc.title) md += `### ${sc.title}\n\n`;
            md += `${sc.content || ''}\n\n`;
          });
        });
      }
      return md;
    }

    if (format === 'txt') {
      let txt = `${activeBook.title.toUpperCase()}\n`;
      if (activeBook.subtitle) txt += `${activeBook.subtitle}\n`;
      txt += `Penulis: ${activeBook.authorName}\n\n========================================\n\n`;

      bookChapters.forEach(chap => {
        txt += `\n[ ${chap.title.toUpperCase()} ]\n\n`;
        const chapScenes = bookScenes.filter(s => s.chapterId === chap.id);
        chapScenes.forEach(sc => {
          txt += `--- ${sc.title} ---\n\n`;
          txt += `${sc.content || ''}\n\n`;
        });
      });
      return txt;
    }

    // HTML / Printable view
    let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${activeBook.title}</title>
<style>
body { font-family: 'Lora', Georgia, serif; max-width: 750px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #1a1a1a; }
h1.book-title { text-align: center; font-size: 2.4rem; margin-top: 80px; margin-bottom: 8px; }
p.book-author { text-align: center; font-style: italic; font-size: 1.2rem; margin-bottom: 100px; }
h2.part-title { font-size: 1.8rem; margin-top: 60px; page-break-before: always; text-align: center; }
h3.chapter-title { font-size: 1.4rem; margin-top: 40px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
h4.scene-title { font-size: 1.1rem; color: #555; margin-top: 24px; }
p { text-indent: 1.5em; margin: 0 0 1em 0; }
</style>
</head>
<body>
<h1 class="book-title">${activeBook.title}</h1>
${activeBook.subtitle ? `<p style="text-align:center; color:#666;">${activeBook.subtitle}</p>` : ''}
<p class="book-author">${activeBook.authorName}</p>
`;

    bookChapters.forEach(chap => {
      html += `<h3 class="chapter-title">${chap.title}</h3>`;
      const chapScenes = bookScenes.filter(s => s.chapterId === chap.id);
      chapScenes.forEach(sc => {
        html += `<h4 class="scene-title">${sc.title}</h4>`;
        const paragraphs = (sc.content || '').split('\n').filter(p => p.trim());
        paragraphs.forEach(p => {
          html += `<p>${p}</p>`;
        });
      });
    });

    html += `</body></html>`;
    return html;
  }, [activeBook, parts, chapters, scenes]);

  const importProjectJson = useCallback((jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.books && Array.isArray(data.books)) {
        setBooks(data.books);
        if (data.parts) setParts(data.parts);
        if (data.chapters) setChapters(data.chapters);
        if (data.scenes) setScenes(data.scenes);
        if (data.characters) setCharacters(data.characters);
        if (data.characterRelationships) setCharacterRelationships(data.characterRelationships);
        if (data.locations) setLocations(data.locations);
        if (data.timelineEvents) setTimelineEvents(data.timelineEvents);
        if (data.memories) setMemories(data.memories);
        if (data.researchItems) setResearchItems(data.researchItems);
        if (data.ideas) setIdeas(data.ideas);
        if (data.notes) setNotes(data.notes);
        if (data.quotes) setQuotes(data.quotes);
        if (data.themes) setThemes(data.themes);
        if (data.plotThreads) setPlotThreads(data.plotThreads);
        if (data.conflicts) setConflicts(data.conflicts);
        if (data.emotionalPoints) setEmotionalPoints(data.emotionalPoints);
        if (data.bookBibles) setBookBibles(data.bookBibles);
        if (data.styleGuides) setStyleGuides(data.styleGuides);
        if (data.revisionStages) setRevisionStages(data.revisionStages);
        if (data.writingGoals) setWritingGoals(data.writingGoals);
        if (data.writingLogs) setWritingLogs(data.writingLogs);
        if (data.publishingData) setPublishingData(data.publishingData);
        if (data.genres) setGenres(data.genres);
        if (data.tags) setTags(data.tags);
        setActiveBookId(data.books[0]?.id || null);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to parse JSON for import', e);
      return false;
    }
  }, []);

  const resetToDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setBooks([DEMO_BOOK]);
    setParts(DEMO_PARTS);
    setChapters(DEMO_CHAPTERS);
    setScenes(DEMO_SCENES);
    setCharacters(DEMO_CHARACTERS);
    setCharacterRelationships(DEMO_RELATIONSHIPS);
    setLocations(DEMO_LOCATIONS);
    setTimelineEvents(DEMO_TIMELINE_EVENTS);
    setMemories(DEMO_MEMORIES);
    setResearchItems(DEMO_RESEARCH);
    setIdeas(DEMO_IDEAS);
    setNotes(DEMO_NOTES);
    setQuotes(DEMO_QUOTES);
    setThemes(DEMO_THEMES);
    setPlotThreads(DEMO_PLOT_THREADS);
    setConflicts(DEMO_CONFLICTS);
    setEmotionalPoints(DEMO_EMOTIONAL_POINTS);
    setBookBibles({ [DEMO_BOOK_ID]: DEMO_BOOK_BIBLE });
    setStyleGuides({ [DEMO_BOOK_ID]: DEMO_STYLE_GUIDE });
    setRevisionStages(DEMO_REVISION_STAGES);
    setWritingGoals({ [DEMO_BOOK_ID]: DEMO_WRITING_GOAL });
    setWritingLogs(DEMO_WRITING_LOGS);
    setCalendarEvents(DEMO_CALENDAR_EVENTS);
    setPublishingData({ [DEMO_BOOK_ID]: DEMO_PUBLISHING_DATA });
    setAuthorProfiles([DEMO_AUTHOR_PROFILE]);
    setCustomFields(DEMO_CUSTOM_FIELDS);
    setCustomFieldValues(DEMO_CUSTOM_FIELD_VALUES);
    setWorldElements(DEMO_WORLDBUILDING_ELEMENTS);
    setPlotPoints(DEMO_PLOT_POINTS);
    setTransformations(DEMO_TRANSFORMATIONS);
    setAssetFiles(DEMO_ASSET_FILES);
    setWritingBlocks(DEMO_WRITING_BLOCKS);
    setTodayWordCount(750);
    setGenres(INITIAL_GENRES);
    setTags(INITIAL_TAGS);
    setTrash([]);
    setActiveBookId(DEMO_BOOK_ID);
    setActiveChapterId('chap-6');
    setActiveSceneId('sc-12');
  }, []);

  const exportManuscriptMarkdown = useCallback(() => {
    return exportBookManuscript('markdown', 'full');
  }, [exportBookManuscript]);

  const exportManuscriptText = useCallback(() => {
    return exportBookManuscript('txt', 'full');
  }, [exportBookManuscript]);

  const exportFullProjectJSON = useCallback(() => {
    return exportProjectJson();
  }, [exportProjectJson]);

  const importFullProjectJSON = useCallback((jsonStr: string) => {
    return importProjectJson(jsonStr);
  }, [importProjectJson]);

  const resetToInitialData = useCallback(() => {
    resetToDemoData();
  }, [resetToDemoData]);

  const value = {
    activeView,
    setActiveView,
    activeBookId,
    setActiveBookId,
    activeChapterId,
    setActiveChapterId,
    activeSceneId,
    setActiveSceneId,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    themeMode,
    setThemeMode,
    accentColor,
    setAccentColor,
    wordsPerPage,
    setWordsPerPage,
    zenMode,
    setZenMode,
    autosaveStatus,
    triggerAutosave,
    activeBook,
    currentBook: activeBook || books[0],
    activeChapter,
    activeScene,
    books,
    bookStatuses,
    bookTypes,
    genres,
    tags,
    parts,
    chapters,
    scenes,
    characters,
    characterRelationships,
    locations,
    timelineEvents,
    memories,
    researchItems,
    ideas,
    notes,
    quotes,
    themes,
    plotThreads,
    plotPoints,
    conflicts,
    emotionalPoints,
    bookBibles,
    styleGuides,
    revisionStages,
    writingGoals,
    writingLogs,
    calendarEvents,
    worldbuildingItems,
    worldElements,
    transformations,
    assetFiles,
    writingBlocks,
    publishingData,
    authorProfiles,
    customFields,
    customFieldValues,
    versionSnapshots,
    snapshots: versionSnapshots,
    trash,
    addAssetFile,
    updateAssetFile,
    deleteAssetFile,
    addWritingBlock,
    updateWritingBlock,
    deleteWritingBlock,
    reorderWritingBlocks,
    totalWords: stats.totalWords,
    streak: stats.streakDays,
    dailyGoal: writingGoals[activeBookId || DEMO_BOOK_ID]?.dailyWordTarget || 500,
    todayWordCount,
    setTodayWordCount,
    addBook,
    duplicateBook,
    updateBook,
    deleteBook,
    archiveBook,
    addPart,
    updatePart,
    deletePart,
    addChapter,
    updateChapter,
    deleteChapter,
    addScene,
    updateScene,
    deleteScene,
    updateSceneContent,
    createVersionSnapshot,
    saveSceneSnapshot,
    createSnapshot,
    restoreSnapshot,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addRelationship,
    deleteRelationship,
    addCharacterRelationship,
    deleteCharacterRelationship,
    addLocation,
    updateLocation,
    deleteLocation,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addMemory,
    updateMemory,
    deleteMemory,
    addTransformation,
    updateTransformation,
    deleteTransformation,
    addResearchItem,
    updateResearchItem,
    deleteResearchItem,
    addIdea,
    updateIdea,
    deleteIdea,
    convertIdea,
    convertIdeaToEntity,
    addNote,
    updateNote,
    deleteNote,
    addQuote,
    updateQuote,
    deleteQuote,
    addTheme,
    updateTheme,
    deleteTheme,
    addPlotThread,
    updatePlotThread,
    deletePlotThread,
    addPlotPoint,
    updatePlotPoint,
    deletePlotPoint,
    addConflict,
    updateConflict,
    deleteConflict,
    addEmotionalPoint,
    updateEmotionalPoint,
    deleteEmotionalPoint,
    addWorldElement,
    updateWorldElement,
    deleteWorldElement,
    updateBookBible,
    updateStyleGuide,
    updatePublishingData,
    togglePublishingChecklistItem,
    toggleRevisionStage,
    addRevisionStage,
    updateWritingGoal,
    addCalendarEvent,
    toggleCalendarEvent,
    deleteCalendarEvent,
    addGenre,
    updateGenre,
    deleteGenre,
    addBookStatus,
    updateBookStatus,
    deleteBookStatus,
    addTag,
    deleteTag,
    addCustomField,
    setCustomFieldValue,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
    authorProfile,
    updateAuthorProfile,
    exportProjectJson,
    exportBookManuscript,
    exportManuscriptMarkdown,
    exportManuscriptText,
    exportFullProjectJSON,
    importProjectJson,
    importFullProjectJSON,
    resetToDemoData,
    resetToInitialData,
    stats,
  };

  return (
    <StoryOSContext.Provider value={value}>
      {children}
    </StoryOSContext.Provider>
  );
};

export const useStoryOS = () => {
  const context = useContext(StoryOSContext);
  if (!context) {
    throw new Error('useStoryOS must be used within a StoryOSProvider');
  }
  return context;
};
