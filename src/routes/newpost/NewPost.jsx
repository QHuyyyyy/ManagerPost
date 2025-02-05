import React, { useState } from "react";
import { Form, Input, Button, message, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api"

const NewPost = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Xử lý khi form được submit
    const onFinish = async (values) => {
        setLoading(true);

        const currentTime = new Date().toISOString(); // Lấy thời gian hiện tại

        const newPost = {
            ...values,
            userId: "64a8f8e2b9a1d9a7c0a5f1e3", // Đặt userId mặc định
            createDate: currentTime,
            updateDate: currentTime,
            status: values.status ? "Active" : "Inactive", // Chuyển đổi giá trị Switch thành text
        };

        try {
            await api.post("/Post", newPost);
            message.success("Post created successfully!");
            navigate("/posts");
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Create New Post</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    title: "",
                    description: "",
                    status: true, // Mặc định là Active
                    image: "",
                    video: "",
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
                    <Input.TextArea placeholder="Enter post description" autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

                <Form.Item label="Status" name="status" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item
                    label="Image URL"
                    name="image"
                    rules={[{ required: true, message: "Please enter image URL!" }]}
                >
                    <Input placeholder="Enter image URL" />
                </Form.Item>

                <Form.Item label="Video URL" name="video">
                    <Input placeholder="Enter video URL (optional)" />
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
