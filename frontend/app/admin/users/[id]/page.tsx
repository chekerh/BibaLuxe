'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Switch, Select, Popconfirm } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';

const { Title } = Typography;
const { Option } = Select;

// Placeholder API for User Management - replace with actual backend integration
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  isActive: boolean;
}

const userApi = {
  getById: async (id: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const data: User[] = [
      { _id: 'u1', username: 'admin', email: 'admin@example.com', role: 'admin', isActive: true },
      { _id: 'u2', username: 'john.doe', email: 'john.doe@example.com', role: 'customer', isActive: true },
      { _id: 'u3', username: 'jane.smith', email: 'jane.smith@example.com', role: 'customer', isActive: false },
    ];
    const user = data.find(item => item._id === id);
    if (!user) throw new Error('User not found');
    return user;
  },
  create: async (payload: any): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Simulating user creation:', payload);
    return { _id: String(Math.random()), ...payload };
  },
  update: async (id: string, payload: any): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Simulating update of user ${id}:`, payload);
    return { _id: id, ...payload };
  },
};

export default function UserFormPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      const fetchUser = async () => {
        setLoading(true);
        try {
          const user = await userApi.getById(id);
          form.setFieldsValue(user);
        } catch (error) {
          message.error(t('admin.users.fetchDetailsError'));
          console.error('Failed to fetch user details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEditing) {
        await userApi.update(id, values);
        message.success(t('admin.users.updateSuccess'));
      } else {
        await userApi.create(values);
        message.success(t('admin.users.createSuccess'));
      }
      router.push('/admin/users');
    } catch (error) {
      message.error(t('admin.users.saveError'));
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Card>
        <Title level={2}>{isEditing ? t('admin.users.editTitle') : t('admin.users.createTitle')}</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: 'customer', isActive: true }}
        >
          <Form.Item name="username" label={t('admin.users.form.username')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label={t('admin.users.form.email')} rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          {!isEditing && (
            <Form.Item name="password" label={t('admin.users.form.password')} rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item name="role" label={t('admin.users.form.role')} rules={[{ required: true }]}>
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isActive" label={t('admin.users.form.isActive')} valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              {isEditing ? t('admin.users.form.updateUser') : t('admin.users.form.createUser')}
            </Button>
            <Button onClick={() => router.push('/admin/users')}>
              {t('common.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
}

