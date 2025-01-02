export type ImageFormat = 'png' | 'jpeg' | 'webp';

export interface ExportOptions {
  format: ImageFormat;
  quality: number;
} 