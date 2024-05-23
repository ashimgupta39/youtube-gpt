import React from "react";

const VideoCard = ({info})=>{
    // console.log(info)
    if(!info) return null;
    const {snippet, statistics} = info;
    if(!snippet) return null;
    const {channelTitle, title, thumbnails} = snippet;
    
    return (
        <div className="m-1 p-2 w-72 shadow-lg">
            <img className="rounded-lg" alt="thumbnail" src={thumbnails.medium.url}/>
            <ul>
                <li className="font-bold py-2">{title}</li>
                <li>{channelTitle}</li>
                <li>{((statistics.viewCount)>1000000)?(((statistics.viewCount)/1000000).toFixed(1)+"M"):((statistics.viewCount)/1000).toFixed(1)+"K"} views</li>
            </ul>
        </div>
    )
}

export default VideoCard