declare module 'spin-wheel' {
  export interface WheelItem {
    label?: string;
    backgroundColor?: string;
    labelColor?: string;
    image?: string;
    imageRadius?: number;
    imageRotation?: number;
    imageScale?: number;
    weight?: number;
  }

  export interface WheelProps {
    items: WheelItem[];
    borderColor?: string;
    borderWidth?: number;
    lineColor?: string;
    lineWidth?: number;
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelAlign?: string;
    itemLabelColors?: string[];
    itemLabelBaselineOffset?: number;
    itemBackgroundColors?: string[];
    rotationSpeedMax?: number;
    rotationResistance?: number;
    radius?: number;
    pointerAngle?: number;
    isInteractive?: boolean;
    rotation?: number;
    onRest?: (event: { currentIndex: number }) => void;
    onSpin?: () => void;
    onCurrentIndexChange?: (event: { currentIndex: number }) => void;
  }

  export class Wheel {
    constructor(container: HTMLElement, props?: WheelProps);
    
    currentIndex: number;
    rotation: number;
    isSpinning: boolean;
    items: WheelItem[];

    init(props?: WheelProps): void;
    spin(rotationSpeed?: number): void;
    spinTo(
      rotation: number,
      duration?: number,
      easingFunction?: (t: number) => number
    ): void;
    spinToItem(
      itemIndex: number,
      duration?: number,
      spinToCenter?: boolean,
      revolutions?: number,
      direction?: number,
      easingFunction?: (t: number) => number
    ): void;
    stop(): void;
    remove(): void;
  }
}
