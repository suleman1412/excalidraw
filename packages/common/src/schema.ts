import { z } from 'zod';

export const authSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const roomSchema = z.object({
    name: z.string().min(3, "Room Name should be minimum of 3 letters").max(10, "Room Name should be maximum of 10 letters")
})

export const roomIdSchema = z.object({
    roomId: z.string().cuid()
})