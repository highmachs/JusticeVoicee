import React, { useState } from 'react';

const DecoyInterface = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Milk', checked: false },
    { id: 2, text: 'Bread', checked: true },
    { id: 3, text: 'Vegetables', checked: false },
  ]);
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), text: newItem, checked: false }]);
    setNewItem('');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <div className="bg-yellow-400 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-yellow-900">My Shopping List</h1>
      </div>
      
      <div className="p-4 max-w-md mx-auto">
        <form onSubmit={addItem} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item..."
            className="flex-1 border-2 border-yellow-200 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500"
          />
          <button type="submit" className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-yellow-600">
            Add
          </button>
        </form>

        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} 
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${item.checked ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-yellow-100 shadow-sm'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.checked ? 'bg-gray-400 border-gray-400' : 'border-yellow-400'}`}>
                {item.checked && <span className="text-white text-sm">✓</span>}
              </div>
              <span className={`text-lg ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecoyInterface;
