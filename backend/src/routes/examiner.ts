import express, { Router } from "express";
import type { Request, Response } from "express";
import { RepresentativeAnswerModel } from "../../db/representative_answer.js";
import { ExaminerEvaluationModel } from "../../db/evaluation.js";
import { Examiner } from "../../db/examiner.js";




const router: Router = express.Router();

router.get("/login", async (req: Request, res: Response) => {
    try {
        const { username, timestamp } = req.query;

        if (!username) {
            return res.status(400).json({ message: "Name required" });
        }

        const date = timestamp ? new Date(timestamp as string) : new Date();

        if (!isBetween8And12EST(date)) {
            return res.status(403).json({ message: "Login not allowed at this time" });
        }



        const examiner = await Examiner.create({
            examiner_name: String(username)
        });
        return res.status(200).json({ message: "Login allowed" });
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/getQuestions", async (_: Request, res: Response) => {
    try {
        const representativeAnswers = await RepresentativeAnswerModel.find(
            {},

        ).sort({ question_id: 1 });

        res.status(200).json({
            count: representativeAnswers.length,
            data: representativeAnswers
        });
    } catch (error) {
        console.error("Error fetching representative answers:", error);
        res.status(500).json({ error: "Failed to fetch representative answers" });
    }
});


export const createExaminerEvaluation = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const {
            examiner_id,
            representative_answer_id,
            grade
        } = req.body;

        if (!examiner_id || !representative_answer_id || !grade) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const evaluation = await ExaminerEvaluationModel.create({
            examiner_id,
            representative_answer_id,
            grade
        });

        return res.status(201).json(evaluation);

    } catch (err: any) {
        // Duplicate evaluation (unique compound index)
        if (err.code === 11000) {
            return res.status(409).json({
                error: "Evaluation already submitted for this examiner and answer"
            });
        }

        return res.status(500).json({
            error: "Failed to create examiner evaluation"
        });
    }
};

router.post("/examinerResponse", createExaminerEvaluation)



function isBetween8And12EST(date: Date = new Date()): boolean {
    const estTime = new Date(
        date.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    const hour = estTime.getHours();
    return hour >= 8 && hour < 12;
}


export const createRepresentativeAnswer = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const {
            question_id,
            question_text,
            cluster_id,
            representative_answer_text,
            cluster_frequency,
            model_contributions
        } = req.body;

        if (
            !question_id ||
            !question_text ||
            !cluster_id ||
            !representative_answer_text ||
            !cluster_frequency ||
            !model_contributions
        ) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const representativeAnswer = await RepresentativeAnswerModel.create({
            question_id,
            question_text,
            cluster_id,
            representative_answer_text,
            cluster_frequency,
            model_contributions
        });

        return res.status(201).json(representativeAnswer);

    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};


router.post("/addAnswer", createRepresentativeAnswer)

export default router;