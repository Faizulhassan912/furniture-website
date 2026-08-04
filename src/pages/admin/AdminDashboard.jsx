import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import OverviewTab from '../../components/admin/tabs/OverviewTab';
import OrdersTab from '../../components/admin/tabs/OrdersTab';
import InquiriesTab from '../../components/admin/tabs/InquiriesTab';
import ProductsTab from '../../components/admin/tabs/ProductsTab';
import CategoriesTab from '../../components/admin/tabs/CategoriesTab';
import ReviewsTab from '../../components/admin/tabs/ReviewsTab';
import BannersTab from '../../components/admin/tabs/BannersTab';
import ContentEditorTab from '../../components/admin/tabs/ContentEditorTab';
import SettingsTab from '../../components/admin/tabs/SettingsTab';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'orders':
        return <OrdersTab />;
      case 'inquiries':
        return <InquiriesTab />;
      case 'products':
        return <ProductsTab />;
      case 'categories':
        return <CategoriesTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'banners':
        return <BannersTab />;
      case 'content':
        return <ContentEditorTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </AdminLayout>
  );
}

export default AdminDashboard;
