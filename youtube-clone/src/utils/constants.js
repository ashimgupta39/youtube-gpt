// const API_KEY = "AIzaSyDttmfrkpWzZyxlWMJHzKeYAoAL-xcofj8"
const API_KEY = "AIzaSyCFORZavDOk44iamyfWWvpAbBJ6c8vB4kg"

const PROXY_URL = "https://cors-anywhere.herokuapp.com/"

export const YOUTUBE_VIDEOS_API = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key="+API_KEY;

export const VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,liveStreamingDetails&key="+API_KEY+"&id="

export const CHANNEL_DETAILS_URL = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&key="+API_KEY+"&id="

export const YOUTUBE_SEARCH_API = "http://localhost:5000/getSearchResults?q="
// "https://youtube-clone-backend-tan.vercel.app/getSearchResults?q=";
// "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=";


export const COMMENTS_API_URL = "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=99&key="+API_KEY+"&videoId="

export const get_YOUTUBE_SEARCH_URL = (searchParams) => {
    const URL = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchParams}&key=${API_KEY}`;
    return URL;
}