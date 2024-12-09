import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Glossaire, GlossaireSchema } from '../../schemas/glossaire.shema';
import { GlossaireService } from './glossaire.service';
import { GlossaireController } from './glossaire.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Glossaire.name, schema: GlossaireSchema }])],
    providers: [GlossaireService],
    controllers: [GlossaireController],
    exports: [GlossaireService],
})
export class GlossaireModule {}