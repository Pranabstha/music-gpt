import { AudioService } from './audio.service';
import { AudioDto } from './audio.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class AudioController {
    private readonly audioService;
    constructor(audioService: AudioService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, dto: AudioDto, req: any): Promise<{
        id: string;
        title: string;
        url: string;
        userId: string;
        updatedAt: Date;
    }>;
}
