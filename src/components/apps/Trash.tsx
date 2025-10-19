'use client';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { FileText, ImageIcon as ImageIconLucide, Folder as FolderIcon, Trash2, Undo } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

export default function Trash() {
  const { state, dispatch } = useDesktop();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRestore = () => {
    if (!selectedFileId) return;
    dispatch({ type: 'RESTORE_FILE', payload: selectedFileId });
    setSelectedFileId(null);
  };
  
  const handleDelete = () => {
    if (!selectedFileId) return;
    dispatch({ type: 'PERMANENTLY_DELETE_FILE', payload: selectedFileId });
    setSelectedFileId(null);
    setShowDeleteConfirm(false);
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
    <>
      <div className="p-4 h-full flex flex-col">
         <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b">
          <h1 className="text-xl font-bold">Trash</h1>
          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRestore} disabled={!selectedFileId}>
                  <Undo className="mr-2 h-4 w-4" />
                  Restore
              </Button>
               <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)} disabled={!selectedFileId}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Permanently Delete
              </Button>
          </div>
        </header>
        <div className="flex-grow pt-4">
          {state.trashedFiles.length === 0 ? (
               <div className="text-center text-muted-foreground">Trash is empty.</div>
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
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
