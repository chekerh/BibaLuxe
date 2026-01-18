'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, InputNumber, Switch, Upload, Space, Tabs } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/app/admin/layout';
import { productsApi, Product, LocalizedString, uploadApi } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import Image from 'next/image';

const { Title } = Typography;
const { TextArea } = Input;

export default function ProductFormPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t, locale } = useI18n();

  const getLocalizedValue = (obj: LocalizedString | undefined, lang: string) => {
    if (!obj) return '';
    return (obj as any)[lang] || '';
  };

  const setLocalizedValue = (obj: LocalizedString, lang: string, value: string) => {
    (obj as any)[lang] = value;
  };

  useEffect(() => {
    if (id && id !== 'new' && id !== 'edit') {
      setIsEditing(true);
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const product = await productsApi.getById(id, locale);
          // Prepare data for form, especially for localized fields
          const initialValues = {
            ...product,
            name_en: getLocalizedValue(product.name, 'en'),
            name_ar: getLocalizedValue(product.name, 'ar'),
            name_fr: getLocalizedValue(product.name, 'fr'),
            tagline_en: getLocalizedValue(product.tagline, 'en'),
            tagline_ar: getLocalizedValue(product.tagline, 'ar'),
            tagline_fr: getLocalizedValue(product.tagline, 'fr'),
            description_en: getLocalizedValue(product.description, 'en'),
            description_ar: getLocalizedValue(product.description, 'ar'),
            description_fr: getLocalizedValue(product.description, 'fr'),
            shippingInfo_en: getLocalizedValue(product.shippingInfo, 'en'),
            shippingInfo_ar: getLocalizedValue(product.shippingInfo, 'ar'),
            shippingInfo_fr: getLocalizedValue(product.shippingInfo, 'fr'),
            // Highlights are an array of LocalizedStrings
            highlights: product.highlights?.map(h => ({ en: h.en, ar: h.ar, fr: h.fr })) || [],
            // Specifications are a record of LocalizedStrings
            specifications: Object.entries(product.specifications || {}).map(([key, value]) => ({
              key,
              value_en: getLocalizedValue(value, 'en'),
              value_ar: getLocalizedValue(value, 'ar'),
              value_fr: getLocalizedValue(value, 'fr'),
            })),
          };
          form.setFieldsValue(initialValues);
          // Set image preview if product has an image
          if (product.image) {
            setImagePreview(product.image);
          }
        } catch (error) {
          message.error(t('admin.products.fetchDetailsError'));
          console.error('Failed to fetch product details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, locale]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const productData: Partial<Product> = {
        ...values,
        name: {
          en: values.name_en,
          ar: values.name_ar,
          fr: values.name_fr,
        },
        tagline: {
          en: values.tagline_en,
          ar: values.tagline_ar,
          fr: values.tagline_fr,
        },
        description: {
          en: values.description_en,
          ar: values.description_ar,
          fr: values.description_fr,
        },
        shippingInfo: {
          en: values.shippingInfo_en,
          ar: values.shippingInfo_ar,
          fr: values.shippingInfo_fr,
        },
        highlights: values.highlights?.map((h: any) => ({
          en: h.en, ar: h.ar, fr: h.fr
        })) || [],
        specifications: values.specifications?.reduce((acc: Record<string, LocalizedString>, spec: any) => {
          if (spec.key) {
            acc[spec.key] = {
              en: spec.value_en, ar: spec.value_ar, fr: spec.value_fr
            };
          }
          return acc;
        }, {}) || {},
      };

      if (isEditing) {
        await productsApi.update(id, productData);
        message.success(t('admin.products.updateSuccess'));
      } else {
        await productsApi.create(productData);
        message.success(t('admin.products.createSuccess'));
      }
      router.push('/admin/products');
    } catch (error) {
      message.error(t('admin.products.saveError'));
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Custom upload handler for Cloudinary
  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    setUploading(true);
    try {
      const result = await uploadApi.uploadImage(file);
      form.setFieldsValue({ image: result.url });
      setImagePreview(result.url);
      message.success(`${file.name} uploaded successfully`);
      onSuccess(result, file);
    } catch (error: any) {
      console.error('Upload failed:', error);
      message.error(error.response?.data?.message || 'Image upload failed. Please try again.');
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    customRequest: handleImageUpload,
    accept: 'image/jpeg,image/png,image/gif,image/webp',
    showUploadList: false,
    beforeUpload: (file: File) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      if (!isValidType) {
        message.error('You can only upload JPG, PNG, GIF, or WebP files!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Image must be smaller than 10MB!');
        return false;
      }
      return true;
    },
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

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic Information',
      children: (
        <div className="space-y-6">
          {renderLocalizedStringInput('name', t('admin.products.form.name'))}
          {renderLocalizedStringInput('tagline', t('admin.products.form.tagline'))}
          {renderLocalizedStringInput('description', t('admin.products.form.description'), true)}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="category" label={t('admin.products.form.category')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="price" label={t('admin.products.form.price')} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: 'media',
      label: 'Media',
      children: (
        <div className="space-y-6">
          <Form.Item label={t('admin.products.form.image')} required>
            <div className="flex flex-col gap-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      form.setFieldsValue({ image: '' });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* Upload Button */}
              <Upload {...uploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : (imagePreview ? 'Change Image' : t('admin.products.form.clickToUpload'))}
                </Button>
              </Upload>
              
              {/* Hidden field to store the image URL */}
              <Form.Item name="image" noStyle>
                <Input type="hidden" />
              </Form.Item>
              
              <p className="text-gray-500 text-sm">
                Supported formats: JPG, PNG, GIF, WebP. Max size: 10MB.
              </p>
            </div>
          </Form.Item>

          <Form.Item name="model3d" label={t('admin.products.form.model3d')}>
            <Input placeholder={t('admin.products.form.model3dPlaceholder')} />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'ratings',
      label: 'Ratings & Reviews',
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="rating" label={t('admin.products.form.rating')}>
            <InputNumber min={0} max={5} step={0.1} />
          </Form.Item>

          <Form.Item name="reviewsCount" label={t('admin.products.form.reviewsCount')}>
            <InputNumber min={0} />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'highlights',
      label: 'Highlights',
      children: (
        <Form.List name="highlights">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'en']}
                    rules={[{ required: true, message: t('admin.products.form.highlightEnRequired') }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={t('admin.products.form.highlightEnPlaceholder')} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'ar']}
                    rules={[{ required: true, message: t('admin.products.form.highlightArRequired') }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={t('admin.products.form.highlightArPlaceholder')} dir="rtl" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'fr']}
                    rules={[{ required: true, message: t('admin.products.form.highlightFrRequired') }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={t('admin.products.form.highlightFrPlaceholder')} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  {t('admin.products.form.addHighlight')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ),
    },
    {
      key: 'specifications',
      label: 'Specifications',
      children: (
        <Form.List name="specifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                    rules={[{ required: true, message: t('admin.products.form.specKeyRequired') }]}
                    style={{ width: 120 }}
                  >
                    <Input placeholder={t('admin.products.form.specKeyPlaceholder')} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value_en']}
                    rules={[{ required: true, message: t('admin.products.form.specValueEnRequired') }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={t('admin.products.form.specValueEnPlaceholder')} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value_ar']}
                    rules={[{ required: true, message: t('admin.products.form.specValueArRequired') }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={t('admin.products.form.specValueArPlaceholder')} dir="rtl" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value_fr']}
                    rules={[{ required: true, message: t('admin.products.form.specValueFrRequired') }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={t('admin.products.form.specValueFrPlaceholder')} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  {t('admin.products.form.addSpecification')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ),
    },
    {
      key: 'additional',
      label: 'Additional Information',
      children: (
        <div className="space-y-6">
          {renderLocalizedStringInput('shippingInfo', t('admin.products.form.shippingInfo'))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="warrantyYears" label={t('admin.products.form.warrantyYears')}>
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item name="inStock" label={t('admin.products.form.inStock')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Card>
        <Title level={2}>{isEditing ? t('admin.products.editTitle') : t('admin.products.createTitle')}</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ inStock: true, rating: 0, reviewsCount: 0, price: 0, warrantyYears: 0 }}
        >
          <Tabs defaultActiveKey="basic" items={tabItems} />

          <Form.Item className="mt-8">
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              {isEditing ? t('admin.products.form.updateProduct') : t('admin.products.form.createProduct')}
            </Button>
            <Button onClick={() => router.push('/admin/products')}>
              {t('common.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
}

