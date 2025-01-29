import { useState } from 'react';
import { Users, Home, CreditCard, AlertCircle, Upload, X, PencilIcon, Trash2Icon } from 'lucide-react';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import { useAnnouncementStore } from '../../store/announcementStore';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { requests } = useMaintenanceStore();
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncementStore();
  const [students, setStudents] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showRoomList, setShowRoomList] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPendingPayments, setShowPendingPayments] = useState(false);
  const [showMaintenanceRequests, setShowMaintenanceRequests] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState('event');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [announcementDescription, setAnnouncementDescription] = useState('');

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementTitle(announcement.title);
    setAnnouncementCategory(announcement.category);
    setAnnouncementDate(announcement.date);
    setAnnouncementDescription(announcement.description);
    setShowAnnouncementForm(true);
  };

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
      toast.success('Announcement deleted successfully');
    }
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    
    const announcementData = {
      title: announcementTitle,
      category: announcementCategory,
      date: announcementDate,
      description: announcementDescription,
    };

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, announcementData);
      toast.success('Announcement updated successfully');
    } else {
      addAnnouncement({
        ...announcementData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      toast.success('Announcement created successfully');
    }

    setShowAnnouncementForm(false);
    setEditingAnnouncement(null);
    setAnnouncementTitle('');
    setAnnouncementCategory('event');
    setAnnouncementDate('');
    setAnnouncementDescription('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {});
          }).filter(item => Object.values(item).some(val => val));

          setStudents(data);
          setShowStudentList(true);
          toast.success('Student data imported successfully');
        } catch (error) {
          toast.error('Error processing file. Please ensure it\'s a valid CSV.');
        }
      };
      reader.readAsText(file);
    }
  };

  const blocks = ['A', 'B', 'C'];
  const roomsPerBlock = 27;

  // Simulated pending payments data
  const pendingPayments = [
    { studentId: 'STU001', studentName: 'John Doe', roomNumber: 'A101', type: 'Hostel Fee', amount: 25000, dueDate: '2024-04-30' },
    { studentId: 'STU002', studentName: 'Jane Smith', roomNumber: 'B205', type: 'Mess Fee', amount: 5000, dueDate: '2024-04-15' },
    { studentId: 'STU003', studentName: 'Mike Johnson', roomNumber: 'C304', type: 'Hostel Fee', amount: 25000, dueDate: '2024-04-30' },
  ];

  const generateRoomGrid = (block) => {
    const rooms = Array.from({ length: roomsPerBlock }, (_, i) => ({
      id: `${block}${i + 1}`.padStart(3, '0'),
      occupied: Math.random() > 0.3,
      maintenance: Math.random() > 0.8,
    }));
    return rooms;
  };

  const getRoomColor = (room) => {
    if (room.maintenance) return 'bg-red-500';
    return room.occupied ? 'bg-green-500' : 'bg-gray-300';
  };

  const handleRoomClick = (room) => {
    setSelectedRoom({
      roomNumber: room.id,
      block: room.id[0],
      floor: Math.floor((parseInt(room.id.slice(1)) - 1) / 9) + 1,
      student: {
        name: 'John Doe',
        id: 'STU001',
        course: 'Computer Science',
        year: '3rd Year',
        contact: '+1234567890',
        email: 'john.doe@example.com',
        pendingPayments: [
          { type: 'Hostel Fee', amount: 25000, dueDate: '2024-04-30' },
          { type: 'Mess Fee', amount: 5000, dueDate: '2024-04-15' }
        ],
        maintenanceHistory: requests.filter(req => req.roomNumber === room.id)
      }
    });
  };

  const stats = [
    { 
      label: 'Total Students', 
      value: students.length || '150', 
      icon: Users, 
      color: 'bg-blue-500',
      onClick: () => setShowStudentList(true)
    },
    { 
      label: 'Total Rooms', 
      value: '150', 
      icon: Home, 
      color: 'bg-green-500',
      onClick: () => setShowRoomList(true)
    },
    { 
      label: 'Pending Payments', 
      value: pendingPayments.length, 
      icon: CreditCard, 
      color: 'bg-yellow-500',
      onClick: () => setShowPendingPayments(true)
    },
    { 
      label: 'Maintenance Requests', 
      value: requests.length, 
      icon: AlertCircle, 
      color: 'bg-red-500',
      onClick: () => setShowMaintenanceRequests(true)
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white p-6 rounded-lg shadow-md ${stat.onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={stat.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Announcement Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Manage Announcements</h3>
          <button 
            onClick={() => setShowAnnouncementForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Announcement
          </button>
        </div>
        
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{announcement.title}</h4>
                  <p className="text-gray-600 mt-1">{announcement.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      announcement.category === 'event' ? 'bg-purple-100 text-purple-800' :
                      announcement.category === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      announcement.category === 'academic' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.category}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAnnouncement(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Form Modal */}
      {(showAnnouncementForm || editingAnnouncement) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h3>
                <button 
                  onClick={() => {
                    setShowAnnouncementForm(false);
                    setEditingAnnouncement(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={announcementCategory}
                    onChange={(e) => setAnnouncementCategory(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="event">Event</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="academic">Academic</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={announcementDate}
                    onChange={(e) => setAnnouncementDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={announcementDescription}
                    onChange={(e) => setAnnouncementDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnnouncementForm(false);
                      setEditingAnnouncement(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Room Visualization */}
      {showRoomList && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Room Status</h3>
            <button 
              onClick={() => setShowRoomList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blocks.map(block => (
              <div key={block} className="space-y-4">
                <h4 className="text-lg font-semibold text-center bg-blue-500 text-white py-2 rounded-md">
                  Block {block}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {generateRoomGrid(block).map(room => (
                    <button
                      key={room.id}
                      onClick={() => handleRoomClick(room)}
                      className={`${getRoomColor(room)} w-12 h-12 rounded-lg shadow-md hover:opacity-80 transition-opacity`}
                      title={`Room ${room.id}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Vacant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Maintenance</span>
            </div>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Room {selectedRoom.roomNumber}</h3>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Room Details</h4>
                    <p>Block: {selectedRoom.block}</p>
                    <p>Floor: {selectedRoom.floor}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Student Information</h4>
                    <p>Name: {selectedRoom.student.name}</p>
                    <p>ID: {selectedRoom.student.id}</p>
                    <p>Course: {selectedRoom.student.course}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Pending Payments</h4>
                  <div className="space-y-2">
                    {selectedRoom.student.pendingPayments.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{payment.type}</span>
                        <span className="font-semibold text-red-600">₹{payment.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Maintenance History</h4>
                  <div className="space-y-2">
                    {selectedRoom.student.maintenanceHistory.map((record) => (
                      <div key={record.id} className="flex justify-between items-center">
                        <span>{record.category}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Payments List */}
      {showPendingPayments && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Pending Payments</h3>
            <button 
              onClick={() => setShowPendingPayments(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">₹{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Requests List */}
      {showMaintenanceRequests && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Maintenance Requests</h3>
            <button 
              onClick={() => setShowMaintenanceRequests(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(request.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.category}</td>
                    <td className="px-6 py-4">{request.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'inProgress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Import Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Import Student Data</h3>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
              <Upload className="w-5 h-5" />
              <span>Upload CSV</span>
            </div>
          </label>
        </div>
        <p className="text-sm text-gray-500">Upload a CSV file with student details</p>
      </div>

      {/* Student List */}
      {showStudentList && students.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Student List</h3>
            <button 
              onClick={() => setShowStudentList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(students[0]).map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={index}>
                    {Object.values(student).map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;