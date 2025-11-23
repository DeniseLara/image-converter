import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { 
  ConversionResult, 
  OptimizationResult, 
  ImageInfo, 
  InputImageFormat,
  OutputImageFormat,
  FORMAT_CONFIGS,
} from './conversion.type';
import { CONFIG } from './throttle.guard';
import { ThrottleGuard } from './throttle.guard';


@Injectable()
export class ConversionService {
  private readonly logger = new Logger(ConversionService.name);

  constructor(private readonly throttleGuard: ThrottleGuard) {}

  async convertImage(
    buffer: Buffer,
    targetFormat: OutputImageFormat,
    quality: number = 75,
  ): Promise<ConversionResult> {

    // VALIDAR EL TAMAÑO DEL ARCHIVO ORIGINAL - ANTES DE CUALQUIER PROCESAMIENTO
    if (buffer.length > CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Archivo demasiado grande: ${(buffer.length / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 5MB.`
      );
    }
    
    this.throttleGuard.incrementActiveJobs();

    try {
      const originalSize = buffer.length;
      const config = FORMAT_CONFIGS[targetFormat];
      
      const resultBuffer = await this.withTimeout(
        sharp(buffer)
          .resize(CONFIG.MAX_DIMENSION, CONFIG.MAX_DIMENSION, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat(targetFormat, { 
            quality: Math.min(quality, config.maxQuality), 
            effort: 1,
            compressionLevel: config.compressionLevel || 6
          })
          .toBuffer()
      );

      // validar el tamaño despúes del procesamiento
      if (resultBuffer.length > CONFIG.MAX_FILE_SIZE) {
        throw new BadRequestException(
          `La imagen resultante es muy grande (${(resultBuffer.length / 1024 / 1024).toFixed(1)}MB). Reduce la calidad.`
        );
      }

      this.logger.log(`Conversión: ${originalSize} → ${resultBuffer.length} bytes`);

      return {
        buffer: resultBuffer,
        originalSize,
        newSize: resultBuffer.length,
        format: targetFormat
      };

    } finally {
      this.throttleGuard.decrementActiveJobs();
      this.cleanupMemory();
    }
  }

  async optimizeImage(
    buffer: Buffer, 
    quality: number = 70,
  ): Promise<OptimizationResult> {

    // VALIDAR EL TAMAÑO DEL ARCHIVO ORIGINAL
    if (buffer.length > CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Archivo demasiado grande: ${(buffer.length / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 5MB.`
      );
    }
    
    this.throttleGuard.incrementActiveJobs();
    
    try {
      const originalSize = buffer.length;
      
      const optimizedBuffer = await this.withTimeout(
        sharp(buffer)
          .resize(CONFIG.MAX_DIMENSION, CONFIG.MAX_DIMENSION, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ 
            quality: Math.min(quality, 75),
            mozjpeg: true 
          })
          .toBuffer()
      );

      // Validar después de optimizar
      if (optimizedBuffer.length > CONFIG.MAX_FILE_SIZE) {
        throw new BadRequestException(
          `La imagen optimizada es muy grande. Reduce más la calidad.`
        );
      }

      const savings = ((originalSize - optimizedBuffer.length) / originalSize) * 100;
      
      this.logger.log(`Optimización: ${savings.toFixed(1)}% de ahorro`);

      return {
        buffer: optimizedBuffer,
        savings: Number(savings.toFixed(1)),
        format: 'jpeg' as OutputImageFormat 
      };

    } finally {
      this.throttleGuard.decrementActiveJobs();
      this.cleanupMemory();
    }
  }

  async getImageInfo(
    buffer: Buffer, 
  ): Promise<ImageInfo> {

    // VALIDAR TAMAÑO ORIGINAL TAMBIÉN PARA INFO
    if (buffer.length > CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Archivo demasiado grande para análisis: ${(buffer.length / 1024 / 1024).toFixed(2)}MB. Máximo: 5MB.`
      );
    }
    
    this.throttleGuard.incrementActiveJobs();
    
    try {
      const metadata = await this.withTimeout(sharp(buffer).metadata());
      
      return {
        format: metadata.format as InputImageFormat || 'unknown',
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: buffer.length
      };

    } finally {
      this.throttleGuard.decrementActiveJobs();
    }
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new BadRequestException('Tiempo excedido')), CONFIG.TIMEOUT_MS)
      )
    ]);
  }

  private cleanupMemory(): void {
    if (global.gc) {
      try {
        global.gc();
      } catch (e) {
      }
    }
  }

  getStats() {
    return {
      activeJobs: this.throttleGuard.ActiveJobs,
      maxConcurrent: CONFIG.MAX_CONCURRENT_JOBS
    };
  }
}