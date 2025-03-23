import { roomIdSchema, roomSchema } from "@repo/common/schema";
import { Request, Response, Router } from "express";
import { prismaClient } from "@repo/db/client";
import authenticateToken from "./middleware";

const roomRouter: Router = Router()

roomRouter.post('/create', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { success, data, error } = roomSchema.safeParse(req.body)
        if (!success) {
            res.status(400).json({ error: error.issues })
            return;
        }
        // console.log(req.userId)
        if (!req.userId) return;
        const room = await prismaClient.room.create({
            data: {
                name: data.name,
                ownerId: req.userId
            }
        })
        res.status(201).json({
            message: `New Room Created for user: ${room.ownerId}`,
            roomId: room.id
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            e
        })
        return;
    }
})



export default roomRouter