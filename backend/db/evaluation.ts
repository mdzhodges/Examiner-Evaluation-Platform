import { Schema, model, Types } from "mongoose";

export interface ExaminerEvaluation {
    examiner_id: Types.ObjectId;
    representative_answer_id: Types.ObjectId;
    grade: string;
    submitted_at: Date;
}

const ExaminerEvaluationSchema = new Schema<ExaminerEvaluation>(
    {
        examiner_id: {
            type: Schema.Types.ObjectId,
            ref: "Examiner",
            required: true,
            index: true
        },

        representative_answer_id: {
            type: Schema.Types.ObjectId,
            ref: "RepresentativeAnswer",
            required: true,
            index: true
        },

        grade: {
            type: String,
            required: true
        },

        submitted_at: {
            type: Date,
            default: () => new Date()
        }
    },
    {
        collection: "examiner_evaluations"
    }
);

export const ExaminerEvaluationModel = model<ExaminerEvaluation>(
    "ExaminerEvaluation",
    ExaminerEvaluationSchema
);
