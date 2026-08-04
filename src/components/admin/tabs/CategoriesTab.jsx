import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, UploadCloud, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import ConfirmModal from '../../ui/ConfirmModal';
import AlertModal from '../../ui/AlertModal';

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', file: null, status: 'Active', parent: 'None', desc: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [expandedParents, setExpandedParents] = useState({});

  const toggleParent = (parentName) => {
    setExpandedParents(prev => ({ ...prev, [parentName]: !prev[parentName] }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
      
      // Auto-expand parents that have children on first load if desired (keeping closed by default here)
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const executeDelete = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: null });
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to delete category', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while deleting', type: 'error' });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '', file: null, status: 'Active', parent: 'None', desc: '' });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({ 
      name: cat.name, 
      image: cat.image, 
      file: null,
      status: cat.status || 'Active', 
      parent: cat.parent || 'None', 
      desc: cat.desc || '' 
    });
    setImagePreview(cat.image);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData({ ...formData, file: file }); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('adminToken');
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('parent', formData.parent);
    submitData.append('status', formData.status);
    submitData.append('desc', formData.desc);
    
    if (formData.file) {
      submitData.append('image', formData.file);
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });
      
      const textData = await res.text();
      let data;
      try {
        data = JSON.parse(textData);
      } catch(e) {
        console.error("Failed to parse JSON. Server returned:", textData);
        setAlertModal({ isOpen: true, title: 'Error', message: 'Server error. Check console for details.', type: 'error' });
        return;
      }
      if (res.ok) {
         if (editingCategory) {
            setCategories(categories.map(c => c._id === data._id ? data : c));
         } else {
            setCategories([...categories, data]);
         }
         setIsModalOpen(false);
      } else {
         setAlertModal({ isOpen: true, title: 'Error', message: data.message || 'Error saving category', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while saving.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-border">
        <h2 className="text-lg md:text-xl font-bold text-text">Manage Categories</h2>
        <button onClick={openAddModal} className="w-full sm:w-auto justify-center bg-primary text-white font-bold py-2.5 md:py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer">
          <Plus size={18} className="md:w-5 md:h-5" /> Add Category
        </button>
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
              <AnimatePresence>
                {(() => {
                  const parents = categories.filter(c => c.parent === 'None' || !c.parent);
                  let sortedList = [];
                  parents.forEach(parent => {
                    const children = categories.filter(c => c.parent === parent.name);
                    sortedList.push({ ...parent, isChild: false, hasChildren: children.length > 0 });
                    
                    if (expandedParents[parent.name]) {
                      children.forEach(child => {
                        sortedList.push({ ...child, isChild: true });
                      });
                    }
                  });
                  
                  return sortedList.map((cat) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={cat._id}
                      className={`flex items-center gap-3 p-3 hover:bg-bg-alt/30 transition-colors ${cat.isChild ? 'bg-bg-alt/10 pl-6' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {cat.isChild && <span className="text-text-light/50 font-light text-xs">└─</span>}
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-xl border border-border shrink-0" />
                        ) : (
                          <div className="w-12 h-12 bg-bg-alt rounded-xl border border-border flex items-center justify-center text-[10px] text-text-light shrink-0">No Img</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-text truncate">{cat.name}</span>
                          {cat.hasChildren && (
                            <button 
                              onClick={() => toggleParent(cat.name)}
                              className="p-0.5 hover:bg-bg-alt rounded text-text-light hover:text-primary transition-colors cursor-pointer"
                            >
                              {expandedParents[cat.name] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-text-light mt-0.5">{cat.isChild ? `Child of ${cat.parent}` : 'Main Category'}</p>
                        <span className={`inline-block mt-1 text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                          cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {cat.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => openEditModal(cat)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg transition-colors cursor-pointer" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors cursor-pointer" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ));
                })()}
              </AnimatePresence>
              {categories.length === 0 && (
                <p className="p-8 text-center text-text-light text-sm">No categories found.</p>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-bg-alt text-text-light text-sm">
                  <tr>
                    <th className="p-4 font-semibold w-24">Image</th>
                    <th className="p-4 font-semibold">Category Name</th>
                    <th className="p-4 font-semibold">Parent Category</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence>
                  {(() => {
                    const parents = categories.filter(c => c.parent === 'None' || !c.parent);
                    let sortedList = [];
                    parents.forEach(parent => {
                      const children = categories.filter(c => c.parent === parent.name);
                      sortedList.push({ ...parent, isChild: false, hasChildren: children.length > 0 });
                      
                      if (expandedParents[parent.name]) {
                        children.forEach(child => {
                          sortedList.push({ ...child, isChild: true });
                        });
                      }
                    });
                    
                    return sortedList.map((cat) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={cat._id} 
                        className={`hover:bg-bg-alt/30 transition-colors ${cat.isChild ? 'bg-bg-alt/10' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {cat.isChild && <span className="text-text-light/50 ml-4 font-light">└─</span>}
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-12 h-10 object-cover rounded-lg border border-border shrink-0" />
                            ) : (
                              <div className="w-12 h-10 bg-bg-alt rounded-lg border border-border flex items-center justify-center text-xs text-text-light shrink-0">No Img</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-text">
                          <div className="flex items-center gap-2">
                            <span>{cat.name}</span>
                            {cat.hasChildren && (
                              <button 
                                onClick={() => toggleParent(cat.name)}
                                className="p-1 hover:bg-bg-alt rounded text-text-light hover:text-primary transition-colors cursor-pointer"
                                title={expandedParents[cat.name] ? 'Collapse Subcategories' : 'Expand Subcategories'}
                              >
                                {expandedParents[cat.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-text-light">{cat.isChild ? cat.parent : 'None'}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {cat.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => openEditModal(cat)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2 cursor-pointer" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ));
                  })()}
                  </AnimatePresence>
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-text-light">No categories found. Click "Add Category" to create one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
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
              className="bg-bg-card w-full max-w-xl rounded-3xl shadow-2xl relative z-10 border border-border flex flex-col max-h-[90vh]"
            >
              <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold text-text">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-light hover:text-red-500 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-4 md:p-6 overflow-y-auto space-y-4">
                
                {/* Image Upload Area */}
                <div className="mb-6 flex flex-col items-center">
                  <label className="block text-sm font-bold text-text mb-2 w-full">Category Image</label>
                  <div className="w-full h-40 border-2 border-dashed border-border rounded-xl flex items-center justify-center relative hover:bg-bg-alt hover:border-primary transition-colors cursor-pointer overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <UploadCloud size={32} className="text-primary mb-2" />
                        <p className="text-sm font-bold text-text-light">Click to Upload from Device</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-text mb-1">Category Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Parent Category</label>
                    <select value={formData.parent} onChange={e => setFormData({...formData, parent: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors">
                      <option value="None">None</option>
                      {categories.filter(c => c.parent === 'None' && c._id !== editingCategory?._id).map(c => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-text-light mt-1">Leave as "None" for main categories.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-text mb-1">Description</label>
                    <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none" rows="3"></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-text font-bold hover:bg-bg-alt transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    {editingCategory ? 'Save Changes' : 'Add Category'}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
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

export default CategoriesTab;
