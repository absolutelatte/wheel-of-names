'use client';

import type { JSX } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WheelTitleEditorProps {
  readonly title: string;
  readonly description: string;
  readonly onSave: (title: string, description: string) => void;
}

export function WheelTitleEditor({
  title,
  description,
  onSave,
}: WheelTitleEditorProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  // Reset local state when popover opens
  useEffect(() => {
    if (open) {
      setLocalTitle(title);
      setLocalDescription(description);
    }
  }, [open, title, description]);

  const handleSave = useCallback((): void => {
    const trimmedTitle = localTitle.trim();
    const trimmedDescription = localDescription.trim();
    
    // Use default title if empty
    const finalTitle = trimmedTitle.length > 0 ? trimmedTitle : 'Wheel of Names';
    
    onSave(finalTitle, trimmedDescription);
    setOpen(false);
  }, [localTitle, localDescription, onSave]);

  const handleCancel = useCallback((): void => {
    setLocalTitle(title);
    setLocalDescription(description);
    setOpen(false);
  }, [title, description]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Edit wheel title and description"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wheel-title">Title</Label>
            <Input
              id="wheel-title"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Wheel of Names"
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wheel-description">Description</Label>
            <Textarea
              id="wheel-description"
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a description..."
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
