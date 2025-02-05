import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";
import { useState, useEffect, useRef } from "react";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;
import { getPost } from "../../api";    

const updatePost = async (id, data) => {
    try {
      const response = await api.put(`/Post/${id}`, data);
      return response.data;
    } catch (error) {
        console.log(error)
      throw new Error(error.response?.data?.message || "Failed to update post");
    }
  };

const DashboardPage = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const data = await getPost();
        setPostData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    form.setFieldsValue(post);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
        await updatePost(editingPost.id, { ...editingPost, ...values });
      message.success("Post updated successfully");
      setModalVisible(false);
      form.resetFields();
      getPost();
      setPostData((prev) =>
        prev.map((p) => (p.id === editingPost.id ? { ...p, ...values } : p))
      );
    } catch (error) {
      message.error("Failed to update post");
    }
  };

  const handleStatusChange = async (status) => {
    try {
        await updatePost(editingPost.id, { ...editingPost, status });
        message.success("Post status updated successfully");
        setStatusModalVisible(false);
        form.resetFields();
      getPost();
        setPostData((prev) =>
          prev.map((p) => (p.id === editingPost.id ? { ...p, status } : p))
        );
      } catch (error) {
        message.error("Failed to update post status");
      }

  }

  const statusMenu = (
    <Menu>
      <Menu.Item onClick={() => handleStatusChange(false)} style={{
        color:"red"
      }}>Inactive</Menu.Item>
    </Menu>
  );

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid md:grid-cols-1 grid-cols-1 place-items-center gap-2 mb-14">
        {postData.map((post) =>
          post.status===true||post.status==="active"||post.status==="Active" ? (
            <Card
              key={post.id}
              style={{ width: "60%" }}
              actions={[
                <Dropdown overlay={statusMenu} trigger={["click"]}>
                <SettingOutlined key="setting" onClick={() => setEditingPost(post)} />
              </Dropdown>,
                <EditOutlined key="edit" onClick={() => handleEdit(post)} />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={post.title || "Untitled Post"}
                description={post.description || "No description available"}
              />
              <img
                alt={post.title || "Post Image"}
                src={post.image || "https://via.placeholder.com/300"}
                style={{ width: "100%", height: "400px", marginTop: "10px", objectFit: "fill" }}
              />
              {post.video && post.video.includes("youtube.com") || post.video.includes("youtu.be") ? (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${post.video.split("v=")[1] || post.video.split("/").pop()}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{ marginTop: "10px", borderRadius: "8px", cursor: "pointer" }}
          ></iframe>
        ) : null}
            </Card>
          ) : null
        )}
      </div>

      <Modal
        title="Edit Post"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title!" }]}> 
            <Input /> 
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}> 
            <Input.TextArea rows={4} /> 
          </Form.Item>

          <Form.Item name="status" label="Status" valuePropName="checked"> 
            <Switch /> 
          </Form.Item>

          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: "Please input the image URL!" }]}> 
            <Input /> 
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Update</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default DashboardPage;
