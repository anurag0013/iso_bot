import { ObjectId } from "mongoose";

export interface ChatInteface<T>{
    question: string[],
    answer: string[],
    _id: ObjectId
}