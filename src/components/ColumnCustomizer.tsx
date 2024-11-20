import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, GripVertical } from 'lucide-react';
import { TableColumn } from '../types';

interface ColumnCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn[];
  onUpdateColumns: (columns: TableColumn[]) => void;
}

export default function ColumnCustomizer({
  isOpen,
  onClose,
  columns,
  onUpdateColumns,
}: ColumnCustomizerProps) {
  const handleToggleColumn = (columnId: string) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
    );
    onUpdateColumns(updatedColumns);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <Dialog.Title className="text-lg font-semibold text-white">
              Customize Columns
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-500" />
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={column.isVisible}
                        onChange={() => handleToggleColumn(column.id)}
                        className="form-checkbox h-4 w-4 rounded border-dark-600 bg-dark-600 text-accent-purple focus:ring-accent-purple"
                      />
                      <span className="text-white">{column.label}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-400">
              Drag and drop columns to reorder them (coming soon)
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={onClose} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}