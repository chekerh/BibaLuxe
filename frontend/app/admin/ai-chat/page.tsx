'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';

const { Title } = Typography;

// Placeholder API for AI Chat - replace with actual backend integration
interface AiChatEntry {
  _id: string;
  question: string;
  answer: { en: string; ar?: string; fr?: string };
  tags?: string[];
  categories?: string[];
  isActive: boolean;
}

const aiChatApi = {
  getAll: async (locale?: string): Promise<AiChatEntry[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const data: AiChatEntry[] = [
      {
        _id: '1',
        question: 'What is your return policy?',
        answer: { en: 'Our return policy allows returns within 30 days.', ar: 'سياسة الإرجاع لدينا تسمح بالإرجاع خلال 30 يومًا.', fr: 'Notre politique de retour permet les retours dans les 30 jours.' },
        tags: ['returns', 'policy'],
        categories: ['customer service'],
        isActive: true,
      },
      {
        _id: '2',
        question: 'How do I track my order?',
        answer: { en: 'You can track your order using the link in your confirmation email.', ar: 'يمكنك تتبع طلبك باستخدام الرابط الموجود في رسالة تأكيد البريد الإلكتروني.', fr: 'Vous pouvez suivre votre commande via le lien dans votre e-mail de confirmation.' },
        tags: ['order', 'tracking'],
        categories: ['shipping'],
        isActive: true,
      },
    ];
    return data.map(entry => ({ ...entry, answer: entry.answer[locale as keyof typeof entry.answer] || entry.answer.en }));
  },
  remove: async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Simulating deletion of AI Chat entry with ID: ${id}`);
  },
};

export default function AdminAiChatPage() {
  const [aiChatEntries, setAiChatEntries] = useState<AiChatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  const getLocalized = (obj: { [key: string]: string } | string | undefined, defaultVal: string = '') => {
    if (typeof obj === 'string') return obj;
    return obj?.[locale] || defaultVal;
  };

  const fetchAiChatEntries = async () => {
    setLoading(true);
    try {
      const fetchedEntries = await aiChatApi.getAll(locale);
      setAiChatEntries(fetchedEntries);
    } catch (error) {
      message.error(t('admin.aiChat.fetchError'));
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
      await aiChatApi.remove(id);
      setAiChatEntries(aiChatEntries.filter(entry => entry._id !== id));
      message.success(t('admin.aiChat.deleteSuccess'));
    } catch (error) {
      message.error(t('admin.aiChat.deleteError'));
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
      title: t('admin.aiChat.table.answer'),
      dataIndex: 'answer',
      key: 'answer',
      render: (answer: { en: string; ar?: string; fr?: string } | string) => getLocalized(answer, answer.en),
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
          <Link href={`/admin/ai-chat/edit/${record._id}`}>
            <Button icon={<EditOutlined />}>{t('admin.aiChat.table.edit')}</Button>
          </Link>
          <Popconfirm
            title={t('admin.aiChat.table.deleteConfirmTitle')}
            description={t('admin.aiChat.table.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger icon={<DeleteOutlined />}>{t('admin.aiChat.table.delete')}</Button>
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

