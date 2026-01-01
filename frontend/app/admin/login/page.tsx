'use client';

import { Button, Form, Input, Card, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const { Title } = Typography;

export default function AdminLoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAdminAuth();

  const onFinish = async (values: any) => {
    console.log("onFinish triggered", values);
    setLoading(true);
    try {
      if (values.username === 'admin' && values.password === 'password') {
        message.success('Login successful!');
        console.log("Calling login function");
        login('fake-admin-token', values.username, 'admin');
      } else {
        message.error('Invalid username or password.');
        console.log("Invalid credentials");
      }
    } catch (error) {
      message.error('An error occurred during login.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
      console.log("Login process finished");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Admin Login</Title>
        </div>
        <Form
          form={form}
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input placeholder="Username (e.g., admin)" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password placeholder="Password (e.g., password)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
