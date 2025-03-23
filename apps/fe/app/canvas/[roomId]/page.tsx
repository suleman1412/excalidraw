"use client"
import Canvas from "@/components/Canvas";
import { RectangleHorizontal } from 'lucide-react';

export default function CanvasPage(){
    return (
        <div className="overflow-hidden overflow-y-hidden">
            <div className="flex px-5 py-2 absolute w-100 bg-white text-black rounded-md h-10 top-5 left-1/2 -translate-x-1/2">
                <button className="hover:bg-gray-400"><RectangleHorizontal/></button>
            </div>
            <Canvas />
        </div>
    )
}