import { Folder, Globe, Settings, Terminal, ActivitySquare } from 'lucide-react';
import type { ComponentType } from 'react';
import Browser from '@/components/apps/Browser';
import SettingsApp from '@/components/apps/Settings';
import Finder from '@/components/apps/Finder';
import TaskManager from '@/components/apps/TaskManager';

export interface App {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
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
  }
];
