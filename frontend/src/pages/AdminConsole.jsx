import React, { useContext, useState } from 'react';
import { AppContext } from '../App.jsx';
import axios from 'axios';

// Import subcomponents
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminProductPane from '../components/admin/AdminProductPane.jsx';
import AdminCategoryPane from '../components/admin/AdminCategoryPane.jsx';
import AdminUnitPane from '../components/admin/AdminUnitPane.jsx';
import AdminBannerPane from '../components/admin/AdminBannerPane.jsx';
import AdminOrderPane from '../components/admin/AdminOrderPane.jsx';
import AdminLeadPane from '../components/admin/AdminLeadPane.jsx';
import AdminDesignerPane from '../components/admin/AdminDesignerPane.jsx';
import AdminBuilderPane from '../components/admin/AdminBuilderPane.jsx';
import AdminGuidePane from '../components/admin/AdminGuidePane.jsx';

// Import modals
import ProductModal from '../components/admin/modals/ProductModal.jsx';
import BannerModal from '../components/admin/modals/BannerModal.jsx';
import DesignerModal from '../components/admin/modals/DesignerModal.jsx';
import BuilderModal from '../components/admin/modals/BuilderModal.jsx';
import GuideModal from '../components/admin/modals/GuideModal.jsx';
import CategoryModal from '../components/admin/modals/CategoryModal.jsx';

// Import upload helper
import { compressAndUpload } from '../utils/upload.js';

export default function AdminConsole() {
  const {
    products,
    categories,
    units,
    banners,
    designers,
    builders,
    guides,
    orders,
    leads,
    fetchData
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('products');

  // Modal forms state
  const [productModal, setProductModal] = useState({ open: false, editId: null, data: { name: '', brand: '', category: '', price: '', unit: '', description: '', imageSrc: '', specGrade: 'Grade A', specSize: 'IS Certified' } });
  const [bannerModal, setBannerModal] = useState({ open: false, editId: null, data: { imageSrc: '', link: '#/products', styleType: 'cover', position: 'center', bgColor: '#ffffff' } });
  const [designerModal, setDesignerModal] = useState({ open: false, editId: null, data: { name: '', firm: '', experience: '', rating: '5.0', reviewsCount: 0, completedProjects: 0, specialties: '', bio: '', fullBio: '', avatarImg: '', avatarText: '', avatarBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)', projects: [] } });
  const [builderModal, setBuilderModal] = useState({ open: false, editId: null, data: { name: '', firm: '', experience: '', rating: '5.0', reviewsCount: 0, completedProjects: 0, specialties: '', bio: '', fullBio: '', avatarImg: '', avatarText: '', avatarBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)', projects: [] } });
  const [guideModal, setGuideModal] = useState({ open: false, editId: null, data: { title: '', date: '', imageSrc: '', content: '' } });
  const [categoryModal, setCategoryModal] = useState({ open: false, editId: null, data: { name: '', desc: '', icon: 'boxes' } });

  // Delete handlers
  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product listing?')) {
      await axios.delete(`/api/products/${id}`);
      await fetchData();
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm(`Are you sure you want to delete category "${id}"?`)) {
      await axios.delete(`/api/categories/${id}`);
      await fetchData();
    }
  };

  const handleDeleteUnit = async (id) => {
    if (confirm(`Are you sure you want to delete unit "${id}"?`)) {
      await axios.delete(`/api/units/${id}`);
      await fetchData();
    }
  };

  const handleDeleteBanner = async (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await axios.delete(`/api/banners/${id}`);
      await fetchData();
    }
  };

  const handleDeleteDesigner = async (id) => {
    if (confirm('Are you sure you want to delete this designer profile?')) {
      await axios.delete(`/api/designers/${id}`);
      await fetchData();
    }
  };

  const handleDeleteBuilder = async (id) => {
    if (confirm('Are you sure you want to delete this builder profile?')) {
      await axios.delete(`/api/builders/${id}`);
      await fetchData();
    }
  };

  const handleDeleteGuide = async (id) => {
    if (confirm('Are you sure you want to delete this guide post?')) {
      await axios.delete(`/api/guides/${id}`);
      await fetchData();
    }
  };

  // Add Category Handler
  const handleAddCategory = () => {
    setCategoryModal({
      open: true,
      editId: null,
      data: { name: '', desc: '', icon: 'boxes' }
    });
  };

  // Edit Category Handler
  const handleEditCategory = (c) => {
    setCategoryModal({
      open: true,
      editId: c.id,
      data: { name: c.name, desc: c.desc || '', icon: c.icon || 'boxes' }
    });
  };

  // Category Submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: categoryModal.data.name.trim(),
      desc: (categoryModal.data.desc || '').trim(),
      icon: (categoryModal.data.icon || 'boxes').trim()
    };
    try {
      if (categoryModal.editId) {
        await axios.put(`/api/categories/${categoryModal.editId}`, payload);
      } else {
        await axios.post('/api/categories', payload);
      }
      setCategoryModal({ open: false, editId: null, data: {} });
      await fetchData();
    } catch (err) {
      alert('Error saving category');
    }
  };

  // Add Unit Handler
  const handleAddUnit = async () => {
    const name = prompt('Enter Unit Name (e.g. Litre (Liquids) or Kg (Hardware)):');
    if (name && name.trim()) {
      try {
        await axios.post('/api/units', { name: name.trim() });
        await fetchData();
      } catch (err) {
        alert('Failed to save unit.');
      }
    }
  };

  // Product Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: productModal.data.name,
      brand: productModal.data.brand,
      category: productModal.data.category || (categories[0]?.id || ''),
      price: parseFloat(productModal.data.price),
      unit: productModal.data.unit || (units[0]?.id || ''),
      description: productModal.data.description,
      imageSrc: productModal.data.imageSrc,
      specs: {
        'Grade/Class': productModal.data.specGrade,
        'Specification': productModal.data.specSize
      }
    };

    try {
      if (productModal.editId) {
        await axios.put(`/api/products/${productModal.editId}`, payload);
      } else {
        await axios.post('/api/products', payload);
      }
      setProductModal({ open: false, editId: null, data: {} });
      await fetchData();
    } catch (err) {
      alert('Error saving product');
    }
  };

  // Banner Submit
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const payload = bannerModal.data;
    try {
      if (bannerModal.editId) {
        await axios.put(`/api/banners/${bannerModal.editId}`, payload);
      } else {
        await axios.post('/api/banners', payload);
      }
      setBannerModal({ open: false, editId: null, data: {} });
      await fetchData();
    } catch (err) {
      alert('Error saving banner');
    }
  };

  // Designer Submit
  const handleDesignerSubmit = async (e) => {
    e.preventDefault();
    const nameVal = designerModal.data.name;
    let avatarTextVal = designerModal.data.avatarText.trim();
    if (!avatarTextVal) {
      avatarTextVal = nameVal.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    const payload = {
      ...designerModal.data,
      rating: parseFloat(designerModal.data.rating || '5.0'),
      reviewsCount: parseInt(designerModal.data.reviewsCount || 0),
      completedProjects: parseInt(designerModal.data.completedProjects || 0),
      specialties: typeof designerModal.data.specialties === 'string' 
        ? designerModal.data.specialties.split(',').map(s => s.trim()).filter(s => s !== '')
        : designerModal.data.specialties,
      avatarText: avatarTextVal
    };

    if (!designerModal.editId) {
      payload.id = nameVal.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      if (designerModal.editId) {
        await axios.put(`/api/designers/${designerModal.editId}`, payload);
      } else {
        await axios.post('/api/designers', payload);
      }
      setDesignerModal({ open: false, editId: null, data: {} });
      await fetchData();
    } catch (err) {
      alert('Error saving designer profile');
    }
  };

  // Builder Submit
  const handleBuilderSubmit = async (e) => {
    e.preventDefault();
    const nameVal = builderModal.data.name;
    let avatarTextVal = builderModal.data.avatarText.trim();
    if (!avatarTextVal) {
      avatarTextVal = nameVal.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    const payload = {
      ...builderModal.data,
      rating: parseFloat(builderModal.data.rating || '5.0'),
      reviewsCount: parseInt(builderModal.data.reviewsCount || 0),
      completedProjects: parseInt(builderModal.data.completedProjects || 0),
      specialties: typeof builderModal.data.specialties === 'string'
        ? builderModal.data.specialties.split(',').map(s => s.trim()).filter(s => s !== '')
        : builderModal.data.specialties,
      avatarText: avatarTextVal
    };

    if (!builderModal.editId) {
      payload.id = nameVal.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      if (builderModal.editId) {
        await axios.put(`/api/builders/${builderModal.editId}`, payload);
      } else {
        await axios.post('/api/builders', payload);
      }
      setBuilderModal({ open: false, editId: null, data: {} });
      await fetchData();
    } catch (err) {
      alert('Error saving builder profile');
    }
  };

  // Guide Submit
  const handleGuideSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: guideModal.data.title,
      date: guideModal.data.date || new Date().toISOString().slice(0, 19).replace('T', ' '),
      imageSrc: guideModal.data.imageSrc,
      content: guideModal.data.content
    };

    if (!guideModal.editId) {
      payload.id = guideModal.data.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      if (guideModal.editId) {
        await axios.put(`/api/guides/${guideModal.editId}`, payload);
      } else {
        await axios.post('/api/guides', payload);
      }
      setGuideModal({ open: false, editId: null, data: {} });
      await fetchData();
    } catch (err) {
      alert('Error saving guide post');
    }
  };

  // Designers Projects Nested Array Handlers
  const addDesignerProject = () => {
    const projList = [...(designerModal.data.projects || [])];
    projList.push({ title: '', location: '', year: '', desc: '', images: [] });
    setDesignerModal({ ...designerModal, data: { ...designerModal.data, projects: projList } });
  };

  const removeDesignerProject = (idx) => {
    const projList = designerModal.data.projects.filter((_, i) => i !== idx);
    setDesignerModal({ ...designerModal, data: { ...designerModal.data, projects: projList } });
  };

  const updateDesignerProjectField = (idx, field, val) => {
    const projList = designerModal.data.projects.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    setDesignerModal({ ...designerModal, data: { ...designerModal.data, projects: projList } });
  };

  const handleDesignerProjectPhotoUpload = async (idx, files) => {
    const urls = [];
    for (let f of Array.from(files)) {
      const url = await compressAndUpload(f, 400);
      if (url) urls.push(url);
    }
    const projList = designerModal.data.projects.map((p, i) => 
      i === idx ? { ...p, images: [...(p.images || []), ...urls] } : p
    );
    setDesignerModal({ ...designerModal, data: { ...designerModal.data, projects: projList } });
  };

  const removeDesignerProjectImage = (projIdx, imgIdx) => {
    const projList = designerModal.data.projects.map((p, i) => 
      i === projIdx ? { ...p, images: p.images.filter((_, j) => j !== imgIdx) } : p
    );
    setDesignerModal({ ...designerModal, data: { ...designerModal.data, projects: projList } });
  };

  // Builders Projects Nested Array Handlers
  const addBuilderProject = () => {
    const projList = [...(builderModal.data.projects || [])];
    projList.push({ title: '', location: '', year: '', desc: '', images: [] });
    setBuilderModal({ ...builderModal, data: { ...builderModal.data, projects: projList } });
  };

  const removeBuilderProject = (idx) => {
    const projList = builderModal.data.projects.filter((_, i) => i !== idx);
    setBuilderModal({ ...builderModal, data: { ...builderModal.data, projects: projList } });
  };

  const updateBuilderProjectField = (idx, field, val) => {
    const projList = builderModal.data.projects.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    setBuilderModal({ ...builderModal, data: { ...builderModal.data, projects: projList } });
  };

  const handleBuilderProjectPhotoUpload = async (idx, files) => {
    const urls = [];
    for (let f of Array.from(files)) {
      const url = await compressAndUpload(f, 400);
      if (url) urls.push(url);
    }
    const projList = builderModal.data.projects.map((p, i) =>
      i === idx ? { ...p, images: [...(p.images || []), ...urls] } : p
    );
    setBuilderModal({ ...builderModal, data: { ...builderModal.data, projects: projList } });
  };

  const removeBuilderProjectImage = (projIdx, imgIdx) => {
    const projList = builderModal.data.projects.map((p, i) =>
      i === projIdx ? { ...p, images: p.images.filter((_, j) => j !== imgIdx) } : p
    );
    setBuilderModal({ ...builderModal, data: { ...builderModal.data, projects: projList } });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0' }}>
      <h2>Vendor & Admin Console</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Manage material listings, add or delete products, and view received customer orders & service leads.
      </p>

      <div className="admin-layout">
        {/* Admin Sidebar Navigation */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic pane based on activeTab */}
        <div className="admin-content">
          {activeTab === 'products' && (
            <AdminProductPane
              products={products}
              categories={categories}
              units={units}
              onAddProduct={() => setProductModal({ open: true, editId: null, data: { name: '', brand: '', category: categories[0]?.id || '', price: '', unit: units[0]?.id || '', description: '', imageSrc: '', specGrade: 'Grade A', specSize: 'IS Certified' } })}
              onEditProduct={(p) => setProductModal({
                open: true,
                editId: p.id,
                data: {
                  name: p.name,
                  brand: p.brand,
                  category: p.category,
                  price: p.price,
                  unit: p.unit,
                  description: p.description || '',
                  imageSrc: p.imageSrc || '',
                  specGrade: p.specs?.['Grade/Class'] || 'Grade A',
                  specSize: p.specs?.['Specification'] || 'IS Certified'
                }
              })}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoryPane
              categories={categories}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'units' && (
            <AdminUnitPane
              units={units}
              onAddUnit={handleAddUnit}
              onDeleteUnit={handleDeleteUnit}
            />
          )}

          {activeTab === 'banners' && (
            <AdminBannerPane
              banners={banners}
              onAddBanner={() => setBannerModal({ open: true, editId: null, data: { imageSrc: '', link: '#/products', styleType: 'cover', position: 'center', bgColor: '#ffffff' } })}
              onEditBanner={(b) => setBannerModal({
                open: true,
                editId: b.id,
                data: {
                  imageSrc: b.imageSrc || '',
                  link: b.link || '#/products',
                  styleType: b.styleType || 'cover',
                  position: b.position || 'center',
                  bgColor: b.bgColor || '#ffffff'
                }
              })}
              onDeleteBanner={handleDeleteBanner}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrderPane orders={orders} />
          )}

          {activeTab === 'leads' && (
            <AdminLeadPane leads={leads} />
          )}

          {activeTab === 'designers' && (
            <AdminDesignerPane
              designers={designers}
              onAddDesigner={() => setDesignerModal({ open: true, editId: null, data: { name: '', firm: '', experience: '', rating: '5.0', reviewsCount: 0, completedProjects: 0, specialties: '', bio: '', fullBio: '', avatarImg: '', avatarText: '', avatarBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)', projects: [] } })}
              onEditDesigner={(d) => setDesignerModal({
                open: true,
                editId: d.id,
                data: {
                  name: d.name,
                  firm: d.firm,
                  experience: d.experience,
                  rating: d.rating || '5.0',
                  reviewsCount: d.reviewsCount || 0,
                  completedProjects: d.completedProjects || 0,
                  specialties: d.specialties ? d.specialties.join(', ') : '',
                  bio: d.bio || '',
                  fullBio: d.fullBio || '',
                  avatarImg: d.avatarImg || '',
                  avatarText: d.avatarText || '',
                  avatarBg: d.avatarBg || 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  projects: d.projects ? JSON.parse(JSON.stringify(d.projects)) : []
                }
              })}
              onDeleteDesigner={handleDeleteDesigner}
            />
          )}

          {activeTab === 'builders' && (
            <AdminBuilderPane
              builders={builders}
              onAddBuilder={() => setBuilderModal({ open: true, editId: null, data: { name: '', firm: '', experience: '', rating: '5.0', reviewsCount: 0, completedProjects: 0, specialties: '', bio: '', fullBio: '', avatarImg: '', avatarText: '', avatarBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)', projects: [] } })}
              onEditBuilder={(b) => setBuilderModal({
                open: true,
                editId: b.id,
                data: {
                  name: b.name,
                  firm: b.firm,
                  experience: b.experience,
                  rating: b.rating || '5.0',
                  reviewsCount: b.reviewsCount || 0,
                  completedProjects: b.completedProjects || 0,
                  specialties: b.specialties ? b.specialties.join(', ') : '',
                  bio: b.bio || '',
                  fullBio: b.fullBio || '',
                  avatarImg: b.avatarImg || '',
                  avatarText: b.avatarText || '',
                  avatarBg: b.avatarBg || 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  projects: b.projects ? JSON.parse(JSON.stringify(b.projects)) : []
                }
              })}
              onDeleteBuilder={handleDeleteBuilder}
            />
          )}

          {activeTab === 'guides' && (
            <AdminGuidePane
              guides={guides}
              onAddGuide={() => setGuideModal({ open: true, editId: null, data: { title: '', date: '', imageSrc: '', content: '' } })}
              onEditGuide={(g) => setGuideModal({
                open: true,
                editId: g.id,
                data: {
                  title: g.title || '',
                  date: g.date || '',
                  imageSrc: g.imageSrc || '',
                  content: g.content || ''
                }
              })}
              onDeleteGuide={handleDeleteGuide}
            />
          )}
        </div>
      </div>

      {/* 1. PRODUCT MODAL */}
      {productModal.open && (
        <ProductModal
          categories={categories}
          units={units}
          productModal={productModal}
          setProductModal={setProductModal}
          onSubmit={handleProductSubmit}
          compressAndUpload={compressAndUpload}
        />
      )}

      {/* 2. BANNER MODAL */}
      {bannerModal.open && (
        <BannerModal
          bannerModal={bannerModal}
          setBannerModal={setBannerModal}
          onSubmit={handleBannerSubmit}
          compressAndUpload={compressAndUpload}
        />
      )}

      {/* 3. DESIGNER MODAL */}
      {designerModal.open && (
        <DesignerModal
          designerModal={designerModal}
          setDesignerModal={setDesignerModal}
          onSubmit={handleDesignerSubmit}
          compressAndUpload={compressAndUpload}
          addDesignerProject={addDesignerProject}
          removeDesignerProject={removeDesignerProject}
          updateDesignerProjectField={updateDesignerProjectField}
          handleDesignerProjectPhotoUpload={handleDesignerProjectPhotoUpload}
          removeDesignerProjectImage={removeDesignerProjectImage}
        />
      )}

      {/* 4. BUILDER MODAL */}
      {builderModal.open && (
        <BuilderModal
          builderModal={builderModal}
          setBuilderModal={setBuilderModal}
          onSubmit={handleBuilderSubmit}
          compressAndUpload={compressAndUpload}
          addBuilderProject={addBuilderProject}
          removeBuilderProject={removeBuilderProject}
          updateBuilderProjectField={updateBuilderProjectField}
          handleBuilderProjectPhotoUpload={handleBuilderProjectPhotoUpload}
          removeBuilderProjectImage={removeBuilderProjectImage}
        />
      )}

      {/* 5. GUIDE/BLOG MODAL */}
      {guideModal.open && (
        <GuideModal
          guideModal={guideModal}
          setGuideModal={setGuideModal}
          onSubmit={handleGuideSubmit}
        />
      )}

      {/* 6. CATEGORY MODAL */}
      {categoryModal.open && (
        <CategoryModal
          categoryModal={categoryModal}
          setCategoryModal={setCategoryModal}
          onSubmit={handleCategorySubmit}
        />
      )}
    </div>
  );
}
