import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMemu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import store from "../utils/store";
import { cacheResults } from "../utils/searchSlice";
import { Link, useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

export default function Head(){
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const navigate = useNavigate();
    
    const searchCache = useSelector(store=> store.search)

    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(searchCache[searchQuery]){
                setSuggestions(searchCache[searchQuery])
            }
            else{
                getSearchQuerySuggestions()
            }
        },200);

        return () =>{
            clearTimeout(timer)
        };
    },[searchQuery])

    const getSearchQuerySuggestions = async()=>{
        // const PROXY_URL = 'https://corsproxy.io/';
        console.log( "/getSearchResults?q=" + searchQuery)
        const data = await fetch("/getSearchResults?q=" + searchQuery);
        const json = await data.json()
        // console.log(json[1])
        setSuggestions(json[1])
        dispatch(cacheResults({
            [searchQuery] : json[1]
        }))
    }
    
    const toggleMemuHandler = ()=>{
        dispatch(toggleMemu())
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const query = searchQuery.split(" ").join("+");
            navigate("/search?q=" + query);
        }
    };
    const handleSearchClick = () => {
        const query = searchQuery.split(" ").join("+");
        navigate("/search?q=" + query);
    };
    return(
        <div className = "fixed top-0 left-0 right-0 grid grid-flow-col p-3 mt-0 shadow-lg mb-12 bg-white">
            <div className="flex col-span-1">
                <img onClick={()=>{toggleMemuHandler()}} className="h-8 cursor-pointer" alt="menu" src = "https://cdn2.iconfinder.com/data/icons/most-useful-icons-4/50/HAMBURGER_MENU-512.png"/>
                <a href="/"><img className="h-8 mx-2" alt="logo" src = "https://logodownload.org/wp-content/uploads/2014/10/youtube-logo-9.png"/></a>
            </div>
            <div className="col-span-10" style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                <input className="pb-0.5 w-[30rem] border border-gray-400 p-2 rounded-l-full" type = "text"  
                value={searchQuery}
                onChange={(e)=>{setSearchQuery(e.target.value)}}
                onFocus={()=> setShowSuggestions(true)}
                onBlur={() => {setTimeout(()=>setShowSuggestions(false),500)}}
                onKeyDown={handleKeyDown}
                />
                <button className="border border-gray-400 p-2 rounded-r-full bg-gray-100" style={{ boxSizing: 'border-box' }} onClick={handleSearchClick}>
                    <img className="h-[18px]" alt="search" src="https://clipground.com/images/search-vector-clipart-1.jpg"/>
                </button>
                { showSuggestions &&(
                <div className="fixed bg-white px-5 w-[30rem] rounded-lg shadow-lg border border-gray-100">
                    <ul>
                        {suggestions && suggestions.map((s) =>{
                            const par = s.split(" ").join("+");
                            // console.log(s+"   "+par);
                            return(
                                <Link key={s} to={"/search?q="+par}>
                                 <li key={s} className="py-2 font-bold hover:bg-gray-100">{s}</li>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
                )}
                </div>
                
            </div>
            <div className="col-span-1">
                <img className="h-8" alt="user icon" src = "https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0"/>
            </div>
        </div>
    )
}