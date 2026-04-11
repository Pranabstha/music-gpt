import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, dto: UpdateUserDto, req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
        updatedAt: Date;
    }>;
}
