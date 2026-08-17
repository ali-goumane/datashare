"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.use((0, helmet_1.default)());
    app.enableCors({ origin: config.get('FRONTEND_URL', 'http://localhost:5173') });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    const swaggerConfig = new swagger_1.DocumentBuilder().setTitle('DataShare API').setVersion('1.0').addBearerAuth().build();
    swagger_1.SwaggerModule.setup('api/docs', app, swagger_1.SwaggerModule.createDocument(app, swaggerConfig));
    await app.listen(config.get('PORT', 3000));
}
bootstrap();
//# sourceMappingURL=main.js.map