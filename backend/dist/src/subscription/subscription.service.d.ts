import { PrismaService } from "../prisma/prisma.service";
export declare class SubscriptionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    subscribe(userId: string): Promise<{
        email: string;
        id: string;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    cancel(userId: string): Promise<{
        email: string;
        id: string;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    getStatus(userId: string): Promise<{
        email: string;
        id: string;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    private findUserOrFail;
}
