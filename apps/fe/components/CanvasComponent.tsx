"use client";
import initDraw from "@/draw";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useRef } from "react";

export default function CanvasComponent({ roomId }: { roomId: string }) {
    const { existingShapes, setExistingShapes } = useLocalStorage('shapes', '', roomId)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false)
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initDraw(canvas, isDrawingRef, roomId, "70e3956a-80aa-40e9-ba54-d36bc07951ff", existingShapes, setExistingShapes)
        }
    }, [])
    return (
        <div>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}