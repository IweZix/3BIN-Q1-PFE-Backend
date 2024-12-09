import { Controller, Get, HttpCode } from '@nestjs/common';
import { GlossaireService } from './glossaire.service';
import { GlossaireDTO } from 'src/dto/GlossaireDTO';

@Controller('glossaire')
export class GlossaireController {
    private readonly glossaireService: GlossaireService;

    public constructor(glossaireService: GlossaireService) {
        this.glossaireService = glossaireService;
    }

    /**
     * Get all glossaire.
     * @returns {Promise<GlossaireDTO[]>} The glossaire.
    */
    @Get()
    @HttpCode(200)
    async getAllGlossaire(): Promise<GlossaireDTO[]> {
        return await this.glossaireService.getAllGlossaire();
    }

}