'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { FileText, ImageIcon as ImageIconLucide, Folder as FolderIcon, Trash2, ShieldAlert, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { File } from '@/lib/apps';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Trash() {
  const { state, dispatch } = useDesktop();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const handleRestoreFile = () => {
    if (!selectedFileId) return;
    dispatch({ type: 'RESTORE_FILE', payload: selectedFileId });
    setSelectedFileId(null);
  };
  
  const handleEmptyTrash = () => {
    dispatch({ type: 'EMPTY_TRASH' });
    setSelectedFileId(null);
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'folder') {
        return <FolderIcon className="h-10 w-10 text-primary" />;
    }
    if (file.type.startsWith('image/')) {
      return <ImageIconLucide className="h-10 w-10 text-blue-500" />;
    }
    if (file.type.startsWith('text/')) {
      return <FileText className="h-10 w-10 text-gray-500" />;
    }
    return <FileText className="h-10 w-10 text-gray-500" />;
  }

  return (
    <div className="p-4 h-full flex flex-col">
       <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b">
        <h1 className="text-xl font-bold">Trash</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestoreFile} disabled={!selectedFileId}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={state.trashedFiles.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Empty Trash
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete all items in the Trash. This cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEmptyTrash}>Empty Trash</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </header>
      <div className="flex-grow pt-4">
        {state.trashedFiles.length === 0 ? (
             <div className="text-center text-muted-foreground">The Trash is empty.</div>
        ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {state.trashedFiles.map((file) => (
                <div
                key={file.id}
                className={cn(
                  "flex flex-col items-center gap-2 group cursor-pointer w-24 text-center p-2 rounded-lg",
                  selectedFileId === file.id && "bg-accent"
                )}
                onClick={() => setSelectedFileId(file.id)}
                onDoubleClick={handleRestoreFile}
                >
                <div className="flex items-center justify-center">
                    {getFileIcon(file)}
                </div>
                <span className="text-xs text-foreground font-medium break-words">{file.name}</span>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
