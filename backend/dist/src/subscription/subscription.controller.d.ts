import { SubscriptionService } from './subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    subscribe(req: any): Promise<{
        email: string;
        id: string;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    cancel(req: any): Promise<{
        email: string;
        id: string;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
    status(req: any): Promise<{
        email: string;
        id: string;
        display_name: string | null;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
    }>;
}
