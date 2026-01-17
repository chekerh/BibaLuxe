'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';
import { usersApi, User } from '@/lib/api';

const { Title } = Typography;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await usersApi.getAll();
      setUsers(fetchedUsers);
    } catch (error) {
      message.error(t('admin.users.fetchError') || 'Failed to fetch users');
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
      await usersApi.delete(id);
      setUsers(users.filter(user => user._id !== id));
      message.success(t('admin.users.deleteSuccess') || 'User deleted successfully');
    } catch (error) {
      message.error(t('admin.users.deleteError') || 'Failed to delete user');
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
          <Link href={`/admin/users/${record._id}`}>
            <Button icon={<EyeOutlined />}>View</Button>
          </Link>
          <Link href={`/admin/users/${record._id}`}>
            <Button icon={<EditOutlined />}>{t('admin.users.table.edit') || 'Edit'}</Button>
          </Link>
          <Popconfirm
            title={t('admin.users.table.deleteConfirmTitle') || 'Delete User'}
            description={t('admin.users.table.deleteConfirmDescription') || 'Are you sure you want to delete this user?'}
            onConfirm={() => handleDelete(record._id)}
            okText={t('common.yes') || 'Yes'}
            cancelText={t('common.no') || 'No'}
          >
            <Button danger icon={<DeleteOutlined />}>{t('admin.users.table.delete') || 'Delete'}</Button>
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

