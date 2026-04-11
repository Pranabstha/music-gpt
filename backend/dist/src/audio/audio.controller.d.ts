import { AudioService } from './audio.service';
import { UpdateAudioDto } from './audio.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class AudioController {
    private readonly audioService;
    constructor(audioService: AudioService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, dto: UpdateAudioDto, req: any): Promise<{
        id: string;
        updatedAt: Date;
        title: string;
        url: string;
        userId: string;
    }>;
}
