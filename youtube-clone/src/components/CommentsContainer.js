import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { COMMENTS_API_URL } from "../utils/constants";

const CommentList = ({comments})=>{
    return comments.map((comment, index)=>(
        <div key={index}>
            <Comment data={comment}/>
            <div className="pl-5 border border-l-black ml-5">
                <CommentList comments = {comment.replies} />
            </div>
         </div>
    ))
};

const CommentsContainer = ({videoID})=>{
    const [commentThreads,setCommentThreads] = useState([])
    const [commentsData, setCommentsData] = useState([]) // Use a state variable

    const makeCommentsDataList = ()=>{
        let commentsDataTemp = [] // Use a temporary variable
        commentThreads.map((comment)=>{
            const comment_replies = []
            if(comment.snippet.totalReplyCount > 0 && comment.replies){
                comment.replies.comments.map((reply)=>{
                    const replyObject = {
                        name: reply.snippet.authorDisplayName,
                        text: reply.snippet.textDisplay,
                        userImgUrl: reply.snippet.authorProfileImageUrl,
                        replies: []
                    }
                    comment_replies.push(replyObject)
                })
            }
            const commentObject = {
                name: comment.snippet.topLevelComment.snippet.authorDisplayName,
                text: comment.snippet.topLevelComment.snippet.textDisplay,
                userImgUrl: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
                replies: comment_replies
            }
            commentsDataTemp.push(commentObject)
        })
        setCommentsData(commentsDataTemp) // Update the state variable
    }

    useEffect(()=>{
        makeCommentsDataList();
    },[commentThreads])

    const getCommentThreads = async()=>{
        const data = await fetch(COMMENTS_API_URL+videoID)
        const jsonData = await data.json()
        setCommentThreads(jsonData.items)
    }

    useEffect(()=>{
        getCommentThreads();
    },[videoID])

    return (
        <div className="m-5 p-2">
            <h1 className="text-2xl font-bold">Comments</h1>
            <CommentList comments = {commentsData}/>
        </div>
    )
}

export default CommentsContainer
