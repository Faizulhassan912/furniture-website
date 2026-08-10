import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../ui/ConfirmModal';
import AlertModal from '../../ui/AlertModal';
import { Plus, Edit, Trash2, X, UploadCloud, Loader2 } from 'lucide-react';

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [categories, setCategories] = useState([]);
  const [colorInput, setColorInput] = useState('');

  const [formData, setFormData] = useState({
    name: '', slug: '', parentCategory: 'Beds', subCategory: '', description: '', image: '', files: [], material: '', ageGroup: '', price: '', featured: false, finish: '', length: '', width: '', height: ''
  });

  const fetchProductsAndCategories = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const [prodData, catData] = await Promise.all([
        prodRes.json(),
        catRes.json()
      ]);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const executeDelete = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: null });
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to delete product', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while deleting', type: 'error' });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', slug: '', parentCategory: categories.find(c => c.parent === 'None')?.name || '', subCategory: '', description: '', image: '', files: [], material: '', ageGroup: '', price: '', featured: false, finish: '', length: '', width: '', height: '' });
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    // Find the parent category of this product's category
    const catObj = categories.find(c => c.name === product.category);
    const pCat = catObj && catObj.parent !== 'None' ? catObj.parent : (catObj?.name || '');
    const sCat = catObj && catObj.parent !== 'None' ? catObj.name : '';

    setFormData({ 
      ...product, 
      parentCategory: pCat,
      subCategory: sCat,
      files: [],
      price: product.price || '',
      finish: product.finish || '',
      length: product.dimensions?.length || '',
      width: product.dimensions?.width || '',
      height: product.dimensions?.height || ''
    });
    setImagePreviews(product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []));
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map(f => URL.createObjectURL(f));
      setImagePreviews(urls);
      setFormData({ ...formData, files: files });
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('adminToken');

    const submitData = new FormData();
    submitData.append('name', formData.name);
    // Automatically generate slug if new
    const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    submitData.append('slug', formData.slug || generatedSlug);
    submitData.append('category', formData.subCategory || formData.parentCategory);
    submitData.append('description', formData.description);
    submitData.append('material', formData.material || '');
    submitData.append('ageGroup', formData.ageGroup || '');
    submitData.append('price', formData.price || 0);
    submitData.append('stock', 0); // User requested to replace stock with subcategory
    submitData.append('featured', formData.featured || false);
    submitData.append('finish', formData.finish || '');
    submitData.append('length', formData.length || '');
    submitData.append('width', formData.width || '');
    submitData.append('height', formData.height || '');

    if (formData.files && formData.files.length > 0) {
      formData.files.forEach(f => {
        submitData.append('images', f);
      });
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });

      const data = await res.json();
      if (res.ok) {
        if (editingProduct) {
          setProducts(products.map(p => p._id === data._id ? data : p));
        } else {
          setProducts([data, ...products]);
        }
        setIsModalOpen(false);
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: data.message || 'Error saving product', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while saving.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const generateDescriptionWithAI = async () => {
    if (!formData.files || formData.files.length === 0) {
      setAlertModal({ isOpen: true, title: 'Error', message: 'Please upload a new image file from your device first to use the AI generator.', type: 'error' });
      return;
    }

    setIsLoadingAI(true);
    const token = localStorage.getItem('adminToken');
    const submitData = new FormData();
    submitData.append('image', formData.files[0]);
    submitData.append('categories', JSON.stringify(categories.map(c => ({ name: c.name, parent: c.parent }))));

    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });

      const data = await res.json();
      
      if (res.ok) {
        let newFormData = { 
          ...formData, 
          name: data.title || formData.name, 
          description: data.description || formData.description 
        };

        if (data.category) newFormData.parentCategory = data.category;
        if (data.subCategory) newFormData.subCategory = data.subCategory;
        if (data.material) newFormData.material = data.material;
        if (data.ageGroup) newFormData.ageGroup = data.ageGroup;
        if (data.price) newFormData.price = data.price;
        if (data.finish) newFormData.finish = data.finish;
        if (data.dimensions) {
          newFormData.length = data.dimensions.length || '';
          newFormData.width = data.dimensions.width || '';
          newFormData.height = data.dimensions.height || '';
        }

        setFormData(newFormData);
        setAlertModal({ isOpen: true, title: 'Success', message: 'Details generated and filled successfully!', type: 'success' });
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: data.message || 'Error generating description', type: 'error' });
      }
    } catch (error) {
      console.error('Error with AI generation:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to connect to AI service.', type: 'error' });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const [filterParentCategory, setFilterParentCategory] = useState('All');
  const [filterSubCategory, setFilterSubCategory] = useState('All');

  const filteredProducts = products.filter(p => {
     let matchParent = true;
     let matchSub = true;
     
     if (filterParentCategory !== 'All') {
        const catObj = categories.find(c => c.name === p.category);
        const pCat = catObj && catObj.parent !== 'None' ? catObj.parent : (catObj?.name || p.category);
        matchParent = pCat === filterParentCategory;
     }
     
     if (filterSubCategory !== 'All') {
        matchSub = p.category === filterSubCategory;
     }
     
     return matchParent && matchSub;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-text">Manage Products</h2>
          <p className="text-text-light text-xs md:text-sm mt-1">{filteredProducts.length} products</p>
        </div>
        <div className="flex flex-col md:flex-row w-full xl:w-auto items-stretch md:items-center gap-3">
          <select 
            value={filterParentCategory} 
            onChange={(e) => {
              setFilterParentCategory(e.target.value);
              setFilterSubCategory('All');
            }}
            className="w-full md:w-auto px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors text-text text-sm md:text-base"
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c.parent === 'None' || !c.parent).map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {filterParentCategory !== 'All' && (
            <select 
              value={filterSubCategory} 
              onChange={(e) => setFilterSubCategory(e.target.value)}
              className="w-full md:w-auto px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors text-text text-sm md:text-base"
            >
              <option value="All">All Sub Categories</option>
              {categories.filter(c => c.parent === filterParentCategory).map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          )}

          <button onClick={openAddModal} className="w-full md:w-auto justify-center bg-primary text-white font-bold py-2.5 md:py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer mt-2 md:mt-0">
            <Plus size={18} className="md:w-5 md:h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-bg-card rounded-3xl overflow-hidden shadow-sm border border-border">
        {isLoading ? (
          <div className="flex justify-center items-center p-10 text-primary">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={product._id}
                    className="flex items-center gap-3 p-3 hover:bg-bg-alt/50 transition-colors"
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-xl border border-border shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-bg-alt rounded-xl border border-border flex items-center justify-center text-[10px] text-text-light shrink-0">No Img</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-text truncate flex items-center gap-1.5">
                        {product.name}
                        {product.featured && <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded-full border border-primary/20 uppercase shrink-0">★</span>}
                      </p>
                      <p className="text-[10px] text-text-light mt-0.5">{product.category}</p>
                      <p className="text-xs font-bold text-primary mt-0.5">{product.price ? `Rs ${product.price}` : 'Rs 0'}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEditModal(product)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg transition-colors cursor-pointer" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors cursor-pointer" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                <p className="p-8 text-center text-text-light">No products found.</p>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-bg-alt text-text-light text-sm">
                  <tr>
                    <th className="p-4 font-semibold w-24">Image</th>
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price / Stock</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      key={product._id} 
                      className="hover:bg-bg-alt/50 transition-colors"
                    >
                      <td className="p-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-16 h-12 object-cover rounded-lg border border-border" />
                        ) : (
                          <div className="w-16 h-12 bg-bg-alt rounded-lg border border-border flex items-center justify-center text-xs text-text-light">No Img</div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-text">
                        <div className="flex items-center gap-2">
                          {product.name}
                          {product.featured && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider">Featured</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-bg-alt text-text-light text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap border border-border">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-text-light">
                        <span className="font-bold text-text">{product.price ? `Rs ${product.price}` : 'Rs 0'}</span><br/>
                        <span className="text-xs opacity-70">Stock: {product.stock || 0}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => openEditModal(product)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2 cursor-pointer" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-text-light">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 border border-border flex flex-col max-h-[90vh]"
            >
              <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold text-text">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-text-light hover:text-red-500 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-4 md:p-6 overflow-y-auto space-y-4">
                
                {/* Image Upload Area */}
                <div className="mb-6 flex flex-col items-center">
                  <label className="block text-sm font-bold text-text mb-2 w-full">Product Images (Upload up to 5)</label>
                  <div className="w-full min-h-[10rem] border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-center relative hover:bg-bg-alt hover:border-primary transition-colors cursor-pointer overflow-hidden">
                    {imagePreviews && imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 w-full">
                        {imagePreviews.map((preview, idx) => (
                          <img key={idx} src={preview} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg border border-border" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <UploadCloud size={32} className="text-primary mb-2" />
                        <p className="text-sm font-bold text-text-light">Click to Upload Multiple Images from Device</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleImageChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Select product images"
                    />
                  </div>
                  {formData.files && formData.files.length > 0 && (
                    <button 
                      type="button" 
                      onClick={generateDescriptionWithAI}
                      disabled={isLoadingAI}
                      className="mt-3 w-full py-2.5 bg-bg-alt hover:bg-primary hover:text-white border-2 border-primary text-primary rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                    >
                      {isLoadingAI ? <Loader2 size={16} className="animate-spin" /> : <span>Auto-Generate Title & Description with AI</span>}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-bold text-text mb-1">Product Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-bold text-text mb-1">Category</label>
                    <select value={formData.parentCategory} onChange={e => setFormData({...formData, parentCategory: e.target.value, subCategory: ''})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors">
                      <option value="">Select Category</option>
                      {categories.filter(c => c.parent === 'None' || !c.parent).map(c => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-8">
                    <label className="block text-sm font-bold text-text mb-1">Sub Category</label>
                    <select value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors">
                      <option value="">Select Sub Category (Optional)</option>
                      {categories.filter(c => c.parent === formData.parentCategory).map(c => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-bold text-text mb-1">Price (Rs)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-bold text-text mb-1">Material</label>
                    <input type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-bold text-text mb-1">Finish</label>
                    <input type="text" value={formData.finish} onChange={e => setFormData({...formData, finish: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-bold text-text mb-1">Age Group</label>
                    <input type="text" value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  
                  {/* Dimensions */}
                  <div className="sm:col-span-12 mt-2">
                    <label className="block text-sm font-bold text-text mb-2">Dimensions (Inches)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <input type="number" placeholder="Length" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                        <span className="text-xs text-text-light block mt-1 ml-1">Length</span>
                      </div>
                      <div>
                        <input type="number" placeholder="Width" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                        <span className="text-xs text-text-light block mt-1 ml-1">Width</span>
                      </div>
                      <div>
                        <input type="number" placeholder="Height" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                        <span className="text-xs text-text-light block mt-1 ml-1">Height</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-12 flex items-center mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" checked={formData.featured || false} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-6 h-6 appearance-none border-2 border-border rounded-lg checked:bg-primary checked:border-primary transition-colors cursor-pointer" />
                        <svg className={`absolute w-4 h-4 text-white pointer-events-none transition-opacity ${formData.featured ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-text block">Mark as Featured Product</span>
                        <span className="text-xs text-text-light">Featured products will be displayed on the Home Page's Featured Designs section.</span>
                      </div>
                    </label>
                  </div>
                  <div className="sm:col-span-12">
                    <label className="block text-sm font-bold text-text mb-1">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none" rows="3"></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-text font-bold hover:bg-bg-alt transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Yes, Delete"
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}

export default ProductsTab;
