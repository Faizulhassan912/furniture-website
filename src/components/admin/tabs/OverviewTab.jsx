import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Box, MessageSquare, Activity } from 'lucide-react';

function OverviewTab() {
  const [dashboardStats, setDashboardStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    inquiries: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const stats = [
    { label: 'Total Revenue', value: `Rs ${dashboardStats.revenue.toLocaleString()}`, trend: '', color: 'text-green-500', icon: DollarSign, bg: 'bg-green-50' },
    { label: 'Total Orders', value: dashboardStats.orders, trend: '', color: 'text-green-500', icon: ShoppingBag, bg: 'bg-blue-50' },
    { label: 'Active Products', value: dashboardStats.products, trend: '', color: 'text-gray-500', icon: Box, bg: 'bg-purple-50' },
    { label: 'Pending Inquiries', value: dashboardStats.inquiries, trend: '', color: 'text-red-500', icon: MessageSquare, bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-border relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110 ${stat.bg}`}></div>
            <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
              <h3 className="text-text-light text-[10px] md:text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
              <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} className="md:hidden" />
                <stat.icon size={20} className="hidden md:block" />
              </div>
            </div>
            <div className="flex items-end gap-2 md:gap-3 relative z-10">
              <p className="text-xl md:text-3xl font-bold text-text">{stat.value}</p>
              <span className={`text-xs md:text-sm font-bold mb-1 ${stat.color}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-bg-card p-6 rounded-3xl shadow-sm border border-border h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-text">Revenue Overview</h3>
            <select className="bg-bg-alt border border-border rounded-lg px-3 py-1 text-sm outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
            <p className="text-text-light font-medium">[ Beautiful Chart Placeholder ]</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-bg-card p-6 rounded-3xl shadow-sm border border-border h-96 flex flex-col">
          <h3 className="font-bold text-lg text-text mb-6 flex items-center gap-2">
            <Activity size={20} className="text-primary" /> Recent Activity
          </h3>
          <div className="flex-1 overflow-y-auto space-y-6">
            {dashboardStats.recentActivity && dashboardStats.recentActivity.length > 0 ? (
              dashboardStats.recentActivity.map((activity, index) => {
                const date = new Date(activity.createdAt);
                const isToday = date.toDateString() === new Date().toDateString();
                const timeString = isToday 
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString();

                return (
                  <div key={activity._id || index} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">New Inquiry from {activity.name}</p>
                      <p className="text-xs text-text-light mt-0.5">{timeString}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-text-light">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
