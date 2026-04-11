import { UsersService } from './user.service';
import { UserDto } from './dto/user.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, dto: UserDto, req: any): Promise<{
        display_name: string | null;
        name: string | null;
        id: string;
        email: string;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
        updatedAt: Date;
    }>;
}
