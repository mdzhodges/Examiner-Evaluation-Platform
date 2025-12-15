import { Schema, model } from "mongoose";

export interface Examiner {
    examiner_name: string;
}

const ExaminerSchema = new Schema<Examiner>(
    {
        examiner_name: {
            type: String,
            required: true,
            index: true
        }
    },
    {
        collection: "Examiner"
    }
);

export const Examiner = model<Examiner>(
    "Examiner",
    ExaminerSchema
);