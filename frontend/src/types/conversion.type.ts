export interface ConversionOptions {
  format: OutputImageFormat;
  quality?: number;
}

export type InputImageFormat = 
  | 'jpeg' | 'jpg' 
  | 'png' 
  | 'webp' 
  | 'gif' 
  | 'avif' 
  | 'tiff' | 'tif'
  | 'svg';

export type OutputImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

