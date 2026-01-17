'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  message,
  Form,
  Input,
  Select,
  Switch,
  Typography,
  Table,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/app/admin/layout';
import { usersApi, User, ordersApi, Order } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

export default function UserDetailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await usersApi.getById(id);
        setUser(userData);
        form.setFieldsValue({
          username: userData.username,
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive,
        });
        
        // Fetch orders and filter by user email
        const allOrders = await ordersApi.getAll();
        const userOrders = allOrders.filter((order) => order.shippingAddress.email === userData.email);
        setOrders(userOrders);
        } catch (error) {
        message.error('Failed to fetch user details');
        console.error('Failed to fetch user:', error);
        router.push('/admin/users');
        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchData();
    }
  }, [id, router, form]);

  const handleUpdate = async (values: any) => {
    if (!user) return;

    try {
      const updatedUser = await usersApi.update(user._id, values);
      setUser(updatedUser);
      message.success('User updated successfully');
    } catch (error) {
      message.error('Failed to update user');
      console.error('Failed to update user:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div>User not found</div>
      </AdminLayout>
    );
  }

  const ordersColumns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'orange',
          processing: 'blue',
          shipped: 'cyan',
          delivered: 'green',
          cancelled: 'red',
        };
        return <Tag color={colorMap[status] || 'default'}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/admin/users')}>
            Back to Users
          </Button>
        </Space>

        <Title level={2}>User Details - {user.username}</Title>

        <Card style={{ marginBottom: 16 }}>
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
            </Form.Item>

            <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>

            <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

        <Card>
          <Title level={4}>Order History</Title>
          <Table
            columns={ordersColumns}
            dataSource={orders}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
