'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [displayUrl, setDisplayUrl] = useState(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGo = () => {
    let finalUrl = displayUrl;
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://` + finalUrl;
    }
    setUrl(finalUrl);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
        handleGo();
    }
  }

  const refresh = () => {
    if (iframeRef.current) {
      // Re-setting the src is a safe way to "refresh" a cross-origin iframe
      iframeRef.current.src = url;
    }
  };
  
  const goBack = () => {
    // Due to cross-origin security policies, we cannot control the history
    // of the iframe if it's on a different domain.
    console.warn("Back functionality is disabled for cross-origin sites.");
  }
  
  const goForward = () => {
    // Due to cross-origin security policies, we cannot control the history
    // of the iframe if it's on a different domain.
    console.warn("Forward functionality is disabled for cross-origin sites.");
  }

  const goHome = () => {
     setUrl('https://www.google.com/webhp?igu=1');
     setDisplayUrl('https://www.google.com/webhp?igu=1');
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-2 border-b flex gap-2 items-center">
        <Button variant="ghost" size="icon" onClick={goBack} disabled><ArrowLeft /></Button>
        <Button variant="ghost" size="icon" onClick={goForward} disabled><ArrowRight /></Button>
        <Button variant="ghost" size="icon" onClick={refresh}><RefreshCw /></Button>
        <Button variant="ghost" size="icon" onClick={goHome}><Home /></Button>
        <Input
          value={displayUrl}
          onChange={(e) => setDisplayUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className="flex-grow"
        />
      </div>
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full border-0"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation"
        onError={(e) => console.error('Iframe error:', e)}
      />
    </div>
  );
}
