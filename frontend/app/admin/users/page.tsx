'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';

const { Title } = Typography;

// Placeholder API for User Management - replace with actual backend integration
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  isActive: boolean;
}

const userApi = {
  getAll: async (): Promise<User[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { _id: 'u1', username: 'admin', email: 'admin@example.com', role: 'admin', isActive: true },
      { _id: 'u2', username: 'john.doe', email: 'john.doe@example.com', role: 'customer', isActive: true },
      { _id: 'u3', username: 'jane.smith', email: 'jane.smith@example.com', role: 'customer', isActive: false },
    ];
  },
  remove: async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Simulating deletion of user with ID: ${id}`);
  },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await userApi.getAll();
      setUsers(fetchedUsers);
    } catch (error) {
      message.error(t('admin.users.fetchError'));
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await userApi.remove(id);
      setUsers(users.filter(user => user._id !== id));
      message.success(t('admin.users.deleteSuccess'));
    } catch (error) {
      message.error(t('admin.users.deleteError'));
      console.error('Failed to delete user:', error);
    }
  };

  const columns = [
    {
      title: t('admin.users.table.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('admin.users.table.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('admin.users.table.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color={role === 'admin' ? 'purple' : 'green'}>{role}</Tag>,
    },
    {
      title: t('admin.users.table.isActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.yes') : t('common.no')}
        </Tag>
      ),
    },
    {
      title: t('admin.users.table.actions'),
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Link href={`/admin/users/edit/${record._id}`}>
            <Button icon={<EditOutlined />}>{t('admin.users.table.edit')}</Button>
          </Link>
          <Popconfirm
            title={t('admin.users.table.deleteConfirmTitle')}
            description={t('admin.users.table.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger icon={<DeleteOutlined />}>{t('admin.users.table.delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>{t('admin.users.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          <Link href="/admin/users/new">{t('admin.users.addNew')}</Link>
        </Button>
        <Table columns={columns} dataSource={users} rowKey="_id" loading={loading} />
      </div>
    </AdminLayout>
  );
}

