import { SubscriptionService } from './subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    subscribe(req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    cancel(req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    status(req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
}
