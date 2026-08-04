import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, MessageCircle, ShoppingCart, Trash2, X, UploadCloud, Loader2, ChevronDown } from 'lucide-react';
import ConfirmModal from '../../ui/ConfirmModal';
import AlertModal from '../../ui/AlertModal';

function InquiriesTab() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedInquiries, setExpandedInquiries] = useState({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [orderType, setOrderType] = useState('standard'); // 'standard' or 'custom'
  
  const [formData, setFormData] = useState({
    amount: '', advance: '', address: '', product: 'Bunk Bed (Pink)', customDesc: '', customImage: null, file: null
  });

  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const executeDelete = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: null });
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to delete message', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while deleting', type: 'error' });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/messages/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus } : m));
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to update status', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while updating status', type: 'error' });
    }
  };

  const openConvertModal = (msg) => {
    setSelectedInquiry(msg);
    setFormData({ amount: '', advance: '', address: '', product: 'Bunk Bed (Pink)', customDesc: '', customImage: null, file: null });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setFormData({
        ...formData, 
        customImage: URL.createObjectURL(file),
        file: file
      });
    }
  };

  const handleConvertToOrder = async (e) => {
    e.preventDefault();
    setIsConverting(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const submitData = new FormData();
      submitData.append('customer', selectedInquiry.name);
      submitData.append('phone', selectedInquiry.phone);
      submitData.append('address', formData.address);
      submitData.append('productType', orderType === 'standard' ? 'Standard' : 'Custom');
      submitData.append('amount', formData.amount || 0);
      submitData.append('advance', formData.advance || 0);
      
      if (orderType === 'standard') {
        submitData.append('productName', formData.product);
      } else {
        submitData.append('customDesc', formData.customDesc);
        if (formData.file) {
          submitData.append('image', formData.file);
        }
      }

      // Step 1: Create Order
      const resOrder = await fetch('/api/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: submitData
      });
      
      const orderResult = await resOrder.json();
      
      if (resOrder.ok) {
        // Step 2: Update message status to Converted
        await handleStatusChange(selectedInquiry._id, 'Converted');
        setAlertModal({ isOpen: true, title: 'Success', message: 'Order Created Successfully!\nCheck the Orders tab to view details.', type: 'success' });
        setIsModalOpen(false);
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: orderResult.message || 'Failed to create order', type: 'error' });
      }
    } catch (error) {
      console.error('Error converting to order:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while converting.', type: 'error' });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-card p-6 rounded-3xl shadow-sm border border-border">
        <h2 className="text-xl font-bold text-text mb-6">Customer Inquiries</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-10 text-primary">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-text-light text-center py-8">No inquiries found.</p>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {messages.map(msg => {
              const isExpanded = expandedInquiries[msg._id];
              return (
                <div key={msg._id} className={`rounded-2xl border transition-all overflow-hidden ${msg.status === 'Unread' ? 'border-primary bg-primary/5' : 'border-border bg-bg-card'}`}>
                  {/* Collapsed Header - Always Visible */}
                  <div 
                    className="flex items-center justify-between p-4 md:p-6 cursor-pointer md:cursor-default"
                    onClick={() => setExpandedInquiries(prev => ({ ...prev, [msg._id]: !prev[msg._id] }))}
                  >
                    <div>
                      <h3 className="font-bold text-sm md:text-lg text-text flex items-center gap-2 flex-wrap">
                        {msg.name}
                        {msg.status === 'Unread' && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] md:text-xs">New</span>}
                        {msg.status === 'Converted' && <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] md:text-xs">Order</span>}
                      </h3>
                      <div className="text-xs md:text-sm text-text-light flex items-center gap-3 md:gap-4 mt-1">
                        <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-text-light transition-transform duration-300 md:hidden shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Expandable Details */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!max-h-[600px] md:!opacity-100 ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4 md:px-6 md:pb-6 pt-0 border-t border-border">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 mb-4">
                        <select 
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                          className={`text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full outline-none border border-transparent cursor-pointer ${
                            msg.status === 'Unread' ? 'bg-yellow-100 text-yellow-700' :
                            msg.status === 'Converted' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="Unread">Unread</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                          <option value="Converted">Converted</option>
                        </select>
                        
                        <a 
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] px-3 py-1 md:py-1.5 rounded-xl text-xs md:text-sm font-bold hover:bg-[#25D366] hover:text-white transition-colors"
                        >
                          <MessageCircle size={14} /> Reply
                        </a>

                        {msg.status !== 'Converted' && (
                          <button 
                            onClick={() => openConvertModal(msg)}
                            className="flex items-center gap-1.5 px-3 py-1 md:py-1.5 bg-primary text-white rounded-xl text-xs md:text-sm font-bold hover:bg-primary-dark transition-colors cursor-pointer"
                          >
                            <ShoppingCart size={14} /> Convert
                          </button>
                        )}

                        <button 
                          onClick={() => handleDelete(msg._id)}
                          className="px-3 py-1 md:py-1.5 bg-red-100 text-red-600 rounded-xl text-xs md:text-sm font-bold hover:bg-red-200 transition-colors cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="bg-bg-alt p-3 md:p-4 rounded-xl border border-border">
                        <p className="font-bold text-xs md:text-sm text-text mb-1">Subject: {msg.subject}</p>
                        <p className="text-text text-xs md:text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Convert to Order Modal */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-bg-card w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 border border-border flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-bold text-text flex items-center gap-2"><ShoppingCart size={24} className="text-primary" /> Convert to Order</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-light hover:text-red-500 cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleConvertToOrder} className="p-6 overflow-y-auto space-y-6">
                
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <p className="text-sm text-primary font-bold mb-1">Customer Details (Auto-filled)</p>
                  <p className="text-text font-semibold">{selectedInquiry.name} <span className="text-text-light font-normal">| {selectedInquiry.phone}</span></p>
                </div>

                {/* Toggle Order Type */}
                <div className="flex bg-bg-alt p-1 rounded-xl border border-border">
                  <button type="button" onClick={() => setOrderType('standard')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${orderType === 'standard' ? 'bg-bg-card shadow text-primary' : 'text-text-light hover:text-text'}`}>
                    Standard Product
                  </button>
                  <button type="button" onClick={() => setOrderType('custom')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${orderType === 'custom' ? 'bg-bg-card shadow text-primary' : 'text-text-light hover:text-text'}`}>
                    Custom Design
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderType === 'standard' ? (
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-text mb-1">Product Name</label>
                      <input type="text" value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                    </div>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-text mb-1">Custom Design Details</label>
                        <textarea value={formData.customDesc} onChange={e => setFormData({...formData, customDesc: e.target.value})} rows="3" required placeholder="Describe the custom furniture..." className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none"></textarea>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-text mb-1">Reference Image (Optional)</label>
                        <div className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center relative hover:bg-bg-alt transition-colors overflow-hidden cursor-pointer">
                          {formData.customImage ? (
                            <img src={formData.customImage} className="w-full h-full object-cover" alt="ref" />
                          ) : (
                            <div className="flex flex-col items-center">
                              <UploadCloud size={24} className="text-text-light mb-1" />
                              <span className="text-sm font-bold text-text-light cursor-pointer">Click to Upload</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Agreed Amount (Rs)</label>
                    <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="45000" className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1">Advance Received (Optional)</label>
                    <input type="number" value={formData.advance} onChange={e => setFormData({...formData, advance: e.target.value})} placeholder="10000" className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-text mb-1">Delivery Address</label>
                    <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required placeholder="Full shipping address..." className="w-full px-4 py-2 rounded-xl bg-bg-alt border border-border outline-none focus:border-primary transition-colors resize-none"></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-text font-bold hover:bg-bg-alt transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isConverting} className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isConverting && <Loader2 size={16} className="animate-spin" />}
                    Confirm & Move to Orders
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
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
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

export default InquiriesTab;
