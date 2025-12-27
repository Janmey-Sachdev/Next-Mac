
import { Globe, Settings, ActivitySquare, FileText, Sheet, HardDrive, Image, PenTool, Terminal as TerminalIcon, Camera, Video, Music, ShoppingCart, Trash2, Dices, Puzzle, Swords, Shield, Ghost, Crosshair, Crown, Gamepad2, Heart, Skull, Sparkles, Code2 } from 'lucide-react';
import type { ComponentType } from 'react';
import Browser from '@/components/apps/Browser';
import SettingsApp from '@/components/apps/Settings';
import Finder from '@/components/apps/Finder';
import TaskManager from '@/components/apps/TaskManager';
import WordProcessor from '@/components/apps/WordProcessor';
import Spreadsheet from '@/components/apps/Spreadsheet';
import Computer from '@/components/apps/Computer';
import Photos from '@/components/apps/Photos';
import ImageEditor from '@/components/apps/ImageEditor';
import Terminal from '@/components/apps/Terminal';
import CameraApp from '@/components/apps/Camera';
import VideoPlayer from '@/components/apps/VideoPlayer';
import MusicPlayer from '@/components/apps/MusicPlayer';
import { AppleLogo } from '@/components/system/AppleLogo';
import AppStore from '@/components/apps/AppStore';
import Trash from '@/components/apps/Trash';
import CodeEditor from '@/components/apps/CodeEditor';


export interface File {
  id: string;
  name: string;
  type: string;
  content: string;
}

export interface App {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType<{ file?: File }>;
  defaultSize?: [number, number];
}

export const APPS: App[] = [
  {
    id: 'finder',
    name: 'Finder',
    icon: AppleLogo,
    component: Finder,
    defaultSize: [640, 480],
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: Globe,
    component: Browser,
    defaultSize: [1024, 768],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    component: SettingsApp,
    defaultSize: [720, 540],
  },
   {
    id: 'terminal',
    name: 'Terminal',
    icon: TerminalIcon,
    component: Terminal,
    defaultSize: [640, 400],
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    icon: ActivitySquare,
    component: TaskManager,
    defaultSize: [400, 500],
  },
  {
    id: 'writer',
    name: 'Writer',
    icon: FileText,
    component: WordProcessor,
    defaultSize: [800, 600],
  },
  {
    id: 'sheets',
    name: 'Sheets',
    icon: Sheet,
    component: Spreadsheet,
    defaultSize: [960, 720],
  },
  {
    id: 'editor',
    name: 'Code Editor',
    icon: Code2,
    component: CodeEditor,
    defaultSize: [960, 720],
  },
  {
    id: 'computer',
    name: 'Computer',
    icon: HardDrive,
    component: Computer,
    defaultSize: [640, 480],
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: Image,
    component: Photos,
    defaultSize: [800, 600],
  },
  {
    id: 'edit',
    name: 'Edit',
    icon: PenTool,
    component: ImageEditor,
    defaultSize: [1024, 768],
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: Camera,
    component: CameraApp,
    defaultSize: [640, 480]
  },
  {
    id: 'video',
    name: 'Video Player',
    icon: Video,
    component: VideoPlayer,
    defaultSize: [800, 600]
  },
  {
    id: 'music',
    name: 'Music Player',
    icon: Music,
    component: MusicPlayer,
    defaultSize: [480, 600]
  },
  {
    id: 'app-store',
    name: 'App Store',
    icon: ShoppingCart,
    component: AppStore,
    defaultSize: [960, 720]
  },
  {
    id: 'trash',
    name: 'Trash',
    icon: Trash2,
    component: Trash,
    defaultSize: [640, 480],
  },
  // Games
  {
    id: 'game-dice',
    name: 'Dice Roller',
    icon: Dices,
    component: Computer, // Placeholder component
    defaultSize: [400, 300],
  },
  {
    id: 'game-puzzle',
    name: 'Jigsaw',
    icon: Puzzle,
    component: Computer,
    defaultSize: [600, 600],
  },
  {
    id: 'game-swords',
    name: 'Blade Master',
    icon: Swords,
    component: Computer,
    defaultSize: [800, 600],
  },
  {
    id: 'game-shield',
    name: 'Castle Defense',
    icon: Shield,
    component: Computer,
    defaultSize: [800, 600],
  },
  {
    id: 'game-ghost',
    name: 'Spooky Manor',
    icon: Ghost,
    component: Computer,
    defaultSize: [720, 480],
  },
  {
    id: 'game-crosshair',
    name: 'Target Practice',
    icon: Crosshair,
    component: Computer,
    defaultSize: [800, 600],
  },
  {
    id: 'game-crown',
    name: 'Kingdoms',
    icon: Crown,
    component: Computer,
    defaultSize: [1024, 768],
  },
  {
    id: 'game-gamepad',
    name: 'Retro Arcade',
    icon: Gamepad2,
    component: Computer,
    defaultSize: [640, 480],
  },
  {
    id: 'game-heart',
    name: 'Card Sharps',
    icon: Heart,
    component: Computer,
    defaultSize: [600, 400],
  },
  {
    id: 'game-skull',
    name: 'Dungeon Crawler',
    icon: Skull,
    component: Computer,
    defaultSize: [800, 600],
  },
];
