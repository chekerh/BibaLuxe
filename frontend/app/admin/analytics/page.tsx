'use client';

import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Statistic, Space, Select, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, MessageOutlined } from '@ant-design/icons';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';
import { statsApi, productsApi } from '@/lib/api';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;
const { Option } = Select;

export default function AdminAnalyticsPage() {
  const { t } = useI18n();
  const [salesData, setSalesData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stats, sales, allProducts] = await Promise.all([
          statsApi.getDashboardStats(),
          statsApi.getSalesData(days),
          productsApi.getAll(),
        ]);
        setDashboardStats(stats);
        setSalesData(sales);
        setProducts(allProducts);
      } catch (error) {
        message.error('Failed to load analytics data');
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  // Process sales data for chart
  const salesChartData = salesData
    ? {
        labels: salesData.map((d: any) => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: t('admin.analytics.salesChart.label') || 'Revenue',
            data: salesData.map((d: any) => d.revenue),
            fill: true,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
          {
            label: 'Orders',
            data: salesData.map((d: any) => d.orders),
            fill: true,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            tension: 0.1,
          },
        ],
      }
    : null;

  // Process product category data
  const productCategoryData = {
    labels: ['Mattresses', 'Furniture', 'Others'],
    datasets: [
      {
        label: t('admin.analytics.categoryChart.label') || 'Products by Category',
        data: [
          products.filter((p) => p.category === 'mattress').length,
          products.filter((p) => p.category === 'furniture').length,
          products.filter((p) => !['mattress', 'furniture'].includes(p.category)).length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: t('admin.analytics.salesChart.title'),
      },
    },
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: {
        display: true,
        text: t('admin.analytics.categoryChart.title'),
      },
    },
  };

  const trafficOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: t('admin.analytics.trafficChart.title'),
      },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>
            {t('admin.analytics.dashboardTitle') || 'Analytics Dashboard'}
          </Title>
          <Select value={days} onChange={setDays} style={{ width: 150 }}>
            <Option value={7}>Last 7 days</Option>
            <Option value={30}>Last 30 days</Option>
            <Option value={90}>Last 90 days</Option>
            <Option value={365}>Last year</Option>
          </Select>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.totalSales') || 'Total Revenue'}
                value={dashboardStats?.totalRevenue || 0}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.newUsers') || 'Total Users'}
                value={dashboardStats?.totalUsers || 0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.totalOrders') || 'Total Orders'}
                value={dashboardStats?.totalOrders || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.totalProducts') || 'Total Products'}
                value={dashboardStats?.totalProducts || 0}
                valueStyle={{ color: '#08c' }}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title={t('admin.analytics.salesOverTime') || 'Sales Over Time'}>
              {salesChartData ? (
                <Line data={salesChartData} options={salesOptions} />
              ) : (
                <div>No sales data available</div>
              )}
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={t('admin.analytics.productsByCategory') || 'Products by Category'}>
              <Doughnut data={productCategoryData} options={categoryOptions} />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}

