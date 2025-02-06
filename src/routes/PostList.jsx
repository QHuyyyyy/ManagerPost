import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Switch } from 'antd';
import api from '../api';
import { Footer } from '@/layouts/footer';
import dayjs from 'dayjs';
import { getUserByEmail } from "../api";
import { UserAuth } from '../AuthContext';
const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const { user } = UserAuth();
  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Post');
      console.log('API Response:', response);
      setPosts(response.data);
    } catch (error) {
      console.error('Error details:', error);
      message.error(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch posts'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create/Update post
  const handleSubmit = async (values) => {
    try {
      const currentTime = Date.now();
      const mockApiUser = await getUserByEmail(user.email);
      
      if (!mockApiUser) {
        message.error("User not found in system");
        return;
      }

      const postData = {
        ...values,
        userId: mockApiUser.id,
        createDate: editingPost ? editingPost.createDate : currentTime,
        updateDate: currentTime
      };

      if (editingPost) {
        await api.put(`/Post/${editingPost.id}`, postData);
        message.success('Post updated successfully');
      } else {
        await api.post('/Post', postData);
        message.success('Post created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchPosts();
    } catch (error) {
      message.error('Operation failed: ' + error.message);
    }
  };

  // Delete post
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/Post/${id}`);
          message.success('Post deleted successfully');
          fetchPosts();
        } catch (error) {
          message.error('Failed to delete post: ' + error.message);
        }
      },
    });
  };

  // Open modal for editing
  const handleEdit = (record) => {
    setEditingPost(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
    },
    {
      title: 'UserId',
      dataIndex: 'userId',
      key: 'userId',
      width: '5%',
      render: (userId) => (
        <div title={userId}>
          {userId.length > 8 ? `${userId.slice(0, 8)}...` : userId}
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
      render: (text) => (
        <div className="whitespace-normal break-words">
          {text}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      render: (text) => (
        <div className="whitespace-normal break-words line-clamp-3">
          {text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {status ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (image) => (
        <img src={image} alt="Image" className="h-16 w-16 rounded-lg object-cover" />
      ),
    },
    {
      title: 'Video',
      dataIndex: 'video',
      key: 'video',
      width: '10%',
      render: (video) => video ? (
        <a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          View Video
        </a>
      ) : 'N/A',
    },
    {
      title: 'Created Date',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '12%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Updated Date',
      dataIndex: 'updateDate',
      key: 'updateDate',
      width: '12%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '8%',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="text"
            className="flex items-center text-red-600 hover:text-red-800"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Post Management</h1>
      </div>

      <div className="flex-grow rounded-lg bg-white p-6 shadow-md dark:bg-slate-900">
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} posts`,
            className: 'dark:text-slate-200',
          }}
          className="dark:text-slate-200"
        />
      </div>

      <Modal
        title={<span className="text-lg font-semibold">{editingPost ? 'Edit Post' : 'Add New Post'}</span>}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className="dark:text-slate-200"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input className="dark:bg-slate-800 dark:text-slate-200" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea
              rows={4}
              className="dark:bg-slate-800 dark:text-slate-200"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: 'Please input the image URL!' }]}
          >
            <Input className="dark:bg-slate-800 dark:text-slate-200" />
          </Form.Item>

          <Form.Item
            name="video"
            label="Video URL"
          >
            <Input className="dark:bg-slate-800 dark:text-slate-200" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingPost ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default PostManagement;