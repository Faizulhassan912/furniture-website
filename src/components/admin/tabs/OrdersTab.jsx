import { useState, useEffect } from 'react';
import { Phone, Calendar, MapPin, Trash2, Plus, Loader2, ChevronDown } from 'lucide-react';
import ConfirmModal from '../../ui/ConfirmModal';
import AlertModal from '../../ui/AlertModal';

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(orders.filter(o => o._id !== id));
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to delete order', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while deleting', type: 'error' });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      } else {
        setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to update status', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while updating status', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-card p-4 md:p-6 rounded-3xl shadow-sm border border-border">
        <div className="mb-6 border-b border-border pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-text">Store Orders (Manual Tracking)</h2>
            <p className="text-text-light text-xs md:text-sm mt-1 max-w-2xl">
              Since customers order via WhatsApp, use this section to manually keep track of your confirmed orders, customer details, and delivery statuses in one organized place.
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-10 text-primary">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-text-light text-center py-8">No orders found.</p>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {orders.map(order => {
              const isExpanded = expandedOrders[order._id];
              return (
                <div key={order._id} className="rounded-2xl border border-border bg-bg-card transition-all overflow-hidden">
                  {/* Collapsed Header - Always Visible */}
                  <div 
                    className="flex items-center justify-between p-4 md:p-6 cursor-pointer md:cursor-default"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div>
                        <h3 className="font-bold text-sm md:text-lg text-text flex items-center gap-2 flex-wrap">
                          Order {order._id.substring(order._id.length - 6).toUpperCase()}
                          {order.status === 'Processing' && <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] md:text-xs">New</span>}
                          {order.productType === 'Custom' && <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] md:text-xs">Custom</span>}
                        </h3>
                        <p className="text-xs md:text-sm text-text-light mt-1 flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={order.status}
                        onChange={(e) => { e.stopPropagation(); handleStatusChange(order._id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full outline-none border border-transparent cursor-pointer ${
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown size={18} className={`text-text-light transition-transform duration-300 md:hidden ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expandable Details - Always visible on desktop, toggle on mobile */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out md:!max-h-[500px] md:!opacity-100 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4 md:px-6 md:pb-6 pt-0 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4">
                        <div className="bg-bg-alt p-3 md:p-4 rounded-xl border border-border">
                          <p className="text-xs text-text-light uppercase font-bold mb-2">Customer Details</p>
                          <p className="font-bold text-sm text-text">{order.customer}</p>
                          <p className="text-sm text-text-light flex items-center gap-2 mt-1"><Phone size={14} /> {order.phone}</p>
                          <p className="text-sm text-text-light flex items-center gap-2 mt-1"><MapPin size={14} /> {order.address}</p>
                        </div>
                        <div className="bg-bg-alt p-3 md:p-4 rounded-xl border border-border flex gap-4">
                          {order.image && (
                             <img src={order.image} className="w-20 h-20 object-cover rounded-lg border border-border" alt="Ref" />
                          )}
                          <div>
                            <p className="text-xs text-text-light uppercase font-bold mb-2">Order Item</p>
                            <p className="font-bold text-sm text-text">{order.productType === 'Custom' ? 'Custom Design' : order.productName}</p>
                            {order.customDesc && <p className="text-xs text-text-light mt-1">{order.customDesc}</p>}
                            <p className="text-lg font-bold text-primary mt-2">Rs {order.amount}</p>
                            {order.advance > 0 && <p className="text-xs text-green-600 font-bold mt-1">Advance: Rs {order.advance}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={() => handleDelete(order._id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors cursor-pointer text-sm font-bold"
                          title="Delete Order"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
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

export default OrdersTab;
