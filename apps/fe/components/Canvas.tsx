"use client";
import { useRef, useEffect, useState } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false)
  useEffect(() => {
    if(canvasRef.current){
        const canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const ctx = canvas.getContext("2d")
        if(!ctx) return;
        
        ctx.clearRect
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5;
        let startX = 0;
        let startY = 0;
        

        canvas.addEventListener('mousedown', (e: MouseEvent) => {
            isDrawingRef.current = true
            startX = e.clientX
            startY = e.clientY
            console.log(isDrawingRef.current, startX, startY)
        })
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
          if(isDrawingRef.current === true){
            const width = e.clientX - startX
            const height = e.clientY - startY
            console.log(isDrawingRef, e.clientX, e.clientY)

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
            ctx.strokeRect(startX, startY, width, height)
          } 
        })
        canvas.addEventListener('mouseup', (e: MouseEvent) => {
            isDrawingRef.current = false
        })
    }
  }, [canvasRef])

  return (
    <canvas ref={canvasRef} className="bg-black"></canvas>
  );
}