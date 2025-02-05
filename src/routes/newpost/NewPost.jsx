import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Select } from "antd";

const api = axios.create({
    baseURL: "https://67a30cd1409de5ed52573013.mockapi.io/api/v1/posts",
});

const NewPost = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const onFinish = (values) => {
        setLoading(true);

        api.post("/posts", values)
            .then((response) => {
                setLoading(false);
                message.success("Post created successfully!");
                navigate("/posts");
            })
            .catch((error) => {
                setLoading(false);

                // Kiểm tra nếu API có phản hồi chi tiết lỗi
                const errorMessage = error.response?.data?.message || "Failed to create post";
                message.error(errorMessage);
            });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Create New Post</h2>
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    title: "",
                    description: "",
                    status: "draft",
                }}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please enter the title!" }]}
                >
                    <Input placeholder="Enter post title" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter the description!" }]}
                >
                    <Input.TextArea placeholder="Enter post description" autoSize={{ minRows: 3, maxRows: 15 }} />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Please select post status!" }]}
                >
                    <Select>
                        <Select.Option value="draft">Draft</Select.Option>
                        <Select.Option value="published">Published</Select.Option>
                    </Select>
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Post
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default NewPost;
