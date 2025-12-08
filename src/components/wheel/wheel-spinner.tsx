'use client';

import type { JSX } from 'react';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useTheme } from 'next-themes';
import { WHEEL_COLORS } from '@/config/constants';

interface WheelSpinnerProps {
  readonly participants: readonly string[];
  readonly onSpinStart?: () => void;
  readonly onSpinEnd: (winner: string) => void;
  readonly onSegmentChange?: () => void;
  readonly spinDuration?: number;
}

export function WheelSpinner({
  participants,
  onSpinStart,
  onSpinEnd,
  onSegmentChange,
  spinDuration = 10,
}: WheelSpinnerProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<unknown>(null);
  const { resolvedTheme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const winnerIndexRef = useRef<number>(0);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickIndexRef = useRef<number>(-1);
  const isSpinningRef = useRef<boolean>(false);
  const lastTickTimeRef = useRef<number>(0);

  // Get colors based on theme
  const colors = resolvedTheme === 'dark' ? WHEEL_COLORS.dark : WHEEL_COLORS.light;

  // Handle internal spin start
  const handleSpinStartInternal = useCallback((): void => {
    // This is called by the library when spin starts
  }, []);

  // Handle index change (for tick sound) - from library event
  const handleIndexChange = useCallback((): void => {
    // Library event - currently not used as we poll instead
    // onSegmentChange?.();
  }, []);

  // Poll current index and trigger ticks
  const pollCurrentIndex = useCallback((): void => {
    if (!isSpinningRef.current || !wheelRef.current || !onSegmentChange) {
      return;
    }

    const wheel = wheelRef.current as { getCurrentIndex: () => number };
    const currentIndex = wheel.getCurrentIndex();
    const now = Date.now();
    const timeSinceLastTick = now - lastTickTimeRef.current;

    // Trigger tick if index changed AND minimum interval has passed (50ms to prevent overlap)
    if (currentIndex !== lastTickIndexRef.current && timeSinceLastTick >= 50) {
      lastTickIndexRef.current = currentIndex;
      lastTickTimeRef.current = now;
      onSegmentChange();
    }

    // Continue polling
    animationFrameRef.current = requestAnimationFrame(pollCurrentIndex);
  }, [onSegmentChange]);

  // Handle spin end
  const handleSpinEnd = useCallback((): void => {
    // Clear safety timeout
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    // Stop polling
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    isSpinningRef.current = false;
    setIsSpinning(false);
    const winner = participants[winnerIndexRef.current];
    if (winner) {
      onSpinEnd(winner);
    }
  }, [participants, onSpinEnd]);

  // Handle click to spin
  const handleSpin = useCallback((): void => {
    if (isSpinning || participants.length === 0 || !wheelRef.current) return;

    isSpinningRef.current = true;
    setIsSpinning(true);
    onSpinStart?.();

    // Reset tick tracking
    lastTickIndexRef.current = -1;
    lastTickTimeRef.current = 0;

    // Select random winner
    const winnerIndex = Math.floor(Math.random() * participants.length);
    winnerIndexRef.current = winnerIndex;

    // Calculate spin duration in milliseconds
    const duration = Math.max(spinDuration * 1000, 1000); // Min 1 second

    // Calculate revolutions based on duration (more time = more spins)
    // Scale: 1s = 5 revs, 10s = 15 revs, 30s = 35 revs
    // Use exponential scaling to ensure wheel keeps spinning for full duration
    const revolutions = Math.floor(5 + (spinDuration * 1.2));

    // Get the wheel instance and spin to the winner
    const wheel = wheelRef.current as {
      spinToItem: (
        index: number,
        duration: number,
        spinToCenter: boolean,
        revolutions: number,
        direction: number,
        easingFunction?: (t: number) => number
      ) => void;
    };

    // Easing function for very fast start and dramatic slowdown
    // Use moderate power to ensure wheel spins for full duration
    // Power 3-4 for balance between fast start and filling the time
    const power = spinDuration <= 5 ? 3 : 4; // Moderate easing
    const easeOut = (t: number): number => 1 - Math.pow(1 - t, power);

    // Spin to the winner (index, duration, spinToCenter, revolutions, direction, easing)
    wheel.spinToItem(winnerIndex, duration, true, revolutions, 1, easeOut);

    // Start polling current index for tick sounds
    pollCurrentIndex();

    // Safety timeout: force winner announcement after duration if library doesn't trigger onRest
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    safetyTimeoutRef.current = setTimeout(() => {
      if (isSpinning) {
        handleSpinEnd();
      }
    }, duration + 100); // Add 100ms buffer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning, participants.length, onSpinStart, spinDuration, pollCurrentIndex]);

  // Initialize wheel
  useEffect(() => {
    setMounted(true);
    
    const initWheel = async (): Promise<void> => {
      if (!containerRef.current || participants.length === 0) return;

      // Dynamically import spin-wheel (it's a vanilla JS library)
      const { Wheel } = await import('spin-wheel');

      // Clear previous wheel
      containerRef.current.innerHTML = '';

      // Create items for the wheel
      const items = participants.map((name, index) => ({
        label: name.length > 15 ? name.substring(0, 12) + '...' : name,
        backgroundColor: colors[index % colors.length],
        labelColor: '#ffffff',
      }));

      // Create wheel props
      const props = {
        items,
        borderColor: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 2,
        lineColor: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        lineWidth: 1,
        itemLabelFont: 'sans-serif',
        itemLabelFontSizeMax: 20,
        itemLabelRadius: 0.88,
        itemLabelRadiusMax: 0.35,
        itemLabelRotation: 0,
        itemLabelAlign: 'right',
        itemLabelColors: ['#ffffff'],
        itemLabelBaselineOffset: -0.07,
        rotationSpeedMax: 4000,
        rotationResistance: 0,
        radius: 0.95,
        pointerAngle: 90,
        itemBackgroundColors: [...colors],
        isInteractive: false,
        onRest: handleSpinEnd,
        onSpin: handleSpinStartInternal,
        onCurrentIndexChange: handleIndexChange,
      };

      // Create wheel
      wheelRef.current = new Wheel(containerRef.current, props);
    };

    initWheel();

    return (): void => {
      // Cleanup safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
      // Cleanup animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [participants, colors, resolvedTheme, handleSpinEnd, handleSpinStartInternal, handleIndexChange]);

  if (!mounted) {
    return (
<<<<<<< HEAD
      <div className="flex items-center justify-center w-full h-full max-w-[500px] max-h-[500px] aspect-square">
=======
      <div className="flex items-center justify-center w-full h-full max-w-full max-h-full aspect-square" style={{ maxWidth: 'min(650px, 100%)', maxHeight: 'min(650px, 100%)' }}>
>>>>>>> 274cd70 (Refactor layout and styling for ChannelPage and Wheel components to improve responsiveness and visual consistency)
        <div className="animate-pulse bg-muted rounded-full w-[90%] h-[90%]" />
      </div>
    );
  }

  return (
    <div
<<<<<<< HEAD
      className="relative flex items-center justify-center cursor-pointer w-full h-full max-w-[500px] max-h-[500px] aspect-square"
=======
      className="relative flex items-center justify-center cursor-pointer w-full h-full max-w-full max-h-full aspect-square"
      style={{ maxWidth: 'min(650px, 100%)', maxHeight: 'min(650px, 100%)' }}
>>>>>>> 274cd70 (Refactor layout and styling for ChannelPage and Wheel components to improve responsiveness and visual consistency)
      onClick={handleSpin}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSpin();
        }
      }}
      tabIndex={participants.length > 0 && !isSpinning ? 0 : -1}
      role="button"
      aria-label={isSpinning ? 'Wheel is spinning' : 'Click to spin the wheel'}
    >
      {/* Wheel container */}
      <div
        ref={containerRef}
        className="w-[96%] h-[96%]"
      />
      
      {/* Pointer - right side */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderTop: '15px solid transparent',
          borderBottom: '15px solid transparent',
          borderRight: `25px solid ${resolvedTheme === 'dark' ? '#f59e0b' : '#f97316'}`,
          filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.3))',
        }}
      />

      {/* Empty state */}
      {participants.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-full">
          <span className="text-muted-foreground">No participants</span>
        </div>
      )}
    </div>
  );
}
