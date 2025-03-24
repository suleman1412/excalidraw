"use client"
import initDraw from '@/draw';
import { RectangleHorizontal } from 'lucide-react';
import { useEffect, useRef } from "react";

export default function CanvasPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false)
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initDraw(canvas, isDrawingRef)
        }
    }, [])
    return (
        <div className="">
            <div className="flex px-5 py-2 absolute w-100 bg-white text-black rounded-md h-10 top-5 left-1/2 -translate-x-1/2">
                <button className="hover:bg-gray-400"><RectangleHorizontal /></button>
            </div>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}
