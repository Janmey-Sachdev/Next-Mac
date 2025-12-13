'use client';
import type { App, File } from '@/lib/apps';
import { APPS } from '@/lib/apps';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext, useReducer, useState, useEffect, useCallback } from 'react';
import { useSound } from './SoundContext';

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  state: 'minimized' | 'maximized' | 'normal';
  file?: File;
}

interface DesktopState {
  windows: WindowInstance[];
  focusedWindow: string | null;
  lastZIndex: number;
  desktopFiles: File[];
  trashedFiles: File[];
  password?: string;
  shutdownInitiated: boolean;
}

type Action =
  | { type: 'OPEN'; payload: { appId: string; position?: {x: number, y: number}, size?: {width: number, height: number}, file?: File } }
  | { type: 'CLOSE'; payload: string }
  | { type: 'FOCUS'; payload: string }
  | { type: 'MINIMIZE'; payload: string }
  | { type: 'TOGGLE_MAXIMIZE'; payload: string }
  | { type: 'UPDATE_WINDOW'; payload: Partial<WindowInstance> & { id: string } }
  | { type: 'TILE_WINDOWS' }
  | { type: 'ADD_DESKTOP_FILES'; payload: File[] }
  | { type: 'UPDATE_DESKTOP_FILE'; payload: File }
  | { type: 'CREATE_FOLDER' }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'RESTORE_FILE'; payload: string }
  | { type: 'PERMANENTLY_DELETE_FILE'; payload: string }
  | { type: 'CHANGE_PASSWORD'; payload: string }
  | { type: 'SHUTDOWN' };


const initialState: DesktopState = {
  windows: [],
  focusedWindow: null,
  lastZIndex: 100,
  desktopFiles: [],
  trashedFiles: [],
  password: 'PASSWORD',
  shutdownInitiated: false,
};

const desktopReducer = (state: DesktopState, action: Action): DesktopState => {
  switch (action.type) {
    case 'OPEN': {
      const app = APPS.find((a) => a.id === action.payload.appId);
      if (!app) return state;

      // Check if a single-instance app is already open
      const singleInstanceApps = ['finder', 'trash', 'app-store', 'settings'];
      if(singleInstanceApps.includes(app.id)) {
        const existingWindow = state.windows.find(w => w.appId === app.id);
        if (existingWindow) {
          const newZIndex = state.lastZIndex + 1;
           return {
            ...state,
            windows: state.windows.map((w) =>
              w.id === existingWindow.id ? { ...w, zIndex: newZIndex, state: 'normal' } : w
            ),
            focusedWindow: existingWindow.id,
            lastZIndex: newZIndex,
          };
        }
      }


      const newWindow: WindowInstance = {
        id: `${app.id}-${Date.now()}`,
        appId: app.id,
        title: action.payload.file ? `${action.payload.file.name} - ${app.name}` : app.name,
        position: action.payload.position || { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
        size: action.payload.size || { width: app.defaultSize?.[0] || 800, height: app.defaultSize?.[1] || 600 },
        zIndex: state.lastZIndex + 1,
        state: 'normal',
        file: action.payload.file,
      };

      return {
        ...state,
        windows: [...state.windows, newWindow],
        focusedWindow: newWindow.id,
        lastZIndex: newWindow.zIndex,
      };
    }
    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.payload),
        focusedWindow: state.focusedWindow === action.payload ? null : state.focusedWindow,
      };
    case 'FOCUS': {
      if (state.focusedWindow === action.payload) return state;
      const newZIndex = state.lastZIndex + 1;
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload ? { ...w, zIndex: newZIndex, state: 'normal' } : w
        ),
        focusedWindow: action.payload,
        lastZIndex: newZIndex,
      };
    }
    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload ? { ...w, state: 'minimized' } : w
        ),
        focusedWindow: state.focusedWindow === action.payload ? null : state.focusedWindow,
      };
    case 'TOGGLE_MAXIMIZE': {
       const window = state.windows.find(w => w.id === action.payload);
       if (!window) return state;
       
       const isMaximized = window.state === 'maximized';

       return {
         ...state,
         windows: state.windows.map(w => w.id === action.payload ? { ...w, state: isMaximized ? 'normal' : 'maximized' } : w)
       }
    }
    case 'UPDATE_WINDOW': {
        return {
            ...state,
            windows: state.windows.map(w => w.id === action.payload.id ? { ...w, ...action.payload } : w)
        }
    }
    case 'TILE_WINDOWS': {
        const visibleWindows = state.windows.filter(w => w.state === 'normal');
        const count = visibleWindows.length;
        if (count === 0) return state;

        const { innerWidth, innerHeight } = window;
        const topBarHeight = 32;
        const dockHeight = 80;
        const availableHeight = innerHeight - topBarHeight - dockHeight;

        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);

        const tileWidth = innerWidth / cols;
        const tileHeight = availableHeight / rows;

        let windowIndex = 0;
        return {
            ...state,
            windows: state.windows.map(w => {
                if(w.state !== 'normal') return w;
                
                const rowIndex = Math.floor(windowIndex / cols);
                const colIndex = windowIndex % cols;
                
                windowIndex++;

                return {
                    ...w,
                    position: { x: colIndex * tileWidth, y: rowIndex * tileHeight + topBarHeight },
                    size: { width: tileWidth, height: tileHeight },
                }
            })
        }
    }
     case 'ADD_DESKTOP_FILES': {
      const newFiles = action.payload.filter(
        (file) => !state.desktopFiles.some((df) => df.id === file.id)
      );
      return {
        ...state,
        desktopFiles: [...state.desktopFiles, ...newFiles],
      };
    }
    case 'UPDATE_DESKTOP_FILE': {
        return {
            ...state,
            desktopFiles: state.desktopFiles.map(df => 
                df.id === action.payload.id ? action.payload : df
            ),
        };
    }
    case 'CREATE_FOLDER': {
      let folderNumber = 1;
      let folderName = 'New Folder';
      const existingNames = new Set(state.desktopFiles.map(f => f.name));
      while(existingNames.has(folderName)) {
        folderNumber++;
        folderName = `New Folder ${folderNumber}`;
      }

      const newFolder: File = {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: 'folder',
        content: '', // Folders don't have content in this model
      };
      return {
        ...state,
        desktopFiles: [...state.desktopFiles, newFolder],
      };
    }
    case 'DELETE_FILE': {
        const fileToTrash = state.desktopFiles.find(f => f.id === action.payload);
        if (!fileToTrash) return state;
        return {
            ...state,
            desktopFiles: state.desktopFiles.filter(f => f.id !== action.payload),
            trashedFiles: [...state.trashedFiles, fileToTrash],
        };
    }
    case 'RESTORE_FILE': {
      const fileToRestore = state.trashedFiles.find(f => f.id === action.payload);
      if (!fileToRestore) return state;
      return {
        ...state,
        trashedFiles: state.trashedFiles.filter(f => f.id !== action.payload),
        desktopFiles: [...state.desktopFiles, fileToRestore],
      };
    }
    case 'PERMANENTLY_DELETE_FILE': {
      return {
        ...state,
        trashedFiles: state.trashedFiles.filter(f => f.id !== action.payload),
      };
    }
     case 'CHANGE_PASSWORD': {
      return {
        ...state,
        password: action.payload,
      };
    }
    case 'SHUTDOWN':
      return { ...state, shutdownInitiated: true };
    default:
      return state;
  }
};

interface DesktopContextType {
  apps: App[];
  state: DesktopState;
  dispatch: Dispatch<Action>;
  wallpaper: string;
  setWallpaper: (url: string) => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

const getInitialDesktopState = (): DesktopState => {
  if (typeof window === 'undefined') {
    return initialState;
  }
  try {
    const item = window.localStorage.getItem('desktopState');
    if (item) {
      const savedState = JSON.parse(item);
      const migratedFiles = (savedState.desktopFiles || []).map((file: any) => {
        if (typeof file === 'string') return null;
        return file;
      }).filter(Boolean);

      return {
        ...initialState,
        password: savedState.password || 'PASSWORD',
        desktopFiles: migratedFiles,
        trashedFiles: savedState.trashedFiles || [],
      };
    }
  } catch (error) {
    console.error('Error reading desktop state from localStorage', error);
  }
  return { ...initialState, password: 'PASSWORD' };
};

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(desktopReducer, getInitialDesktopState());
  const [wallpaper, setWallpaper] = useState(PlaceHolderImages[0]?.imageUrl || '');
  const { playSound } = useSound();

  const instrumentedDispatch: Dispatch<Action> = useCallback((action) => {
    // Sound effects based on action type
    switch (action.type) {
        case 'OPEN':
            playSound('windowOpen');
            break;
        case 'CREATE_FOLDER':
            playSound('tink');
            break;
        case 'DELETE_FILE':
            playSound('trash');
            break;
        case 'RESTORE_FILE':
            playSound('tink');
            break;
        // Close, minimize etc handled in Window component to have access to `playSound`
    }
    return dispatch(action);
  }, [playSound]);

  useEffect(() => {
    try {
      const stateToSave = {
        password: state.password,
        desktopFiles: state.desktopFiles,
        trashedFiles: state.trashedFiles,
      };
      window.localStorage.setItem('desktopState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error writing desktop state to localStorage', error);
    }
  }, [state.password, state.desktopFiles, state.trashedFiles]);
  
  useEffect(() => {
    playSound('startup');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DesktopContext.Provider value={{ apps: APPS, state, dispatch: instrumentedDispatch, wallpaper, setWallpaper }}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
