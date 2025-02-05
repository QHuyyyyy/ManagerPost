import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const currentTime = Date.now();
      const userData = {
        ...values,
        createDate: currentTime,
        updateDate: currentTime
      };

      await api.post('/User', userData);
      message.success('User created successfully');
      navigate('/users');
    } catch (error) {
      message.error('Operation failed: ' + error.message);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New User</h1>
      </div>

      <div className="flex-grow rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-lg mx-auto"
        >
          <Form.Item
            name="name"
            label={<span className="text-slate-700 dark:text-slate-200">Name</span>}
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input 
              className="h-10 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-slate-700 dark:text-slate-200">Email</span>}
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              className="h-10 dark:bg-slate-700 dark:text-white dark:border-slate-600"
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-slate-700 dark:text-slate-200">Password</span>}
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password 
              className="h-10 dark:bg-slate-700 dark:text-white dark:border-slate-600"
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-8">
            <div className="flex justify-end gap-4">
              <Button 
                onClick={() => navigate('/users')}
                className="min-w-[100px] h-10"
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="min-w-[100px] h-10"
              >
                Create User
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NewUser;
