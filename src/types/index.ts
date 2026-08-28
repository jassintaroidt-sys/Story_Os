export type BookStatusId = 
  | 'idea'
  | 'planning'
  | 'research'
  | 'outlining'
  | 'writing'
  | 'revising'
  | 'editing'
  | 'proofreading'
  | 'final'
  | 'ready_to_publish'
  | 'published'
  | 'archived';

export interface BookStatusConfig {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  icon?: string;
  color: string;
  isFavorite?: boolean;
  order?: number;
}

export interface BookType {
  id: string;
  name: string;
  description: string;
  recommendedModules: string[];
}

export interface CustomField {
  id: string;
  bookId: string;
  targetEntity: 'book' | 'chapter' | 'scene' | 'character' | 'location' | 'research' | 'idea';
  name: string;
  type: 'text' | 'number' | 'dropdown' | 'boolean';
  options?: string[];
}

export interface CustomFieldValue {
  id: string;
  entityId: string;
  fieldId: string;
  value: string | number | boolean;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  authorName: string;
  penName?: string;
  author?: string; // alias for authorName
  description: string;
  synopsis?: string; // alias for description/premise
  premis?: string;
  premise?: string; // alias for premis
  logline?: string;
  bookGoal?: string;
  coverUrl?: string;
  bookTypeId: string;
  genre?: string; // primary genre name
  genreIds: string[];
  subgenres?: string[];
  tags: string[];
  status: string;
  progress: number; // 0 - 100
  targetWords: number;
  targetWordCount?: number; // alias for targetWords
  targetPages: number;
  targetChapters: number;
  targetDate?: string;
  targetCompletionDate?: string;
  dailyWordTarget?: number;
  wordsPerPage: number; // default 250
  targetAudience?: string;
  audienceAgeRange?: string;
  audienceType?: string;
  problemsAddressed?: string;
  bookBenefits?: string;
  styleGuide?: StyleGuide;
  totalWords?: number;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  isTrashed?: boolean;
}

export interface Part {
  id: string;
  bookId: string;
  number: number;
  title: string;
  description?: string;
  objective?: string;
  theme?: string;
  summary?: string;
  targetWords?: number;
  status: string;
  notes?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface Chapter {
  id: string;
  bookId: string;
  partId?: string | null;
  number: number;
  title: string;
  summary?: string;
  chapterObjective?: string;
  keyIdea?: string;
  conflict?: string;
  theme?: string;
  characterIds: string[];
  locationIds: string[];
  time?: string;
  pov?: string;
  mainEmotion?: string;
  keyEvents?: string;
  notes?: string;
  totalWords?: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface Scene {
  id: string;
  bookId: string;
  partId?: string | null;
  chapterId: string;
  number: number;
  title: string;
  summary?: string;
  objective?: string;
  characterIds: string[];
  locationIds: string[];
  date?: string;
  time?: string;
  pov?: string;
  conflict?: string;
  characterGoal?: string;
  obstacle?: string;
  outcome?: string;
  emotion?: string;
  mood?: string;
  theme?: string;
  symbol?: string;
  foreshadowing?: string;
  keyInfo?: string;
  keyDialogue?: string;
  continuityNotes?: string;
  content: string; // Draft content for this scene
  wordCount: number;
  writingBlockIds?: string[];
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface WritingBlock {
  id: string;
  bookId?: string;
  chapterId?: string;
  sceneId: string;
  order: number;
  title?: string;
  content: string;
  wordCount: number;
  blockType?: 'prose' | 'dialogue' | 'heading' | 'scene_break' | 'quote';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CharacterType = 'real_person' | 'fictional' | 'inspired_by_real' | 'composite' | 'unknown';

export interface Character {
  id: string;
  bookId: string;
  name: string;
  nickname?: string;
  pseudonym?: string;
  storyName?: string;
  fictionName?: string;
  type: CharacterType;
  role?: CharacterRole;
  age?: string;
  birthDate?: string;
  occupation?: string;
  personality?: string;
  appearance?: string;
  physicalAppearance?: string;
  background?: string;
  goal?: string;
  want?: string;
  need?: string;
  wound?: string;
  lieBelieved?: string;
  fears?: string;
  strengths?: string;
  weaknesses?: string;
  habits?: string;
  speechMannerisms?: string;
  characterArc?: string;
  secrets?: string;
  conflicts?: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface CharacterRelationship {
  id: string;
  bookId: string;
  sourceCharacterId: string;
  targetCharacterId: string;
  characterId1?: string;
  characterId2?: string;
  relationshipType: string;
  tensionLevel?: string;
  status?: string;
  intensity: number; // 1 - 10
  startOfRelationship?: string;
  changeOverTime?: string;
  endOfRelationship?: string;
  notes?: string;
}

export interface Location {
  id: string;
  bookId: string;
  name: string;
  type?: string;
  description?: string;
  atmosphere?: string;
  visualLook?: string;
  sensorySmell?: string;
  sensorySound?: string;
  sensoryLight?: string;
  emotionalSignificance?: string;
  history?: string;
  charactersVisited?: string[];
  notes?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export type TimelineDateType = 'exact' | 'approximate' | 'year_only' | 'period' | 'relative_age' | 'unknown';

export interface TimelineEvent {
  id: string;
  bookId: string;
  dateType: TimelineDateType;
  dateValue?: string;
  year?: string;
  period?: string;
  title: string;
  description: string;
  characterIds: string[];
  locationId?: string;
  emotion?: string;
  emotionalCharge?: string;
  impact?: string;
  notes?: string;
  protagonistAge?: number | string;
  isTurningPoint?: boolean;
  orderReal: number; // Timeline Kejadian (true chronology)
  orderStory: number; // Timeline Cerita (manuscript order)
  orderIndex?: number;
  linkedSceneId?: string;
  linkedChapterId?: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export type MemoryPrivacyLevel = 'super_private' | 'sensitive' | 'development_only' | 'ready_for_book' | 'published' | 'public';

export interface MemoryVersions {
  original: string;
  nonfiction: string;
  autofiction: string;
  fiction: string;
}

export interface Memory {
  id: string;
  bookId: string;
  title: string;
  period?: string;
  year?: string;
  location?: string;
  peopleInvolved?: string;
  whatHappened: string;
  whatIsRemembered?: string;
  feelings?: string;
  emotionalCharge?: string;
  status?: string;
  sensoryVisual?: string;
  sensorySound?: string;
  sensorySmell?: string;
  rememberedDialogue?: string;
  lessonsLearned?: string;
  impact?: string;
  personalNotes?: string;
  potentialChapter?: string;
  potentialScene?: string;
  publicationStatus?: string;
  privacyLevel: MemoryPrivacyLevel;
  versions: MemoryVersions;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface ResearchItem {
  id: string;
  bookId: string;
  title: string;
  source: string;
  author?: string;
  url?: string;
  date?: string;
  category: string;
  summary: string;
  keyFacts?: string[];
  quoteExcerpt?: string;
  notes?: string;
  credibility: 'high' | 'medium' | 'low' | 'unverified';
  chapterIds: string[];
  sceneIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export type IdeaCategory = 
  | 'story_idea'
  | 'chapter'
  | 'scene'
  | 'character'
  | 'dialogue'
  | 'title'
  | 'ending'
  | 'opening'
  | 'conflict'
  | 'theme'
  | 'symbol'
  | 'quote'
  | 'question'
  | 'snippet'
  | 'custom';

export interface Idea {
  id: string;
  bookId: string;
  title: string;
  content: string;
  category: IdeaCategory;
  customCategoryName?: string;
  tags: string[];
  status: 'inbox' | 'used' | 'archived';
  convertedTo?: {
    type: 'chapter' | 'scene' | 'character' | 'note' | 'theme' | 'research';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface Note {
  id: string;
  bookId: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface QuoteItem {
  id: string;
  bookId: string;
  quoteText: string;
  source?: string;
  speaker?: string;
  context?: string;
  chapterId?: string;
  sceneId?: string;
  themeId?: string;
  copyrightStatus?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface ThemeItem {
  id: string;
  bookId: string;
  name: string;
  description: string;
  statement?: string;
  isCentralTheme?: boolean;
  motifs?: string[];
  evolution?: string;
  color: string;
  progressionNotes?: string;
  linkedPartIds: string[];
  linkedChapterIds: string[];
  linkedSceneIds: string[];
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface PlotThread {
  id: string;
  bookId: string;
  title: string;
  type: 'main_plot' | 'subplot' | 'character_arc' | 'conflict_arc';
  beginning: string;
  development: string;
  conflict: string;
  climax: string;
  resolution: string;
  linkedChapterIds: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface ConflictItem {
  id: string;
  bookId: string;
  title: string;
  type: 'internal' | 'external' | 'interpersonal' | 'societal' | 'environmental' | 'other';
  description: string;
  involvedCharacterIds: string[];
  resolution?: string;
  status: 'open' | 'escalating' | 'resolved';
  linkedChapterId?: string;
  linkedSceneId?: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface EmotionalPoint {
  id: string;
  bookId: string;
  entityType: 'scene' | 'chapter' | 'timeline' | 'character';
  entityId: string;
  label: string;
  emotionName: string;
  intensity: number; // 1 to 10
  valence: number; // -5 (deep melancholy/tension) to +5 (ecstasy/peace)
  color: string;
  notes?: string;
}

export interface BookBible {
  id: string;
  bookId: string;
  premis: string;
  worldRules?: string;
  consistencyNotes?: string;
  glossary: Array<{ id: string; term: string; definition: string; category: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface StyleGuide {
  id: string;
  bookId: string;
  pov: string;
  pointOfView?: string;
  tense: string;
  tone: string;
  toneOfVoice?: string;
  voice: string;
  dialogueStyle: string;
  termsUsage: string;
  spellingRules: string;
  puebiRules?: string[];
  capitalizationRules: string;
  namingRules: string;
  customRules: string;
  glossary?: Array<{ term: string; definition: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface RevisionStage {
  id: string;
  bookId: string;
  name: string;
  title?: string;
  order: number;
  stageNumber?: number;
  description: string;
  isCompleted: boolean;
}

export interface VersionSnapshot {
  id: string;
  bookId: string;
  entityType?: 'chapter' | 'scene' | 'book';
  entityId?: string;
  versionName?: string;
  label?: string;
  content?: string;
  wordCount: number;
  changeNotes?: string;
  createdAt: string;
}

export interface WritingGoal {
  dailyWordTarget: number;
  weeklyWordTarget: number;
  monthlyWordTarget: number;
  dailyMinutesTarget: number;
}

export interface WritingLog {
  date: string; // YYYY-MM-DD
  wordsWritten: number;
  minutesWritten: number;
  bookId: string;
}

export interface CalendarEventItem {
  id: string;
  bookId: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'writing' | 'deadline' | 'revision' | 'research' | 'chapter_target' | 'manuscript_target';
  notes?: string;
  isDone: boolean;
}

export interface AssetFile {
  id: string;
  bookId: string;
  title?: string;
  fileName: string;
  fileType: string;
  fileSize: number; // bytes
  dataUrlOrContent?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  isTrashed?: boolean;
}

export interface WorldbuildingItem {
  id: string;
  bookId: string;
  name: string;
  category: 'world' | 'country' | 'city' | 'organization' | 'culture' | 'language' | 'religion' | 'politics' | 'technology' | 'magic' | 'history' | 'lore';
  description: string;
  rules?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isTrashed?: boolean;
}

export interface PublishingItem {
  id: string;
  category: 'manuscript' | 'front_matter' | 'back_matter' | 'marketing';
  title: string;
  isDone: boolean;
  notes?: string;
}

export interface PublishingData {
  id: string;
  bookId: string;
  synopsis: string;
  bookDescription: string;
  authorBio: string;
  tagline: string;
  elevatorPitch: string;
  isbn?: string;
  targetPublisher?: string;
  checklist: PublishingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthorProfile {
  id: string;
  name: string;
  penName?: string;
  bio: string;
  photoUrl?: string;
  website?: string;
  email?: string;
  socialMedia?: string;
  notes?: string;
}

export interface TagItem {
  id: string;
  name: string;
  color: string;
}

// Aliases and UI helpers
export type CharacterRole = 'protagonist' | 'antagonist' | 'deuteragonist' | 'mentor' | 'supporting' | 'minor' | 'mentioned';
export type IdeaStatus = 'inbox' | 'used' | 'archived';
export type IdeaItem = Idea;
export type MemoryArchive = Memory;
export type NoteItem = Note;
export type PlotPoint = {
  id: string;
  bookId?: string;
  act?: number;
  stageName?: string;
  beatName?: string;
  title?: string;
  summary?: string;
  description?: string;
  internalConflict?: string;
  externalConflict?: string;
  stakes?: string;
  tensionLevel?: number; // 1-10
  chapterId?: string;
  sceneId?: string;
  isCompleted?: boolean;
};
export type RealityTransformation = {
  id: string;
  bookId?: string;
  title?: string;
  realMemoryId?: string;
  realEventTitle?: string;
  realDescription?: string;
  realEvent?: string;
  narrativeNonfiction?: string;
  autofiction?: string;
  pureFiction?: string;
  transformationNotes?: string;
  fictionalTitle?: string;
  fictionalSummary?: string;
  literaryTechnique?: string;
  privacyShieldStatus?: string;
  targetChapterId?: string;
  targetSceneId?: string;
  sensoryTransferred?: string[];
};
export type SceneStatus = 'idea' | 'outline' | 'draft' | 'first_draft' | 'revision' | 'revised' | 'polished' | 'final' | string;
export type WorldElement = {
  id: string;
  bookId?: string;
  title: string;
  category: string;
  description: string;
  rules?: string[];
};

export type ViewMode =
  | 'dashboard'
  | 'books'
  | 'books_manager'
  | 'book_dashboard'
  | 'writing_studio'
  | 'structure'
  | 'manuscript'
  | 'manuskrip'
  | 'characters'
  | 'locations'
  | 'timeline'
  | 'memories'
  | 'memories_archive'
  | 'reality_to_fiction'
  | 'ideas'
  | 'ideas_bank'
  | 'notes_quotes'
  | 'research'
  | 'research_vault'
  | 'file_library'
  | 'themes'
  | 'themes_motifs'
  | 'plot_conflicts'
  | 'emotions'
  | 'emotional_journey'
  | 'worldbuilding'
  | 'book_bible'
  | 'revisions'
  | 'revisions_center'
  | 'analytics'
  | 'calendar'
  | 'calendar_schedule'
  | 'publishing'
  | 'publishing_center'
  | 'backup_export'
  | 'genres'
  | 'genres_manager'
  | 'tags'
  | 'tags_manager'
  | 'custom_fields'
  | 'author_profile'
  | 'archive'
  | 'trash'
  | 'settings'
  | 'system_blueprint'
  | 'blueprint';

