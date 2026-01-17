'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Select,
  Input,
  message,
  Modal,
  Form,
  DatePicker,
  Typography,
  Card,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AdminLayout from '@/app/admin/layout';
import { ordersApi, Order } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await ordersApi.getAll(statusFilter, paymentStatusFilter);
      setOrders(fetchedOrders);
    } catch (error) {
      message.error('Failed to fetch orders');
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentStatusFilter]);

  const handleStatusUpdate = async (values: any) => {
    if (!selectedOrder) return;

    try {
      await ordersApi.updateStatus(selectedOrder._id, values.status, values.trackingInfo);
      message.success('Order status updated successfully');
      setUpdateModalVisible(false);
      setSelectedOrder(null);
      updateForm.resetFields();
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
      console.error('Failed to update order status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, paymentStatus: string) => {
    try {
      await ordersApi.updatePaymentStatus(orderId, paymentStatus);
      message.success('Payment status updated successfully');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update payment status');
      console.error('Failed to update payment status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order Number', 'Customer', 'Email', 'Total', 'Status', 'Payment Status', 'Date'];
    const rows = orders.map((order) => [
      order.orderNumber,
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      order.shippingAddress.email,
      `$${order.total.toFixed(2)}`,
      order.status,
      order.paymentStatus,
      order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    message.success('Orders exported to CSV');
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      sorter: (a: Order, b: Order) => a.orderNumber.localeCompare(b.orderNumber),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: any, record: Order) =>
        `${record.shippingAddress.firstName} ${record.shippingAddress.lastName}`,
    },
    {
      title: 'Email',
      key: 'email',
      render: (_: any, record: Order) => record.shippingAddress.email,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items.length,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
      sorter: (a: Order, b: Order) => a.total - b.total,
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
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value: any, record: Order) => record.status === value,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string, record: Order) => {
        const colorMap: Record<string, string> = {
          pending: 'orange',
          paid: 'green',
          failed: 'red',
          refunded: 'purple',
        };
        return (
          <Select
            value={status}
            style={{ width: 120 }}
            onChange={(value) => handlePaymentStatusUpdate(record._id, value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="paid">Paid</Option>
            <Option value="failed">Failed</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
      sorter: (a: Order, b: Order) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Link href={`/admin/orders/${record._id}`}>
            <Button icon={<EyeOutlined />} size="small">View</Button>
          </Link>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedOrder(record);
              updateForm.setFieldsValue({ status: record.status });
              setUpdateModalVisible(true);
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={2} style={{ margin: 0 }}>Orders Management</Title>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
                Refresh
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportToCSV}>
                Export CSV
              </Button>
            </Space>
          </div>

          <Space style={{ marginBottom: 16 }} wrap>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 150 }}
              onChange={setStatusFilter}
              value={statusFilter}
            >
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>

            <Select
              placeholder="Filter by Payment Status"
              allowClear
              style={{ width: 180 }}
              onChange={setPaymentStatusFilter}
              value={paymentStatusFilter}
            >
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          title="Update Order Status"
          open={updateModalVisible}
          onCancel={() => {
            setUpdateModalVisible(false);
            setSelectedOrder(null);
            updateForm.resetFields();
          }}
          onOk={() => updateForm.submit()}
        >
          <Form
            form={updateForm}
            layout="vertical"
            onFinish={handleStatusUpdate}
          >
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

            <Form.Item
              name={['trackingInfo', 'status']}
              label="Tracking Status"
            >
              <Input placeholder="e.g., In Transit" />
            </Form.Item>

            <Form.Item
              name={['trackingInfo', 'location']}
              label="Location"
            >
              <Input placeholder="e.g., Distribution Center" />
            </Form.Item>

            <Form.Item
              name={['trackingInfo', 'description']}
              label="Description"
            >
              <Input.TextArea rows={3} placeholder="Tracking description" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
