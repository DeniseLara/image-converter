import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from "@nestjs/common";
import { OutputImageFormat } from "./conversion.type";


@Injectable()
export class ImageFormatPipe implements PipeTransform<string, OutputImageFormat> {
    private static readonly validFormats: OutputImageFormat[] = ['jpeg', 'png', 'webp', 'avif'];

    transform(value: string): OutputImageFormat {
        if (!value) {
            throw new BadRequestException("El formato es requerido");
        }

        const format = value.toLowerCase();

        if (!ImageFormatPipe.validFormats.includes(format as OutputImageFormat)) {
            throw new BadRequestException(
                `Formato no válido "${value}". Formatos soportados: ${ImageFormatPipe.validFormats.join(', ')}`
            )
        }

        return format as OutputImageFormat;
    }

}