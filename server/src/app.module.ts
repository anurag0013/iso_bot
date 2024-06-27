import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ConfigurationService } from './configuration/configuration.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { LangchainModule } from './langchain/langchain.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { BalanceModule } from './balance/balance.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forRootAsync({
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: async (configService: ConfigurationService) => ({
                uri: configService.getDatabaseUrl(),
            }),
        }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigurationModule],
            inject: [ConfigurationService],
            useFactory: async (configService: ConfigurationService) => ({
                secret: configService.getJwtSecret(),
                global: true,
                signOptions: { expiresIn: '24h' },
            }),
        }),
        BalanceModule, 
        UserModule,
        ConfigurationModule,
        LangchainModule,
        ChatModule,
    ],
    controllers: [AuthController, ChatController],
})
export class AppModule {}
