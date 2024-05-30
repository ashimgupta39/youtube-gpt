import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../utils/appSlice";
import { useSearchParams } from "react-router-dom";
import { VIDEO_DETAILS_URL, CHANNEL_DETAILS_URL } from "../utils/constants"
import CommentsContainer from "./CommentsContainer";
import LiveChat from "./LiveChat";

const WatchPage = () => {
    const [searchParams] = useSearchParams()
    const [videoData, setVideoData] = useState([])
    const [channelData, setChannelData] = useState([])
    const [youtubeGPTChat, setYoutubeGPTChat] = useState([{"sender":"YoutubeGPT", "message":"Ask me anything regarding this video?"}])
    const [prompt, setPrompt] = useState()
    const dispatch = useDispatch()

    const getVideoData = async () => {
        const data = await fetch(VIDEO_DETAILS_URL + searchParams.get("v"))
        const videoJson = await data.json()
        console.log("video data-")
        // console.log(videoJson.items)
        setVideoData(videoJson.items)
    }
    const getChannelDetails = async (channel_ID) => {
        console.log(CHANNEL_DETAILS_URL + channel_ID)
        const channelData = await fetch(CHANNEL_DETAILS_URL + channel_ID)
        const channelJsonData = await channelData.json()
        setChannelData(channelJsonData.items)
    }
    useEffect(() => {
        dispatch(closeMenu());
        getVideoData();
    }, [])

    let snippet, statistics;
    if (videoData[0]) {
        snippet = videoData[0].snippet;
        statistics = videoData[0].statistics;
    }

    console.log(statistics)
    console.log(snippet)
    let channelID;
    if (snippet) {
        channelID = snippet.channelId
    }

    useEffect(() => {
        if (channelID) {
            getChannelDetails(channelID);
        }
    }, [channelID])

    console.log(channelData)
    let channelSnippet, channelStats;
    if (channelData && channelData[0]) {
        channelSnippet = channelData[0].snippet;
        channelStats = channelData[0].statistics;
    }
    const handleSendMessage = ()=>{
        if(prompt.trim() !== ""){
            const newMsg = {"sender":"You", "message":prompt}
            setYoutubeGPTChat([...youtubeGPTChat, newMsg])
            setPrompt("")
        }
    }

    const getPromptResponse = async(youtubeGPTChat)=>{
        let request_body = {}
        //check if the last msg sent is by the user-
        if(youtubeGPTChat[(youtubeGPTChat.length) - 1].sender === "You"){
            // if it is the first msg-
            if(youtubeGPTChat.length === 2){
                // make the request with youtube link
                request_body = {
                    "query": youtubeGPTChat[1].message,
                    "youtube_link": "https://www.youtube.com/watch?v="+searchParams.get("v"),
                    "model_name":"llama3-70b-8192"
                }
            }
            //else
            else{
                // make the request without youtube link
                request_body = {
                    "query": youtubeGPTChat[youtubeGPTChat.length -1].message,
                    "model_name":"llama3-70b-8192"
                }
            }
            console.log(request_body)
            // make the request-
            const promptResponse = await fetch("http://100.25.147.28:8000/chat",{
                method:'POST',
                headers:{
                    'Accept' : '*/*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(request_body)
            });
            if (!promptResponse.ok) {
                throw new Error(`HTTP error! status: ${promptResponse.status}`);
            }

            const responseData = await promptResponse.json();
            console.log(responseData);
            setYoutubeGPTChat([...youtubeGPTChat,{"sender":"YoutubeGPT","message":responseData.response}])
        }
    }

    useEffect(()=>{
        getPromptResponse(youtubeGPTChat);
    },[youtubeGPTChat])
    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-full">
                <div className="px-5 flex w-full">
                    <div className="m-1 p-1">
                        <div className="flex flex-row">
                            <iframe className="rounded-lg"
                                width="875"
                                height="425"
                                src={"https://www.youtube.com/embed/" + searchParams.get("v")}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                            {/* <div className="flex flex-col">
                                <LiveChat/>
                            </div> */}
                            <div className="ml-8 border border-gray w-[400px] rounded-lg shadow-lg">
                                <div className="flex flex-col md:grid md:grid-cols-1 gap-2">
                                <div className="rounded-md p-1 font-bold flex justify-center relative">
                                    TransCribe
                                    <select className="outline-none w-0 left-2 px-2 bg-white rounded-md">
                                        <option value="option2">llama3-70b-8192</option>
                                        <option value="option3">llama3-8b-8192</option>
                                        <option value="option1">Ogemma-7b-it</option>
                                        <option value="option3">mixtral-8x7b-32768</option>
                                    </select>
                                </div>
                                    <div className="border border-black-100 p-4 md:h-80 whitespace-normal max-h-80 overflow-ellipsis overflow-hidden ... overflow-y-auto text-sm">
                                        {youtubeGPTChat.map((msg, index) => (
                                            <div key={index} className="mt-3">
                                                <span className="font-bold">{msg.sender}: </span>
                                                {msg.message}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <input className="w-[320px] ml-3 bg-gray-200 rounded-lg shadow-lg p-1 pl-2 text-sm outline-none"
                                        value = {prompt}
                                        onChange={(e)=>{setPrompt(e.target.value)}}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        ></input>
                                        <button className="w-10 h-10 border-black rounded-full hover:bg-gray-100 ml-1"
                                        onClick={handleSendMessage}
                                        >🗨️</button>
                                    </div>
                                </div>
                            </div>
                            {/* <div class="border rounded p-4">
                                <div class="flex flex-col md:grid md:grid-cols-1 gap-4">
                                    <div class="bg-gray-200 rounded-md p-4"></div>
                                    <div class="bg-gray-200 rounded-md p-4"></div>
                                    <div class="bg-gray-200 rounded-md p-4"></div>
                                </div>
                            </div> */}
                        </div>
                        <div className="my-2 p-2">
                            <h2 className="text-xl font-bold">{snippet?.title}</h2>
                            <p className="text-gray-500">{((statistics?.viewCount) > 1000000) ? (((statistics?.viewCount) / 1000000).toFixed(1) + "M") : ((statistics?.viewCount) / 1000).toFixed(1) + "K"} views  •  {statistics?.likeCount} likes</p>
                            <div className="flex items-center mt-4">
                                <img
                                    alt=""
                                    src={channelSnippet?.thumbnails.default.url}
                                    className="w-10 h-10 rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-600">{snippet?.channelTitle}</h3>
                                    <p className="text-gray-500">{(channelStats?.subscriberCount) > 1000000 ? ((channelStats?.subscriberCount) / 1000000 + "M") : ((channelStats?.subscriberCount) / 1000).toFixed(1) + "K"} subscribers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommentsContainer videoID={searchParams.get("v")} />
        </div>
    )

}

export default WatchPage
