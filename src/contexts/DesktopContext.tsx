'use client';
import type { App } from '@/lib/apps';
import { APPS } from '@/lib/apps';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext, useReducer, useState } from 'react';

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  state: 'minimized' | 'maximized' | 'normal';
}

interface DesktopState {
  windows: WindowInstance[];
  focusedWindow: string | null;
  lastZIndex: number;
}

type Action =
  | { type: 'OPEN'; payload: { appId: string; position?: {x: number, y: number}, size?: {width: number, height: number} } }
  | { type: 'CLOSE'; payload: string }
  | { type: 'FOCUS'; payload: string }
  | { type: 'MINIMIZE'; payload: string }
  | { type: 'TOGGLE_MAXIMIZE'; payload: string }
  | { type: 'UPDATE_WINDOW'; payload: Partial<WindowInstance> & { id: string } }
  | { type: 'TILE_WINDOWS' };


const initialState: DesktopState = {
  windows: [],
  focusedWindow: null,
  lastZIndex: 100,
};

const desktopReducer = (state: DesktopState, action: Action): DesktopState => {
  switch (action.type) {
    case 'OPEN': {
      const app = APPS.find((a) => a.id === action.payload.appId);
      if (!app) return state;

      const newWindow: WindowInstance = {
        id: `${app.id}-${Date.now()}`,
        appId: app.id,
        title: app.name,
        position: action.payload.position || { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
        size: action.payload.size || { width: app.defaultSize?.[0] || 800, height: app.defaultSize?.[1] || 600 },
        zIndex: state.lastZIndex + 1,
        state: 'normal',
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
          w.id === action.payload ? { ...w, zIndex: newZIndex } : w
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

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(desktopReducer, initialState);
  const [wallpaper, setWallpaper] = useState(PlaceHolderImages[0]?.imageUrl || '');

  return (
    <DesktopContext.Provider value={{ apps: APPS, state, dispatch, wallpaper, setWallpaper }}>
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
