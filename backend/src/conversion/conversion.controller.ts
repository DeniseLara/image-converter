import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body,
  Res,
  HttpStatus, 
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ConversionService } from './conversion.service';
import type { OutputImageFormat } from './conversion.type';
import { ImageFormatPipe } from './image-format.pipe';
import { ThrottleGuard } from './throttle.guard';


@Controller('api')
export class ConversionController {
    constructor(private readonly conversionService: ConversionService) {}

    @Post('convert')
    @UseGuards(ThrottleGuard)
    @UseInterceptors(FileInterceptor('file'))
    async convertImage (
        @UploadedFile() file: Express.Multer.File,
        @Body('format', ImageFormatPipe) validFormat: OutputImageFormat,
        @Body('quality') quality: number = 75,
        @Res() res: Response,
    ) {
        try {      
            const result = await this.conversionService.convertImage(
                file.buffer,
                validFormat,
                quality,
            );

            res.set({
                'Content-Type': `image/${validFormat}`,
                'Content-Disposition': `attachment; filename="converted.${validFormat}"`,
                'Content-Length': result.buffer.length.toString(),
                'X-Original-Size': result.originalSize.toString(),
                'X-New-Size': result.newSize.toString(),
                'X-Output-Format': result.format,
                'X-Savings-Bytes': (result.originalSize - result.newSize).toString(),
            });

            res.send(result.buffer);

        } catch (error) {
            const statusCode = error.status || HttpStatus.BAD_REQUEST;
            res.status(statusCode).json({
                error: 'Error en conversión',
                message: error.message
            });
        }
    }

    @Post('optimize')
    @UseGuards(ThrottleGuard)
    @UseInterceptors(FileInterceptor('file'))
    async optimizeImage (
        @UploadedFile() file: Express.Multer.File,
        @Body('quality') quality: number = 70,
        @Res() res: Response,
    ) {
        try {      
            const result = await this.conversionService.optimizeImage(
                file.buffer,
                quality,
            );

            // Sanitizar el nombre del archivo
            const originalName = file.originalname || 'image';
            const baseName = originalName.replace(/^.*[\\\/]/, ''); // Eliminar rutas
            const safeName = baseName.replace(/[^a-zA-Z0-9_\-.]/g, ''); // Eliminar caracteres no seguros
            const fileName = safeName || 'image';

            res.set({
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="optimized_${fileName}"`,
                'Content-Length': result.buffer.length.toString(),
                'X-Output-Format': result.format,
                'X-Savings-Percent': result.savings.toString(),
            });

            res.send(result.buffer);

        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                error: 'Error en optimización',
                message: error.message
            });
        }
    }

    @Post('info')
    @UseGuards(ThrottleGuard)
    @UseInterceptors(FileInterceptor('file'))
    async getImageInfo (
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.conversionService.getImageInfo(file.buffer);
    }

    @Post('stats')
    getStats() {
        return this.conversionService.getStats();
    }

    @Post('health')
    getHealth() {
        const memoryUsage = process.memoryUsage();
        return {
            status: 'ok',
            memory: {
                used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
            },
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
}