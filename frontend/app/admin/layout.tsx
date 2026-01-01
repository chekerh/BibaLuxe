'use client';

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { AdminAuthWrapper, useAdminAuth } from '@/contexts/AdminAuthContext';

const { Header, Content, Footer, Sider } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user } = useAdminAuth(); // Only use user data if needed for display
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: <Link href="/admin">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <ShoppingOutlined />,
              label: <Link href="/admin/products">Products</Link>,
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: <Link href="/admin/users">Users</Link>,
            },
            {
              key: '4',
              icon: <MessageOutlined />,
              label: <Link href="/admin/ai-chat">AI Chat</Link>,
            },
            {
              key: '5',
              icon: <BarChartOutlined />,
              label: <Link href="/admin/analytics">Analytics</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          E-commerce Admin Dashboard ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
}

export default function AdminLayout(props: AdminLayoutProps) {
  return (
    <AntdRegistry>
      <AdminAuthWrapper>
        <AdminLayoutContent {...props} />
      </AdminAuthWrapper>
    </AntdRegistry>
  );
}
