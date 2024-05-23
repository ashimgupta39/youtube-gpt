import { useEffect } from "react"
import ChatMessage from "./ChatMessage"

const LiveChat = ()=>{
    // useEffect(()=>{
    //     //API Polling-
    //     const i = setInterval(()=>{
    //         console.log("API Polling")
    //     }, 2000)

    //     return () => clearInterval(i)
    // },[])
    return(
        <div className="ml-5 p-2 border border-black w-[400px] h-[425px] bg-slate-100 rounded-lg">
            <ChatMessage name="Ashim Gupta" message="dummy live chat message."/>
            <ChatMessage name="Ashim Gupta" message="dummy live chat message."/>
            <ChatMessage name="Ashim Gupta" message="dummy live chat message."/>
            <ChatMessage name="Ashim Gupta" message="dummy live chat message."/>
            <ChatMessage name="Ashim Gupta" message="dummy live chat message."/>
        </div>
    )
}

export default LiveChat