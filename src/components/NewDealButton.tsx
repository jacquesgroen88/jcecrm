import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewDealModal from './NewDealModal';

export default function NewDealButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={24} />
      </button>
      <NewDealModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}