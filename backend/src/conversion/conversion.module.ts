import { Module } from "@nestjs/common";
import { ConversionService } from "./conversion.service";
import { ConversionController } from "./conversion.controller";
import { ThrottleGuard } from "./throttle.guard";
import { ImageFormatPipe } from "./image-format.pipe";

@Module({
    providers:[ConversionService, ThrottleGuard, ImageFormatPipe],
    controllers:[ConversionController]
})
export class ConversionModule {}