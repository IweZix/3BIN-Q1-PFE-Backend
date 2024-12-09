import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Glossaire } from '../../schemas/glossaire.shema';
import { Model } from 'mongoose';
import { GlossaireDTO } from 'src/dto/GlossaireDTO';

@Injectable()
export class GlossaireService {
    public constructor(
        @InjectModel(Glossaire.name)
        private glossaireModel: Model<Glossaire>,
    ) {}

    public async getAllGlossaire(): Promise<GlossaireDTO[]> {
        const glossaires: Glossaire[] = await this.glossaireModel.find().exec();
        const glo :GlossaireDTO[] = glossaires.map(g => ({
            title: g.title,
            definition: g.definition,
            remarque: g.remarque,
            plusInfo: g.plusInfo,
        }));
        return glo;
    }

}