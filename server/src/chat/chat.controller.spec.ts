import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Chat } from './schema/chat.schema';
import mongoose, { ObjectId } from 'mongoose';

const mockChat: Chat = {
    chats: {
        _id: 'chat_id' as unknown as ObjectId,
        question: ['hi'],
        answer: ['answer1'],
    },
    _id: 'as' as unknown as mongoose.Types.ObjectId,
    user_id: 'asd' as unknown as mongoose.Types.ObjectId,
    session_id: 'asd',
};
describe('ChatController', () => {
    let chatController: ChatController;
    let chatService: ChatService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChatController],
            providers: [
                {
                    provide: ChatService,
                    useValue: {
                        getChatFromSession: jest.fn(),
                    },
                },
                {
                    provide: ConfigurationService,
                    useValue: {
                        getConnectInfinityServerConnectionString: jest
                            .fn()
                            .mockReturnValue('token'),
                    },
                },
            ],
        }).compile();

        chatController = module.get<ChatController>(ChatController);
        chatService = module.get<ChatService>(ChatService);
    });

    it('should be defined', () => {
        expect(chatController).toBeDefined();
    });

    it('should throw forbidden error when requesting chat without custom header', async () => {
        await expect(
            chatController.getUserChat('asd', {
                'no-header': 'no-header',
            }),
        ).rejects.toBeInstanceOf(ForbiddenException);
    });

    describe('should throw bad request error', () => {
        it('when requesting chat with improper custom header text', async () => {
            await expect(
                chatController.getUserChat('asd', {
                    'chatbot-to-connect-infinity-token': 'incorrect-header',
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('when the token value mismatches', async () => {
            await expect(
                chatController.getUserChat('asd', {
                    'chatbot-to-connect-infinity-token':
                        'CHATBOT_SERVER_TO_CONNECT_INFINITY incorrect-token',
                }),
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    it('should return the chat message when correct header is provided', async () => {
        jest.spyOn(chatService, 'getChatFromSession').mockResolvedValue(
            mockChat,
        );
        await expect(
            chatController.getUserChat('asd', {
                'chatbot-to-connect-infinity-token':
                    'CHATBOT_SERVER_TO_CONNECT_INFINITY token',
            }),
        ).resolves.toBe(mockChat);
    });
});
