import { Router, Request, Response, NextFunction } from "express";
const router = Router();

router.get(
    "/health",
    (request: Request, response: Response, next: NextFunction) => {
        response.status(200).send("OK");
    }
);

export default router;