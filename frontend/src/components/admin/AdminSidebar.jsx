import React from 'react';
import {
  Boxes,
  FolderOpen,
  Hash,
  Image as ImageIcon,
  ShoppingBag,
  FileText,
  Users,
  Building2,
  BookOpen
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="admin-sidebar">
      <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
        <Boxes style={{ width: '18px', height: '18px' }} />
        <span>Manage Products</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
        <FolderOpen style={{ width: '18px', height: '18px' }} />
        <span>Manage Categories</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'units' ? 'active' : ''}`} onClick={() => setActiveTab('units')}>
        <Hash style={{ width: '18px', height: '18px' }} />
        <span>Manage Units</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}>
        <ImageIcon style={{ width: '18px', height: '18px' }} />
        <span>Manage Banners</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
        <ShoppingBag style={{ width: '18px', height: '18px' }} />
        <span>Customer Orders</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
        <FileText style={{ width: '18px', height: '18px' }} />
        <span>Service Leads</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'designers' ? 'active' : ''}`} onClick={() => setActiveTab('designers')}>
        <Users style={{ width: '18px', height: '18px' }} />
        <span>Manage Designers</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'builders' ? 'active' : ''}`} onClick={() => setActiveTab('builders')}>
        <Building2 style={{ width: '18px', height: '18px' }} />
        <span>Manage Builders</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 'guides' ? 'active' : ''}`} onClick={() => setActiveTab('guides')}>
        <BookOpen style={{ width: '18px', height: '18px' }} />
        <span>Manage Guides</span>
      </button>
    </aside>
  );
}
