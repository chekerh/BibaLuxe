'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Select,
  Input,
  Typography,
  Divider,
  Timeline,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/app/admin/layout';
import { ordersApi, Order, TrackingInfo } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await ordersApi.getById(id);
        setOrder(fetchedOrder);
      } catch (error) {
        message.error('Failed to fetch order details');
        console.error('Failed to fetch order:', error);
        router.push('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, router]);

  const handleStatusUpdate = async (values: any) => {
    if (!order) return;

    try {
      const updatedOrder = await ordersApi.updateStatus(
        order._id,
        values.status,
        values.trackingInfo
      );
      setOrder(updatedOrder);
      message.success('Order status updated successfully');
      setUpdateModalVisible(false);
      updateForm.resetFields();
    } catch (error) {
      message.error('Failed to update order status');
      console.error('Failed to update order status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (paymentStatus: string) => {
    if (!order) return;

    try {
      const updatedOrder = await ordersApi.updatePaymentStatus(order._id, paymentStatus);
      setOrder(updatedOrder);
      message.success('Payment status updated successfully');
    } catch (error) {
      message.error('Failed to update payment status');
      console.error('Failed to update payment status:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div>Order not found</div>
      </AdminLayout>
    );
  }

  const statusColorMap: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    shipped: 'cyan',
    delivered: 'green',
    cancelled: 'red',
  };

  const paymentStatusColorMap: Record<string, string> = {
    pending: 'orange',
    paid: 'green',
    failed: 'red',
    refunded: 'purple',
  };

  const itemsColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.productName}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>ID: {record.productId}</div>
        </div>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) =>
        image ? (
          <img src={image} alt="Product" style={{ width: 60, height: 60, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 60, height: 60, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No Image
          </div>
        ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_: any, record: any) => `$${(record.quantity * record.price).toFixed(2)}`,
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/admin/orders')}>
            Back to Orders
          </Button>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => {
              updateForm.setFieldsValue({
                status: order.status,
              });
              setUpdateModalVisible(true);
            }}
          >
            Update Status
          </Button>
        </Space>

        <Title level={2}>Order Details - {order.orderNumber}</Title>

        <Card style={{ marginBottom: 16 }}>
          <Descriptions title="Order Information" bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Order Number">{order.orderNumber}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColorMap[order.status] || 'default'}>
                {order.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Select
                value={order.paymentStatus}
                style={{ width: 120 }}
                onChange={handlePaymentStatusUpdate}
              >
                <Option value="pending">Pending</Option>
                <Option value="paid">Paid</Option>
                <Option value="failed">Failed</Option>
                <Option value="refunded">Refunded</Option>
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {order.paymentMethod || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Title level={4}>Shipping Address</Title>
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Name">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{order.shippingAddress.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{order.shippingAddress.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Title level={4}>Order Items</Title>
          <Table
            columns={itemsColumns}
            dataSource={order.items}
            rowKey="productId"
            pagination={false}
          />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Title level={4}>Order Summary</Title>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Subtotal">
              ${order.subtotal.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Shipping">
              ${order.shipping.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Tax">
              ${order.tax.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total">
              <strong>${order.total.toFixed(2)}</strong>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card>
          <Title level={4}>Tracking History</Title>
          <Timeline
            items={order.trackingHistory.map((tracking: TrackingInfo, index: number) => ({
              key: index,
              color: index === 0 ? 'green' : 'blue',
              children: (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{tracking.status}</div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    {tracking.date} - {tracking.location}
                  </div>
                  <div style={{ marginTop: 4 }}>{tracking.description}</div>
                </div>
              ),
            }))}
          />
        </Card>

        <Modal
          title="Update Order Status"
          open={updateModalVisible}
          onCancel={() => {
            setUpdateModalVisible(false);
            updateForm.resetFields();
          }}
          onOk={() => updateForm.submit()}
        >
          <Form form={updateForm} layout="vertical" onFinish={handleStatusUpdate}>
            <Form.Item
              name="status"
              label="Order Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select>
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Form.Item>

            <Form.Item name={['trackingInfo', 'status']} label="Tracking Status">
              <Input placeholder="e.g., In Transit" />
            </Form.Item>

            <Form.Item name={['trackingInfo', 'location']} label="Location">
              <Input placeholder="e.g., Distribution Center" />
            </Form.Item>

            <Form.Item name={['trackingInfo', 'description']} label="Description">
              <TextArea rows={3} placeholder="Tracking description" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
