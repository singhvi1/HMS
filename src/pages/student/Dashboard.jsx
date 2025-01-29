import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useLeaveStore } from '../../store/leaveStore';
import toast from 'react-hot-toast';
import { CreditCard, Building, AlertCircle, PenTool as Tool, Calendar } from 'lucide-react';
import MaintenanceRequestForm from '../../components/MaintenanceRequestForm';
import LeaveRequestForm from '../../components/LeaveRequestForm';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { leaveRequests } = useLeaveStore();
  const [loading, setLoading] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState('');

  const studentLeaves = leaveRequests.filter(request => request.studentId === user?.id);
  const approvedLeaves = studentLeaves.filter(leave => leave.status === 'approved');

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount, type) => {
    if (processingPayment) {
      toast.error('Another payment is being processed');
      return;
    }

    setProcessingPayment(type);
    setLoading(true);
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      setLoading(false);
      setProcessingPayment('');
      return;
    }

    const options = {
      key: 'rzp_test_TR59BRuVlXHiId',
      amount: amount * 100,
      currency: 'INR',
      name: 'Hostel Management System',
      description: `${type} Payment`,
      handler: function (response) {
        toast.success('Payment Successful!');
        console.log(response);
        setProcessingPayment('');
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#4F46E5',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">Room Details</h3>
            </div>
            <p>Room Number: {user?.roomNumber}</p>
            <p>Type: Single Occupancy</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Payment Status</h3>
            </div>
            <p>Hostel Fee: Pending</p>
            <p>Mess Fee: Paid</p>
          </div>
          
          <div 
            className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
            onClick={() => setShowMaintenanceForm(true)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Tool className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold">Maintenance Request</h3>
            </div>
            <p>Click to submit a new request</p>
          </div>

          <div 
            className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => setShowLeaveForm(true)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">Leave Request</h3>
            </div>
            <p>Click to apply for leave</p>
          </div>
        </div>
      </div>

      {/* Approved Leave Passes */}
      {approvedLeaves.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Approved Leave Passes</h3>
          <div className="space-y-4">
            {approvedLeaves.map((leave) => (
              <div key={leave.id} className="border p-4 rounded-lg bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Leave Period</p>
                    <p className="text-sm text-gray-600">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Approved
                  </span>
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Destination</p>
                  <p className="text-sm text-gray-600">{leave.destination}</p>
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Reason</p>
                  <p className="text-sm text-gray-600">{leave.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showMaintenanceForm && (
        <MaintenanceRequestForm onClose={() => setShowMaintenanceForm(false)} />
      )}

      {showLeaveForm && (
        <LeaveRequestForm onClose={() => setShowLeaveForm(false)} />
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Payment Section</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Hostel Fee</h4>
              <p className="text-gray-600">Due Amount: ₹25,000</p>
            </div>
            <button
              onClick={() => handlePayment(25000, 'hostel')}
              disabled={loading || processingPayment}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {processingPayment === 'hostel' ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Mess Fee</h4>
              <p className="text-gray-600">Due Amount: ₹5,000</p>
            </div>
            <button
              onClick={() => handlePayment(5000, 'mess')}
              disabled={loading || processingPayment}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {processingPayment === 'mess' ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;