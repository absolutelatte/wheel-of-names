'use client';

import type { JSX } from 'react';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { WHEEL_COLORS } from '@/config/constants';
import { cn } from '@/lib/utils';

interface WheelCanvasProps {
  readonly participants: readonly string[];
  readonly isSpinning: boolean;
  readonly rotation: number;
  readonly onSpin: () => void;
  readonly highlightedIndex: number | null;
}



/**
 * Calculate appropriate font size based on segment count and canvas size
 */
function calculateFontSize(segmentCount: number, radius: number): number {
  const baseSize = Math.min(radius / 10, 16);
  if (segmentCount <= 8) return baseSize * 1.2;
  if (segmentCount <= 16) return baseSize;
  if (segmentCount <= 32) return baseSize * 0.8;
  return baseSize * 0.6;
}

/**
 * Truncate text to fit within available space
 */
function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}

export function WheelCanvas({
  participants,
  isSpinning,
  rotation,
  onSpin,
  highlightedIndex,
}: WheelCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Use participants directly (sampling done in parent)
  const displayedParticipants = useMemo(() => {
    if (participants.length === 0) return ['No participants'];
    return participants as string[];
  }, [participants]);

  // Get colors based on theme
  const colors = useMemo(() => {
    return resolvedTheme === 'dark' ? WHEEL_COLORS.dark : WHEEL_COLORS.light;
  }, [resolvedTheme]);

  // Draw the wheel
  const drawWheel = useCallback((): void => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);

    // Set canvas size accounting for DPI
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.85; // Leave some padding
    const pointerOffset = 20; // Space for pointer

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw wheel segments
    const segmentCount = displayedParticipants.length;
    const segmentAngle = (2 * Math.PI) / segmentCount;
    const fontSize = calculateFontSize(segmentCount, radius);

    displayedParticipants.forEach((name, index) => {
      // Adjust rotation: pointer is at top (negative PI/2), wheel rotates clockwise
      const startAngle = index * segmentAngle - Math.PI / 2 + rotation;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Fill with color
      const colorIndex = index % colors.length;
      const segmentColor = colors[colorIndex] ?? '#3b82f6';
      ctx.fillStyle = segmentColor;
      ctx.fill();

      // Highlight winner segment
      if (highlightedIndex !== null && index === highlightedIndex) {
        ctx.strokeStyle = resolvedTheme === 'dark' ? '#ffffff' : '#000000';
        ctx.lineWidth = 4;
        ctx.stroke();
      } else {
        // Normal segment border
        ctx.strokeStyle = resolvedTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);

      // Text styling
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Calculate max text width (leave padding from edges)
      const maxTextWidth = radius * 0.65;
      const displayText = truncateText(ctx, name, maxTextWidth);

      // Position text in the middle of the segment
      ctx.fillText(displayText, radius * 0.9, 0);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.08, 0, 2 * Math.PI);
    ctx.fillStyle = resolvedTheme === 'dark' ? '#1f2937' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = resolvedTheme === 'dark' ? '#374151' : '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer at top
    const pointerSize = radius * 0.1;
    ctx.beginPath();
    ctx.moveTo(centerX, pointerOffset - pointerSize * 0.3);
    ctx.lineTo(centerX - pointerSize * 0.6, pointerOffset - pointerSize);
    ctx.lineTo(centerX + pointerSize * 0.6, pointerOffset - pointerSize);
    ctx.closePath();
    ctx.fillStyle = resolvedTheme === 'dark' ? '#f59e0b' : '#f97316';
    ctx.fill();
    ctx.strokeStyle = resolvedTheme === 'dark' ? '#fbbf24' : '#fb923c';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [displayedParticipants, rotation, colors, highlightedIndex, resolvedTheme]);

  // Effect to draw wheel on changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      drawWheel();
    };

    window.addEventListener('resize', handleResize);
    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, [drawWheel]);

  // Handle click
  const handleClick = useCallback((): void => {
    if (!isSpinning && participants.length > 0) {
      onSpin();
    }
  }, [isSpinning, participants.length, onSpin]);

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLCanvasElement>): void => {
      if ((event.key === 'Enter' || event.key === ' ') && !isSpinning && participants.length > 0) {
        event.preventDefault();
        onSpin();
      }
    },
    [isSpinning, participants.length, onSpin]
  );

  const canSpin = !isSpinning && participants.length > 0;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{ width: 400, height: 400, minWidth: 320, minHeight: 320 }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={canSpin ? 0 : -1}
        role="button"
        aria-label={
          isSpinning
            ? 'Wheel is spinning'
            : participants.length === 0
            ? 'No participants to spin'
            : 'Click to spin the wheel'
        }
        className={cn(
          'max-w-full max-h-full rounded-full transition-shadow duration-200',
          canSpin && 'cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isSpinning && 'cursor-not-allowed'
        )}
      />
    </div>
  );
}
