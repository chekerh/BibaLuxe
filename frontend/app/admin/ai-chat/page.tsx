'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';
import { aiChatApi, AiChatEntry, LocalizedString } from '@/lib/api';

const { Title } = Typography;

export default function AdminAiChatPage() {
  const [aiChatEntries, setAiChatEntries] = useState<AiChatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  const getLocalized = (obj: LocalizedString | string | undefined, defaultVal: string = '') => {
    if (typeof obj === 'string') return obj;
    if (!obj) return defaultVal;
    return obj[locale as keyof LocalizedString] || obj.en || defaultVal;
  };

  const fetchAiChatEntries = async () => {
    setLoading(true);
    try {
      const fetchedEntries = await aiChatApi.getAll(locale);
      setAiChatEntries(fetchedEntries);
    } catch (error) {
      message.error(t('admin.aiChat.fetchError') || 'Failed to fetch AI Chat entries');
      console.error('Failed to fetch AI Chat entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiChatEntries();
  }, [locale]);

  const handleDelete = async (id: string) => {
    try {
      await aiChatApi.delete(id);
      setAiChatEntries(aiChatEntries.filter(entry => entry._id !== id));
      message.success(t('admin.aiChat.deleteSuccess') || 'AI Chat entry deleted successfully');
    } catch (error) {
      message.error(t('admin.aiChat.deleteError') || 'Failed to delete AI Chat entry');
      console.error('Failed to delete AI Chat entry:', error);
    }
  };

  const columns = [
    {
      title: t('admin.aiChat.table.question'),
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: t('admin.aiChat.table.answer') || 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (answer: LocalizedString | string) => {
        const answerText = getLocalized(answer, '');
        return <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{answerText}</div>;
      },
    },
    {
      title: t('admin.aiChat.table.tags'),
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: t('admin.aiChat.table.categories'),
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <>
          {categories?.map((category) => (
            <Tag key={category} color="blue">{category}</Tag>
          ))}
        </>
      ),
    },
    {
      title: t('admin.aiChat.table.isActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.yes') : t('common.no')}
        </Tag>
      ),
    },
    {
      title: t('admin.aiChat.table.actions'),
      key: 'actions',
      render: (_: any, record: AiChatEntry) => (
        <Space size="middle">
          <Link href={`/admin/ai-chat/${record._id}`}>
            <Button icon={<EditOutlined />}>{t('admin.aiChat.table.edit') || 'Edit'}</Button>
          </Link>
          <Popconfirm
            title={t('admin.aiChat.table.deleteConfirmTitle') || 'Delete Entry'}
            description={t('admin.aiChat.table.deleteConfirmDescription') || 'Are you sure you want to delete this entry?'}
            onConfirm={() => handleDelete(record._id)}
            okText={t('common.yes') || 'Yes'}
            cancelText={t('common.no') || 'No'}
          >
            <Button danger icon={<DeleteOutlined />}>{t('admin.aiChat.table.delete') || 'Delete'}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>{t('admin.aiChat.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          <Link href="/admin/ai-chat/new">{t('admin.aiChat.addNew')}</Link>
        </Button>
        <Table columns={columns} dataSource={aiChatEntries} rowKey="_id" loading={loading} />
      </div>
    </AdminLayout>
  );
}

