import { useState } from 'react';
import { ClipboardList, CheckCircle, Clock, Package } from 'lucide-react';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import { useInventoryStore } from '../../store/inventoryStore';
import toast from 'react-hot-toast';
import InventoryForm from '../../components/InventoryForm';

const StaffDashboard = () => {
  const { requests, updateRequestStatus } = useMaintenanceStore();
  const { addInventoryItem } = useInventoryStore();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  const handleStatusUpdate = (id, newStatus) => {
    updateRequestStatus(id, newStatus);
    toast.success('Status updated successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inProgress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const inProgressCount = requests.filter(r => r.status === 'inProgress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  const handleAddInventory = (newItem) => {
    addInventoryItem(newItem);
    toast.success('Inventory item added successfully');
    setShowInventoryForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Staff Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold">Pending</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{pendingCount}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">In Progress</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{inProgressCount}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Completed</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{completedCount}</p>
          </div>

          <div 
            className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => setShowInventoryForm(true)}
          >
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">Add Inventory</h3>
            </div>
            <p className="mt-2">Record new items</p>
          </div>
        </div>

        {showInventoryForm ? (
          <InventoryForm 
            onClose={() => setShowInventoryForm(false)}
            addInventoryItem={handleAddInventory}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.roomNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.studentName}
                    </td>
                    <td className="px-6 py-4">
                      {request.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.urgency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={selectedStatus}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          handleStatusUpdate(request.id, e.target.value);
                        }}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="">Update Status</option>
                        <option value="pending">Pending</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;