import { useState, useEffect } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';
import ConfirmModal from '../../ui/ConfirmModal';
import AlertModal from '../../ui/AlertModal';

function ReviewsTab() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/reviews?all=true&limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const executeDelete = async () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: null });
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
      setAlertModal({ isOpen: true, title: 'Error', message: 'An error occurred while deleting', type: 'error' });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, status: 'Approved' } : r));
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const toggleHomeShow = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ showOnHome: !currentStatus })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, showOnHome: !currentStatus } : r));
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-border">
        <h2 className="text-lg md:text-xl font-bold text-text mb-4 md:mb-6">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {reviews.map(review => (
            <div key={review._id} className="p-4 md:p-6 rounded-2xl border border-border bg-bg-alt/50 relative">
              
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div>
                  <h3 className="font-bold text-text text-base md:text-lg">{review.customer}</h3>
                  <p className="text-xs md:text-sm text-primary font-medium">{review.product}</p>
                </div>
                <div className="flex gap-0.5 md:gap-1 text-yellow-400">
                  {Array(review.rating).fill(0).map((_, i) => <Star key={`filled-${i}`} size={16} className="fill-current text-yellow-400 md:w-[18px] md:h-[18px]" />)}
                  {Array(5 - review.rating).fill(0).map((_, i) => <Star key={`empty-${i}`} size={16} className="text-gray-300 md:w-[18px] md:h-[18px]" />)}
                </div>
              </div>
              
              <p className="text-xs md:text-sm text-text italic mb-4 md:mb-6">"{review.comment}"</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border pt-4 gap-4">
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <span className={`text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 rounded-full ${review.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {review.status}
                  </span>
                  {/* Home Page Toggle Moved Here */}
                  <div className="flex items-center gap-2 border-l border-border pl-3 md:pl-4">
                    <span className="text-[10px] md:text-xs font-bold text-text-light uppercase tracking-wider">Home Page</span>
                    <button 
                      onClick={() => toggleHomeShow(review._id, review.showOnHome)}
                      className={`w-9 md:w-10 h-4 md:h-5 rounded-full p-0.5 transition-colors cursor-pointer ${review.showOnHome ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`w-3 md:w-4 h-3 md:h-4 bg-white rounded-full transition-transform shadow-sm ${review.showOnHome ? 'translate-x-[20px]' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  {review.status === 'Pending' && (
                    <button onClick={() => handleApprove(review._id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 bg-green-500 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-green-600 transition-colors cursor-pointer">
                      <Check size={14} className="md:w-4 md:h-4" /> Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(review._id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs md:text-sm font-bold hover:bg-red-200 transition-colors cursor-pointer">
                    <Trash2 size={14} className="md:w-4 md:h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
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

export default ReviewsTab;
