import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import api from '../api';
import { Footer } from '@/layouts/footer';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/User');
      setUsers(response.data);
    } catch (error) {
      message.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch users'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create/Update user
  const handleSubmit = async (values) => {
    try {
      const currentTime = Date.now();
      const userData = {
        ...values,
        createDate: editingUser ? editingUser.createDate : currentTime,
        updateDate: currentTime
      };

      if (editingUser) {
        await api.put(`/User/${editingUser.id}`, userData);
        message.success('User updated successfully');
      } else {
        await api.post('/User', userData);
        message.success('User created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Operation failed: ' + error.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.delete(`/User/${id}`);
          message.success('User deleted successfully');
          fetchUsers();
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  // Open modal for editing
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      fixed: 'left',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: true,
      render: (text) => (
        <div className="whitespace-normal">{text}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <div className="whitespace-normal">{text}</div>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '15%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Updated Date',
      dataIndex: 'updateDate',
      key: 'updateDate',
      width: '15%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button 
            type="text"
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(record)}
            icon={<Pencil size={16} />}
          >
            Edit
          </Button>
          <Button
            type="text"
            className="flex items-center text-red-600 hover:text-red-800"
            onClick={() => handleDelete(record.id)}
            icon={<Trash2 size={16} />}
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
        <Button
          type="primary"
          className="flex items-center gap-2"
          onClick={() => navigate('/users/new')}
          icon={<PlusCircle size={16} />}
        >
          Add User
        </Button>
      </div>

      <div className="flex-grow rounded-lg bg-white p-6 shadow-md dark:bg-slate-900">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
            className: 'dark:text-slate-200',
          }}
          className="dark:text-slate-200"
        />
      </div>

      <Modal
        title={<span className="text-lg font-semibold">{editingUser ? 'Edit User' : 'Add New User'}</span>}
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
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input className="dark:bg-slate-800 dark:text-slate-200" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input className="dark:bg-slate-800 dark:text-slate-200" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !editingUser, message: 'Please input the password!' }]}
          >
            <Input.Password className="dark:bg-slate-800 dark:text-slate-200" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </div>
  );
};

export default UserManagement;
