'use client';
import { useDesktop, type WindowInstance } from '@/contexts/DesktopContext';
import { APPS } from '@/lib/apps';
import { cn } from '@/lib/utils';
import { motion, useDragControls } from 'framer-motion';
import { Maximize, Minimize, Minus, Square, X, Copy } from 'lucide-react';
import type { PointerEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';

interface WindowProps {
  instance: WindowInstance;
}

const TrafficLight = ({
  color,
  onClick,
  children,
}: {
  color: 'red' | 'yellow' | 'green';
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const colorClasses = {
    red: 'bg-[#FF5F57] group-hover:bg-[#E0443E]',
    yellow: 'bg-[#FEBC2E] group-hover:bg-[#DFA023]',
    green: 'bg-[#28C840] group-hover:bg-[#1DAD29]',
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-3 h-3 rounded-full flex items-center justify-center',
        colorClasses[color]
      )}
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        {children}
      </div>
    </button>
  );
};

export default function Window({ instance }: WindowProps) {
  const { dispatch, state } = useDesktop();
  const App = APPS.find((app) => app.id === instance.appId)?.component;
  const isFocused = state.focusedWindow === instance.id;

  const dragControls = useDragControls();

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragControls.start(e, { snapToCursor: false });
    dispatch({ type: 'FOCUS', payload: instance.id });
  };
  
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Store original state for un-maximizing
  const [preMaximizeState, setPreMaximizeState] = useState({
    pos: instance.position,
    size: instance.size
  });

  const handleToggleMaximize = () => {
    if (instance.state !== 'maximized') {
        setPreMaximizeState({ pos: instance.position, size: instance.size });
    }
    dispatch({ type: 'TOGGLE_MAXIMIZE', payload: instance.id });
  }

  const handleMinimize = () => {
    dispatch({ type: 'MINIMIZE', payload: instance.id });
  }
  
  const maximizedStyles = {
    top: '32px',
    left: '0px',
    width: '100vw',
    height: 'calc(100vh - 32px - 80px)',
    transform: 'none'
  };

  if (!App) return null;

  const variants = {
    hidden: { scale: 0.9, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0 },
    minimized: { scale: 0, opacity: 0, y: 200, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      ref={windowRef}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={(_event, info) => {
        dispatch({
          type: 'UPDATE_WINDOW',
          payload: { id: instance.id, position: { x: info.point.x, y: info.point.y } },
        });
      }}
      onPointerDown={() => dispatch({ type: 'FOCUS', payload: instance.id })}
      className={cn(
        'absolute bg-card/80 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/10 flex flex-col',
        isFocused ? 'ring-2 ring-primary/50' : 'ring-1 ring-black/10'
      )}
      style={{
        width: instance.size.width,
        height: instance.size.height,
        zIndex: instance.zIndex,
        top: instance.position.y,
        left: instance.position.x,
        ...(instance.state === 'maximized' ? maximizedStyles : {}),
      }}
      animate={instance.state === 'minimized' ? 'minimized' : 'visible'}
      initial="hidden"
      exit="minimized"
      variants={variants}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div
        onPointerDown={handlePointerDown}
        className="h-9 px-3 flex items-center justify-between flex-shrink-0 cursor-move border-b"
      >
        <div className="flex items-center gap-2 group">
          <TrafficLight color="red" onClick={() => dispatch({ type: 'CLOSE', payload: instance.id })}>
             <X size={8} className="text-black/60" />
          </TrafficLight>
          <TrafficLight color="yellow" onClick={handleMinimize}>
            <Minus size={8} className="text-black/60" />
          </TrafficLight>
          <TrafficLight color="green" onClick={handleToggleMaximize}>
            {instance.state === 'maximized' ? <Minimize size={8} className="text-black/60" /> : <Maximize size={8} className="text-black/60" />}
          </TrafficLight>
        </div>
        <span className="text-sm font-medium text-foreground/80">{instance.title}</span>
        <div className="flex items-center gap-2">
            <button onClick={() => dispatch({type: 'TILE_WINDOWS'})} className="opacity-30 hover:opacity-100 transition-opacity">
                <Copy size={14} />
            </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <App />
      </div>
    </motion.div>
  );
}
