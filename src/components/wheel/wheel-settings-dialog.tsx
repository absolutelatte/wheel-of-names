'use client';

import type { JSX } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { WheelSettings } from '@/types/wheel';

interface WheelSettingsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly settings: WheelSettings;
  readonly onSettingsChange: (settings: WheelSettings) => void;
}

export function WheelSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: WheelSettingsDialogProps): JSX.Element {
  // Local state for form values
  const [volume, setVolume] = useState(settings.volume);
  const [spinTime, setSpinTime] = useState(settings.spinTime);
  const [maxVisible, setMaxVisible] = useState(settings.maxVisible);

  // Reset local state when dialog opens
  useEffect(() => {
    if (open) {
      setVolume(settings.volume);
      setSpinTime(settings.spinTime);
      setMaxVisible(settings.maxVisible);
    }
  }, [open, settings]);

  const handleSave = useCallback((): void => {
    onSettingsChange({
      volume,
      spinTime,
      maxVisible,
    });
    onOpenChange(false);
  }, [volume, spinTime, maxVisible, onSettingsChange, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Wheel
          </DialogTitle>
          <DialogDescription>
            Adjust wheel settings to your preference.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Volume Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume">Volume</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {volume}%
              </span>
            </div>
            <Slider
              id="volume"
              min={0}
              max={100}
              step={1}
              value={[volume]}
              onValueChange={(value) => {
                const newValue = value[0];
                if (newValue !== undefined) {
                  setVolume(newValue);
                }
              }}
            />
          </div>

          {/* Spin Time Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="spin-time">Spin Time</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {spinTime}s
              </span>
            </div>
            <Slider
              id="spin-time"
              min={1}
              max={30}
              step={1}
              value={[spinTime]}
              onValueChange={(value) => {
                const newValue = value[0];
                if (newValue !== undefined) {
                  setSpinTime(newValue);
                }
              }}
            />
          </div>

          {/* Max Visible Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-visible">Max Visible</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {maxVisible}
              </span>
            </div>
            <Slider
              id="max-visible"
              min={1}
              max={200}
              step={1}
              value={[maxVisible]}
              onValueChange={(value) => {
                const newValue = value[0];
                if (newValue !== undefined) {
                  setMaxVisible(newValue);
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
