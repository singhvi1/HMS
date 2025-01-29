import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMaintenanceStore } from '../store/maintenanceStore';
import toast from 'react-hot-toast';
import { Wrench, AlertTriangle, Clock, PenTool as Tool, X } from 'lucide-react';

const MaintenanceRequestForm = ({ onClose }) => {
  const { user } = useAuthStore();
  const { addRequest } = useMaintenanceStore();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plumbing');
  const [urgency, setUrgency] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now().toString(),
      studentId: user?.id,
      roomNumber: user?.roomNumber,
      description,
      category,
      urgency,
      status: 'pending',
      date: new Date().toISOString(),
      studentName: user?.name
    };

    addRequest(newRequest);
    toast.success('Maintenance request submitted successfully!');
    setDescription('');
    setCategory('plumbing');
    setUrgency('normal');
    onClose();
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'normal':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'high':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'emergency':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Wrench className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Maintenance Request</h2>
            <p className="text-gray-500">Submit a new maintenance request for your room</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-3"
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="furniture">Furniture</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>
              <Tool className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="relative">
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className={`w-full rounded-lg border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-3 ${getUrgencyColor(urgency)}`}
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="emergency">Emergency</option>
              </select>
              <AlertTriangle className="w-5 h-5 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Please describe the issue in detail..."
            required
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room Number
              </label>
              <input
                type="text"
                value={user?.roomNumber || ''}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default MaintenanceRequestForm;