import { Link } from "react-router-dom";
import {VIDEO_DETAILS_URL, CHANNEL_DETAILS_URL} from "../utils/constants"
import { useState, useEffect } from "react";

const SearchCard = ({ data }) => {
  const [channelData, setChannelData] = useState([])
  const [videoData, setVideoData] = useState([])
  console.log("search card data-")
  console.log(data);
  const { channelTitle, description, publishedAt, thumbnails, title, channelId } = data.snippet;
  const { videoId } = data.id;
  
  const getChannelData = async()=>{
    const data = await fetch(CHANNEL_DETAILS_URL+channelId)
    const jsonData = await data.json()
    setChannelData(jsonData.items)
  }
  useEffect(()=>{
    getChannelData();
    getVideoData();
  },[data])
  console.log(channelData)
    let channelSnippet, channelStats;
    if(channelData && channelData[0]){
        channelSnippet = channelData[0].snippet;
        channelStats = channelData[0].statistics;
    }
  const getVideoData = async()=>{
    const data = await fetch(VIDEO_DETAILS_URL+videoId)
    const videoJson = await data.json()
    // console.log("video data-")
    // console.log(videoJson.items)
    setVideoData(videoJson.items)
    }
    let snippet, statistics;
    if (videoData[0]) {
        snippet = videoData[0].snippet;
        statistics = videoData[0].statistics;
    }
  const date = publishedAt.split("T")[0];
  return (
    <>
      <Link to={"/watch?v=" + videoId}>
        <div className="flex m-1 p-1">
          <img
            alt="thumbnail"
            className="rounded-lg"
            src={thumbnails.medium.url}
          />
          <ul className="ml-2">
            {/* <li className="flex-end justify-end">
              <span className="text-[18px] ml-auto">{title}</span>
              <button cursor-pointer className="h-10 w-20 ml-auto">I</button>
            </li> */}
            <li className="text-[18px]">{title}</li>
            <li className="mb-2 text-xs  text-gray-500">{((statistics?.viewCount)>1000000)?(((statistics?.viewCount)/1000000).toFixed(1)+"M"):((statistics?.viewCount)/1000).toFixed(1)+"K"} views</li>
            <li className="text-xs flex text-gray-500">
            <img 
                alt="user" 
                src={channelSnippet?.thumbnails.default.url} 
                className="w-10 h-10 rounded-full mr-2"
            /> 
              <span className="text-center mt-1 ml-1">{channelTitle}</span>
            </li>
            <li className="mt-2 text-xs">{description}</li>
          </ul>
        </div>
      </Link>
    </>
  );
};

export default SearchCard;