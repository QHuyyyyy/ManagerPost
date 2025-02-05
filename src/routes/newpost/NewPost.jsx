// NewPost.jsx
import React, { useState } from "react";
import PostForm from "./PostForm";
import "./NewPost.css";
const NewPost = () => {
    return (
        <div className="new-post-container">
            <h1>NEW POST</h1>
            <PostForm />
        </div>
    );
};

export default NewPost;
