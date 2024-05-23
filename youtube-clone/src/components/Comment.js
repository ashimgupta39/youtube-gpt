import React from "react";

const Comment = ({data})=>{
    const {name, text, replies,userImgUrl} = data;
    return(
        <div className="flex my-4 shadow-sm bg-gray-100 p-2 rounded-lg">
            <img className="w-8 h-8 rounded-full" src={userImgUrl} alt="user"/>
            <div className="px-3">
                <p className="font-bold">{name}</p>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default Comment