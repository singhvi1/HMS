import { useState } from 'react';
import { Package, Calendar, PenTool as Tool, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryForm = ({ onClose, addInventoryItem }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!itemName || !quantity || !block || !floor || !roomNumber || !purpose || !date) {
      toast.error('Please fill all fields.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      itemName,
      quantity: parseInt(quantity),
      location: `${block}-${floor}-${roomNumber}`,
      purpose,
      date,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    addInventoryItem(newItem);
    toast.success('Inventory item added successfully!');

    // Reset form
    setItemName('');
    setQuantity('');
    setBlock('');
    setFloor('');
    setRoomNumber('');
    setPurpose('');
    setDate('');

    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Package className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add Inventory Item</h2>
            <p className="text-gray-500">Record new inventory usage</p>
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
              Item Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                placeholder="Item name"
                required
              />
              <Tool className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Used
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-8"
                required
              >
                <option value="">Select Block</option>
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
              </select>
              <MapPin className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <div className="relative">
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-8"
                required
              >
                <option value="">Select Floor</option>
                <option value="0">Ground Floor</option>
                <option value="1">1st Floor</option>
                <option value="2">2nd Floor</option>
              </select>
              <MapPin className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <div className="relative">
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                placeholder="Bathroom/RoomNumber"
                required
              />
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Used
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose/Notes
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe how and why the item was used..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default InventoryForm;