// InventoryPage.jsx
import { useState } from 'react';
import InventoryForm from './InventoryForm';

const InventoryPage = () => {
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="p-4">
      {showForm && <InventoryForm onClose={() => setShowForm(false)} />}
      
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Open Inventory Form
        </button>
      )}
    </div>
  );
};

export default InventoryPage;