import { Model, UpdateWriteOpResult } from "mongoose";
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "./schema/user.schema";


@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}

    async createUser(user: CreateUserDTO): Promise<User>{
        const newUser = await this.userModel.create(user);
        return newUser;
    }

    async updateUserToken(user: CreateUserDTO): Promise<UpdateWriteOpResult>{
        return this.userModel.updateOne({name: user.name},{"$set":{access_token:user.access_token}}).exec()
    }

    async findUserByName(name: string): Promise<User | undefined>{
        return this.userModel.findOne({name: name}).exec();
    }

    
}
