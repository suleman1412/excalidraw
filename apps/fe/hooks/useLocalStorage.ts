import axios from "axios";
import { useEffect, useState } from "react";

export function useLocalStorage(key: string, initialValue = '', roomId: string) {
    const [existingShapes, setExistingShapes] = useState(async () => {
        try {

            const savedItem = localStorage.getItem(key)
            if (!savedItem) return initialValue
            return savedItem
        } catch (e) {
            return initialValue
        }
    })

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return;

                const res = await axios.get(`http://localhost:8081/api/chat/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                // This will return me an ARRAY of top 10 ordered by createdAt
                const chats: [] = res.data.chats;
                


            } catch (e) {

            }
        }
        try {


            res.data.chats
            if (existingShapes === initialValue) {
                localStorage.setItem(key, '')
            } else {
                localStorage.setItem(key, existingShapes)
            }
        } catch (er) {
            console.error("Error saving to localstorage : ", er)
        }

    }, [key, existingShapes])

    return { existingShapes, setExistingShapes }
}