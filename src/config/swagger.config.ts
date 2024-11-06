import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setBasePath('Snappfood')
    .setDescription('The Snappfood API description')
    .setTitle('Snappfood API')
    .setVersion('v0.0.1')
    .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
    .build();
  const swaggerDocumect = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/swagger', app, swaggerDocumect);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    name: 'Authorization',
  };
}
