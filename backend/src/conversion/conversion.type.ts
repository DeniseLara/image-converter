export type InputImageFormat = 
  | 'jpeg' | 'jpg' 
  | 'png' 
  | 'webp' 
  | 'gif' 
  | 'avif' 
  | 'tiff' | 'tif'
  | 'svg';

export type OutputImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface ConversionResult {
  buffer: Buffer;
  originalSize: number;
  newSize: number;
  format: OutputImageFormat
}

export interface OptimizationResult {
  buffer: Buffer;
  savings: number;
  format: OutputImageFormat
}

export interface ImageInfo {
  format: InputImageFormat;
  width: number;
  height: number;
  size: number;
  hasAlpha?: boolean;
}

export interface FormatConfig {
  quality: number;
  effort?: number;
  compressionLevel?: number;
  maxQuality: number;
  maxDimension: number; 
}

export const FORMAT_CONFIGS: Record<OutputImageFormat, FormatConfig> = {
  jpeg: { 
    quality: 75, 
    maxQuality: 85,
    maxDimension: 1600
  },
  png: { 
    quality: 80, 
    effort: 4,           
    compressionLevel: 8, 
    maxQuality: 90,
    maxDimension: 1400   
  },
  webp: { 
    quality: 75, 
    effort: 3,
    maxQuality: 85,
    maxDimension: 1500
  },
  avif: { 
    quality: 60, 
    effort: 2,
    maxQuality: 75,
    maxDimension: 1200
  }
};


