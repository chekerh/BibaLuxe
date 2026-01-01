'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Switch, Select, Space, Tabs } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
  getById: async (id: string, locale?: string): Promise<AiChatEntry> => {
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
        answer: { en: 'You can track your order using the link in your confirmation email.', ar: 'يمكنك تتبع طلبك باستخدام الرابط الموجود في رسالة تأكيد البريد الإلكتروني.', fr: 'Vous pouvez suivre votre commande via le link dans votre e-mail de confirmation.' },
        tags: ['order', 'tracking'],
        categories: ['shipping'],
        isActive: true,
      },
    ];
    const entry = data.find(item => item._id === id);
    if (!entry) throw new Error('AI Chat entry not found');
    return entry;
  },
  create: async (payload: any): Promise<AiChatEntry> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Simulating AI Chat entry creation:', payload);
    return { _id: String(Math.random()), ...payload, isActive: true };
  },
  update: async (id: string, payload: any): Promise<AiChatEntry> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Simulating update of AI Chat entry ${id}:`, payload);
    return { _id: id, ...payload };
  },
};

export default function AiChatFormPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useI18n();

  const getLocalizedValue = (obj: { en: string; ar?: string; fr?: string } | undefined, lang: string) => {
    if (!obj) return '';
    return (obj as any)[lang] || '';
  };

  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      const fetchAiChatEntry = async () => {
        setLoading(true);
        try {
          const entry = await aiChatApi.getById(id);
          const initialValues = {
            ...entry,
            answer_en: getLocalizedValue(entry.answer, 'en'),
            answer_ar: getLocalizedValue(entry.answer, 'ar'),
            answer_fr: getLocalizedValue(entry.answer, 'fr'),
          };
          form.setFieldsValue(initialValues);
        } catch (error) {
          message.error(t('admin.aiChat.fetchDetailsError'));
          console.error('Failed to fetch AI Chat entry details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAiChatEntry();
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const aiChatData = {
        ...values,
        answer: {
          en: values.answer_en,
          ar: values.answer_ar,
          fr: values.answer_fr,
        },
        tags: values.tags || [],
        categories: values.categories || [],
      };

      if (isEditing) {
        await aiChatApi.update(id, aiChatData);
        message.success(t('admin.aiChat.updateSuccess'));
      } else {
        await aiChatApi.create(aiChatData);
        message.success(t('admin.aiChat.createSuccess'));
      }
      router.push('/admin/ai-chat');
    } catch (error) {
      message.error(t('admin.aiChat.saveError'));
      console.error('Failed to save AI Chat entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLocalizedStringInput = (fieldName: string, label: string, isTextArea = false) => {
    const items = [
      { label: 'English', key: 'en', children: isTextArea ? <TextArea /> : <Input /> },
      { label: 'Arabic', key: 'ar', children: isTextArea ? <TextArea dir="rtl" /> : <Input dir="rtl" /> },
      { label: 'French', key: 'fr', children: isTextArea ? <TextArea /> : <Input /> },
    ];

    return (
      <Form.Item label={label} required>
        <Tabs defaultActiveKey="en" items={items.map(item => ({
          key: item.key,
          label: item.label,
          children: (
            <Form.Item name={`${fieldName}_${item.key}`} noStyle>
              {item.children}
            </Form.Item>
          ),
        }))} />
      </Form.Item>
    );
  };

  return (
    <AdminLayout>
      <Card>
        <Title level={2}>{isEditing ? t('admin.aiChat.editTitle') : t('admin.aiChat.createTitle')}</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true, tags: [], categories: [] }}
        >
          <Form.Item name="question" label={t('admin.aiChat.form.question')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {renderLocalizedStringInput('answer', t('admin.aiChat.form.answer'), true)}

          <Form.Item name="tags" label={t('admin.aiChat.form.tags')}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder={t('admin.aiChat.form.tagsPlaceholder')}
            >
              {/* Dynamically add options as user types */}
            </Select>
          </Form.Item>

          <Form.Item name="categories" label={t('admin.aiChat.form.categories')}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder={t('admin.aiChat.form.categoriesPlaceholder')}
            >
              {/* Dynamically add options as user types */}
            </Select>
          </Form.Item>

          <Form.Item name="isActive" label={t('admin.aiChat.form.isActive')} valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              {isEditing ? t('admin.aiChat.form.updateEntry') : t('admin.aiChat.form.createEntry')}
            </Button>
            <Button onClick={() => router.push('/admin/ai-chat')}>
              {t('common.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
}

