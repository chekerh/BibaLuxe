'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Image, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Product, productsApi, LocalizedString } from '@/lib/api';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';

const { Title } = Typography;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  const getLocalized = (obj: LocalizedString | string | undefined, defaultVal: string = '') => {
    if (typeof obj === 'string') return obj;
    return obj?.[locale as keyof LocalizedString] || defaultVal;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await productsApi.getAll(undefined, locale);
      setProducts(fetchedProducts);
    } catch (error) {
      message.error(t('admin.products.fetchError'));
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [locale]);

  const handleDelete = async (id: string) => {
    try {
      await productsApi.delete(id);
      setProducts(products.filter(product => product._id !== id));
      message.success(t('admin.products.deleteSuccess'));
    } catch (error) {
      message.error(t('admin.products.deleteError'));
      console.error('Failed to delete product:', error);
    }
  };

  const columns = [
    {
      title: t('admin.products.table.image'),
      dataIndex: 'image',
      key: 'image',
      render: (text: string) => <Image src={text} alt="Product Image" width={60} height={60} style={{ objectFit: 'cover', borderRadius: '4px' }} />,
    },
    {
      title: t('admin.products.table.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: LocalizedString) => getLocalized(name, name.en),
    },
    {
      title: t('admin.products.table.category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: t('admin.products.table.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: t('admin.products.table.inStock'),
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock: boolean) => (
        <Tag color={inStock ? 'green' : 'red'}>
          {inStock ? t('admin.products.table.inStockTrue') : t('admin.products.table.inStockFalse')}
        </Tag>
      ),
    },
    {
      title: t('admin.products.table.actions'),
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Link href={`/admin/products/${record._id}`}>
            <Button icon={<EditOutlined />}>{t('admin.products.table.edit')}</Button>
          </Link>
          <Popconfirm
            title={t('admin.products.table.deleteConfirmTitle')}
            description={t('admin.products.table.deleteConfirmDescription')}
            onConfirm={() => handleDelete(record._id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger icon={<DeleteOutlined />}>{t('admin.products.table.delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>{t('admin.products.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          <Link href="/admin/products/new">{t('admin.products.addNew')}</Link>
        </Button>
        <Button style={{ marginBottom: 16, marginLeft: 8 }} onClick={fetchProducts}>
          Refresh
        </Button>
        <Table columns={columns} dataSource={products} rowKey="_id" loading={loading} />
      </div>
    </AdminLayout>
  );
}

