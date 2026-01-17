'use client';

import React, { useState, useEffect } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Menu, theme, Avatar, Dropdown, Button, Input, Breadcrumb, Typography, Space } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { AdminAuthWrapper, useAdminAuth } from '@/contexts/AdminAuthContext';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get breadcrumb items from pathname
  const getBreadcrumbItems = (): Array<{ title: React.ReactNode }> => {
    const paths = pathname.split('/').filter(Boolean);
    const items: Array<{ title: React.ReactNode }> = [{ title: <Link href="/admin">Dashboard</Link> }];
    
    if (paths.length > 1) {
      const section = paths[1];
      const sectionNames: Record<string, string> = {
        products: 'Products',
        orders: 'Orders',
        users: 'Users',
        'ai-chat': 'AI Chat',
        analytics: 'Analytics',
      };
      
      if (sectionNames[section]) {
        items.push({
          title: <Link href={`/admin/${section}`}>{sectionNames[section]}</Link>,
        });
        
        if (paths.length > 2 && paths[2] !== 'new') {
          items.push({ title: paths[2] === 'edit' ? 'Edit' : 'Details' });
        } else if (paths[2] === 'new') {
          items.push({ title: 'New' });
        }
      }
    }
    
    return items;
  };

  const menuItems = [
            {
      key: '/admin',
              icon: <DashboardOutlined />,
              label: <Link href="/admin">Dashboard</Link>,
            },
            {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
    },
    {
      key: '/admin/products',
              icon: <ShoppingOutlined />,
              label: <Link href="/admin/products">Products</Link>,
            },
            {
      key: '/admin/users',
              icon: <UserOutlined />,
              label: <Link href="/admin/users">Users</Link>,
            },
            {
      key: '/admin/ai-chat',
              icon: <MessageOutlined />,
              label: <Link href="/admin/ai-chat">AI Chat</Link>,
            },
            {
      key: '/admin/analytics',
              icon: <BarChartOutlined />,
              label: <Link href="/admin/analytics">Analytics</Link>,
            },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={collapsed ? 0 : 80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: collapsed ? 14 : 18,
          }}
        >
          {collapsed ? 'AD' : 'ADMIN'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 64, height: 64 }}
            />
            <Breadcrumb items={getBreadcrumbItems()} />
          </Space>
          <Space>
            <Search
              placeholder="Search..."
              allowClear
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer', padding: '0 12px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </Avatar>
                <Text strong>{user?.username || 'Admin'}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px 0', minHeight: 'calc(100vh - 112px)' }}>
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
        <Footer style={{ textAlign: 'center', marginLeft: collapsed ? 0 : 200 }}>
          E-commerce Admin Dashboard ©{new Date().getFullYear()}
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
