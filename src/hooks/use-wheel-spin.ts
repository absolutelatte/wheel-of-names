'use client';

import { useState, useRef, useCallback, useMemo } from 'react';

interface UseWheelSpinOptions {
  readonly participants: readonly string[];
  readonly spinTime: number;
  readonly onSegmentPass: () => void;
  readonly onSpinComplete: (winner: string, winnerIndex: number) => void;
}

interface UseWheelSpinReturn {
  readonly isSpinning: boolean;
  readonly rotation: number;
  readonly startSpin: () => void;
  readonly highlightedIndex: number | null;
}

/**
 * Cubic easing function for smooth deceleration
 * @param t - Progress value from 0 to 1
 * @returns Eased value from 0 to 1
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useWheelSpin(options: UseWheelSpinOptions): UseWheelSpinReturn {
  const { participants, spinTime, onSegmentPass, onSpinComplete } = options;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const animationRef = useRef<number | null>(null);
  const lastSegmentRef = useRef<number>(-1);

  const startSpin = useCallback((): void => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setHighlightedIndex(null);

    // Select winner at spin start from ALL participants
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex] ?? '';
    
    // Safety check - should never happen since we checked length > 0
    if (!winner) return;

    // Calculate target rotation
    // We need to land on the winner segment at the top (pointer position)
    const segmentAngle = (2 * Math.PI) / participants.length;
    
    // Total rotations: 5-10 full spins for drama
    const totalRotations = (5 + Math.random() * 5) * 2 * Math.PI;
    
    // The pointer is at the TOP of the wheel (-π/2 in canvas coordinates)
    // Segments are drawn with: startAngle = index * segmentAngle - π/2 + rotation
    // For segment i's CENTER to align with pointer at -π/2:
    // We need: rotation ≡ -(i + 0.5) * segmentAngle (mod 2π)
    
    // Target angle where winner's center aligns with pointer
    const targetAngle = (2 * Math.PI - (winnerIndex + 0.5) * segmentAngle) % (2 * Math.PI);
    
    // Current effective rotation (normalized to 0-2π)
    const currentEffective = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // Calculate additional rotation needed to reach target (always positive, going forward)
    let deltaToTarget = targetAngle - currentEffective;
    if (deltaToTarget < 0) deltaToTarget += 2 * Math.PI;
    
    // Add small random offset within segment for variation (±25% of segment)
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.5;
    
    // Final target: current + full spins + delta to reach target + random offset
    const targetRotation = rotation + totalRotations + deltaToTarget + randomOffset;

    const startTime = performance.now();
    const duration = spinTime * 1000; // Convert to milliseconds
    const startRotation = rotation;
    const totalDelta = targetRotation - startRotation;

    // Reset segment tracking
    lastSegmentRef.current = Math.floor((startRotation % (2 * Math.PI)) / segmentAngle);

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentRotation = startRotation + totalDelta * easedProgress;
      setRotation(currentRotation);

      // Track segment passes for tick sound
      const normalizedRotation = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSegment = Math.floor(normalizedRotation / segmentAngle);
      
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        onSegmentPass();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setIsSpinning(false);
        setHighlightedIndex(winnerIndex);
        onSpinComplete(winner, winnerIndex);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, participants, spinTime, rotation, onSegmentPass, onSpinComplete]);

  return useMemo(
    () => ({
      isSpinning,
      rotation,
      startSpin,
      highlightedIndex,
    }),
    [isSpinning, rotation, startSpin, highlightedIndex]
  );
}
