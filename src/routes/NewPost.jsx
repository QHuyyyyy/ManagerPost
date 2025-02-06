import React, { useState } from "react";
import { Form, Input, Button, message, Switch, Card } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { UserAuth } from "../AuthContext";
import { getUserByEmail } from "../api";

const NewPost = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { user } = UserAuth();

    const onFinish = async (values) => {
        setLoading(true);
        const currentTime = new Date().toISOString();

        try {
            const mockApiUser = await getUserByEmail(user.email);
            
            if (!mockApiUser) {
                message.error("User not found in system");
                return;
            }

            const newPost = {
                ...values,
                userId: mockApiUser.id,
                createDate: currentTime,
                updateDate: currentTime,
                status: values.status ? "Active" : "Inactive",
            };

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-3xl mx-auto">
                <Card className=" dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create New Post
                        </h1>
                        <Button 
                            onClick={() => navigate('/posts')}
                            className="bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                        >
                            Back to Posts
                        </Button>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="space-y-6"
                        initialValues={{
                            title: "",
                            description: "",
                            status: true,
                            image: "",
                            video: "",
                        }}
                    >
                        <Form.Item
                            label={<span className="text-slate-700 dark:text-slate-200 text-base font-semibold">Title</span>}
                            name="title"
                            rules={[{ required: true, message: "Please enter the title!" }]}
                        >
                            <Input 
                                placeholder="Enter post title" 
                                className="h-11 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 
                                dark:placeholder-slate-400 rounded-lg border-2 hover:border-blue-400 focus:border-blue-500"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-slate-700 dark:text-slate-200 text-base font-semibold">Description</span>}
                            name="description"
                            rules={[{ required: true, message: "Please enter the description!" }]}
                        >
                            <Input.TextArea 
                                placeholder="Enter post description" 
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                className="bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 
                                dark:placeholder-slate-400 rounded-lg border-2 hover:border-blue-400 focus:border-blue-500"
                            />
                        </Form.Item>

                        <Form.Item 
                            label={<span className="text-slate-700 dark:text-slate-200 text-base font-semibold">Status</span>}
                            name="status" 
                            valuePropName="checked"
                        >
                            <Switch 
                                checkedChildren="Active" 
                                unCheckedChildren="Inactive"
                                className="bg-slate-300 dark:bg-slate-600"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-slate-700 dark:text-slate-200 text-base font-semibold">Image URL</span>}
                            name="image"
                            rules={[{ required: true, message: "Please enter image URL!" }]}
                        >
                            <Input 
                                placeholder="Enter image URL" 
                                className="h-11 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 
                                dark:placeholder-slate-400 rounded-lg border-2 hover:border-blue-400 focus:border-blue-500"
                            />
                        </Form.Item>

                        <Form.Item 
                            label={<span className="text-slate-700 dark:text-slate-200 text-base font-semibold">Video URL</span>}
                            name="video"
                        >
                            <Input 
                                placeholder="Enter video URL (optional)" 
                                className="h-11 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 
                                dark:placeholder-slate-400 rounded-lg border-2 hover:border-blue-400 focus:border-blue-500"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0 flex justify-end">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="min-w-[120px] h-11 bg-blue-600 hover:bg-blue-700 
                                dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg"
                            >
                                Create Post
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default NewPost;