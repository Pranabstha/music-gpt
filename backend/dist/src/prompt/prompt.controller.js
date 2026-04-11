"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptsController = void 0;
const common_1 = require("@nestjs/common");
const prompt_service_1 = require("./prompt.service");
const prompt_dto_1 = require("./dto/prompt-dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PromptsController = class PromptsController {
    promptsService;
    constructor(promptsService) {
        this.promptsService = promptsService;
    }
    async create(dto, req) {
        const prompt = await this.promptsService.create(dto, req.user.id);
        return {
            id: prompt.id,
            status: prompt.status,
            message: 'Prompt received. You will be notified via WebSocket when ready.',
        };
    }
};
exports.PromptsController = PromptsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prompt_dto_1.PromptDto, Object]),
    __metadata("design:returntype", Promise)
], PromptsController.prototype, "create", null);
exports.PromptsController = PromptsController = __decorate([
    (0, common_1.Controller)('prompts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prompt_service_1.PromptsService])
], PromptsController);
//# sourceMappingURL=prompt.controller.js.map