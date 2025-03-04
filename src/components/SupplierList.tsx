import React, { useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers';
import { Supplier } from '../types';
import SupplierForm from './SupplierForm';

const SupplierList: React.FC = () => {
  const { suppliers, deleteSupplier, fetchSuppliers } = useSuppliers();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(new Set());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSuppliers();
    setIsRefreshing(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      await deleteSupplier(id);
    }
  };

  const toggleSupplierExpansion = (supplierId: string) => {
    setExpandedSuppliers(prev => {
      const next = new Set(prev);
      if (next.has(supplierId)) {
        next.delete(supplierId);
      } else {
        next.add(supplierId);
      }
      return next;
    });
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SupplierForm
          initialSupplier={editingSupplier}
          onSave={() => {
            setShowForm(false);
            setEditingSupplier(undefined);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingSupplier(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-text-base">Suppliers</h1>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className={`btn btn-outline ${
                isRefreshing ? 'cursor-not-allowed opacity-50' : ''
              }`}
              title="Refresh supplier list"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setEditingSupplier(undefined);
                setShowForm(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>New Supplier</span>
            </button>
          </div>
        </div>
      </div>

      {suppliers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No suppliers yet
          </h2>
          <p className="text-gray-500 mb-4">
            Get started by adding your first supplier
          </p>
          <button
            onClick={() => {
              setEditingSupplier(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary btn-icon"
          >
            <Plus size={16} /> Add Supplier
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-4 hover:bg-gray-50 space-y-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => toggleSupplierExpansion(supplier.id)}
                    className="mt-1 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {expandedSuppliers.has(supplier.id) ? (
                      <ChevronDown size={20} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-500" />
                    )}
                  </button>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {supplier.name}
                      <span className="ml-2 text-sm text-gray-500">
                        ({supplier.supplier_number})
                      </span>
                    </h3>
                    {supplier.email && (
                      <div className="text-sm text-gray-600">
                        Email: {supplier.email}
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="text-sm text-gray-600">
                        Phone: {supplier.phone}
                      </div>
                    )}
                    {supplier.website && (
                      <div className="text-sm text-gray-600">
                        Website:{' '}
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {supplier.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Edit supplier"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="Delete supplier"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {supplier.notes && (
                <div className="text-gray-600 mb-4">
                  <h4 className="font-medium mb-1">Notes</h4>
                  <p className="whitespace-pre-wrap">{supplier.notes}</p>
                </div>
              )}

              <div className={`mt-4 transition-all duration-200 ${
                expandedSuppliers.has(supplier.id) ? 'block' : 'hidden'
              }`}>
                <h4 className="font-medium mb-2">
                  Addresses ({supplier.addresses.length})
                </h4>
                <div className="grid gap-4 animate-fadeIn">
                  {supplier.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-gray-50 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {address.type} Address
                          </span>
                          {address.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{address.street}</div>
                        {address.street2 && <div>{address.street2}</div>}
                        <div>
                          {address.city}
                          {address.state && `, ${address.state}`}
                          {address.postal_code && ` ${address.postal_code}`}
                        </div>
                        <div>{address.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierList;
