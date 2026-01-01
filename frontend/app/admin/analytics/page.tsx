'use client';

import React from 'react';
import { Card, Col, Row, Typography, Statistic, Space, Divider } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, MessageOutlined, FileTextOutlined } from '@ant-design/icons';
import AdminLayout from '@/app/admin/layout';
import { useI18n } from '@/contexts/I18nContext';

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

export default function AdminAnalyticsPage() {
  const { t } = useI18n();

  // Placeholder Data for Charts and Statistics
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: t('admin.analytics.salesChart.label'),
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const productCategoryData = {
    labels: [t('common.mattresses'), t('common.furniture'), t('admin.analytics.categoryChart.others')],
    datasets: [
      {
        label: t('admin.analytics.categoryChart.label'),
        data: [300, 50, 100],
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

  const weeklyTrafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: t('admin.analytics.trafficChart.label'),
        data: [120, 150, 180, 130, 200, 220, 190],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>{t('admin.analytics.dashboardTitle')}</Title>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.totalSales')}
                value={112893}
                precision={2}
                styles={{ content: { color: '#3f8600' } }}
                prefix={<DollarOutlined />}
                suffix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.newUsers')}
                value={1128}
                styles={{ content: { color: '#3f8600' } }}
                prefix={<UserOutlined />}
                suffix="↑12%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.totalOrders')}
                value={930}
                styles={{ content: { color: '#cf1322' } }}
                prefix={<ShoppingCartOutlined />}
                suffix="↓3%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('admin.analytics.aiChatInteractions')}
                value={567}
                styles={{ content: { color: '#08c' } }}
                prefix={<MessageOutlined />}
                suffix="↑25%"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title={t('admin.analytics.salesOverTime')}>
              <Line data={salesData} options={salesOptions} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={t('admin.analytics.productsByCategory')}>
              <Doughnut data={productCategoryData} options={categoryOptions} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title={t('admin.analytics.websiteTraffic')}>
              <Bar data={weeklyTrafficData} options={trafficOptions} />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}

