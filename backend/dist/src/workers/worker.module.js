"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkersModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const prompt_processor_1 = require("./prompt.processor");
const event_module_1 = require("../gateway/event.module");
const prisma_module_1 = require("../prisma/prisma.module");
let WorkersModule = class WorkersModule {
};
exports.WorkersModule = WorkersModule;
exports.WorkersModule = WorkersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: prompt_processor_1.PROMPT_QUEUE }),
            event_module_1.EventsModule,
            prisma_module_1.PrismaModule,
        ],
        providers: [prompt_processor_1.PromptProcessor],
    })
], WorkersModule);
//# sourceMappingURL=worker.module.js.map