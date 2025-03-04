import React from 'react';
import { useState, useCallback } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Settings from './components/Settings';
import SupplierList from './components/SupplierList';
import PurchaseOrderList from './components/PurchaseOrderList';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import HelpCenter from './components/HelpCenter'; // Import HelpCenter
import { Product } from './types';

type View = 'products' | 'suppliers' | 'settings' | 'product-form' | 'purchase-orders' | 'purchase-order-form'; // Remove 'help' from here

function App() {
  const [view, setView] = useState<View>('products');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editPurchaseOrder, setEditPurchaseOrder] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('general');

  const handleNewProduct = useCallback(() => {
    setEditProduct(null);
    setView('product-form');
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditProduct(product);
    setView('product-form');
  }, []);

  const handleProductFormClose = useCallback(() => {
    setEditProduct(null);
    setView('products');
  }, []);

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-primary text-white px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-medium">Varianthantering</h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setView('products')}
              className={`text-white hover:text-gray-200 ${
                view === 'products' || view === 'product-form' ? 'border-b-2 border-white' : ''
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setView('suppliers')}
              className={`text-white hover:text-gray-200 ${
                view === 'suppliers' ? 'border-b-2 border-white' : ''
              }`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setView('purchase-orders')}
              className={`text-white hover:text-gray-200 ${
                view === 'purchase-orders' || view === 'purchase-order-form' ? 'border-b-2 border-white' : ''
              }`}
            >
              Purchase Orders
            </button>
            <button
              onClick={() => setView('settings')}
              className={`text-white hover:text-gray-200 ${
                view === 'settings' ? 'border-b-2 border-white' : ''
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {view === 'settings' && (
          <Settings />
        )}
        {view === 'help' && <HelpCenter />} {/* Render HelpCenter when help view is selected */}
      </div>

      {view === 'products' && (
        <ProductList
          onNewProduct={handleNewProduct}
          onEditProduct={handleEditProduct}
        />
      )}
      {view === 'product-form' && (
        <ProductForm
          initialProduct={editProduct}
          onSave={handleProductFormClose}
          onCancel={handleProductFormClose}
        />
      )}
      {view === 'suppliers' && (
        <SupplierList />
      )}
      {view === 'purchase-orders' && (
        <PurchaseOrderList
          onNewOrder={() => {
            setEditPurchaseOrder(null);
            setView('purchase-order-form');
          }}
          onEditOrder={(id) => {
            setEditPurchaseOrder(id);
            setView('purchase-order-form');
          }}
        />
      )}
      {view === 'purchase-order-form' && (
        <PurchaseOrderForm
          orderId={editPurchaseOrder}
          onSave={() => {
            setEditPurchaseOrder(null);
            setView('purchase-orders');
          }}
          onCancel={() => {
            setEditPurchaseOrder(null);
            setView('purchase-orders');
          }}
        />
      )}
    </div>
  );
}

export default App;
