import React, { useState } from "react";
import "./PostForm.css";

const PostForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Title:", title);
        console.log("Content:", content);
        console.log("Image:", image);
        setTitle("");
        setContent("");
        setImage(null);
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
                <label htmlFor="title">Tiêu đề</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="content">Nội dung</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Nhập nội dung bài viết"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="image">Tải lên hình ảnh</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {image && <img src={image} alt="Preview" className="image-preview" />}
            </div>

            <button type="submit" className="submit-btn">Đăng Bài</button>
        </form>
    );
};

export default PostForm;
