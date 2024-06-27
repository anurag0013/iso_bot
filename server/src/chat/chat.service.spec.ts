import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Chat } from './schema/chat.schema';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/schema/user.schema';

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
const mockUser: User = {
    _id: 'asd' as unknown as mongoose.Types.ObjectId,
    name: 'Test',
    access_token: 'Token',
};

describe('ChatService', () => {
    let chatService: ChatService;
    let chatModel: Model<Chat>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: getModelToken('Chat'),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockChat),
                        constructor: jest.fn().mockResolvedValue(mockChat),
                        find: jest.fn(),
                        create: jest.fn(),
                        exec: jest.fn(),
                        findOne: jest.fn(),
                        findOneAndUpdate: jest.fn(),
                    },
                },
                {
                    provide: AuthService,
                    useValue: {},
                },
            ],
        }).compile();

        chatService = module.get<ChatService>(ChatService);
        chatModel = module.get<Model<Chat>>(getModelToken('Chat'));
    });

    it('should be defined', () => {
        expect(chatService).toBeDefined();
    });

    it('should return chat from session id', async () => {
        jest.spyOn(chatModel, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockChat),
        } as any);

        const response = await chatService.getChatFromSession('asd');

        expect(response).toStrictEqual(mockChat);
    });

    it('should save the chat on the existing chat', async () => {
        const updatedChat = {
            _id: 'chat_id' as unknown as ObjectId,
            question: ['hi', 'hello'],
            answer: ['answer1', 'answer2'],
        };

        jest.spyOn(chatService, 'findChat').mockResolvedValue(mockChat);
        let updatedMockChat = (mockChat.chats = updatedChat);
        jest.spyOn(chatModel, 'findOneAndUpdate').mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedMockChat),
        } as any);

        const response = await chatService.saveChat(
            'asd' as unknown as mongoose.Types.ObjectId,
            'asd',
            'hello',
            'answer2',
        );

        expect(response).toStrictEqual(updatedChat);
    });

    it('should save a new instance of the chat', async () => {
        jest.spyOn(chatService, 'findChat').mockResolvedValue(null);
        jest.spyOn(chatModel, 'create').mockResolvedValue(mockChat as any);

        const response = await chatService.saveChat(
            'asd' as unknown as mongoose.Types.ObjectId,
            'asd',
            'hi',
            'answer1',
        );
        expect(response).toStrictEqual(mockChat);
    });
});
