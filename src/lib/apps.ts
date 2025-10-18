import { Folder, Globe, Settings, ActivitySquare, FileText, Sheet, HardDrive } from 'lucide-react';
import type { ComponentType } from 'react';
import Browser from '@/components/apps/Browser';
import SettingsApp from '@/components/apps/Settings';
import Finder from '@/components/apps/Finder';
import TaskManager from '@/components/apps/TaskManager';
import WordProcessor from '@/components/apps/WordProcessor';
import Spreadsheet from '@/components/apps/Spreadsheet';
import Computer from '@/components/apps/Computer';

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
    icon: Folder,
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
    id: 'computer',
    name: 'Computer',
    icon: HardDrive,
    component: Computer,
    defaultSize: [640, 480],
  }
];
