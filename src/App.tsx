import { useState } from 'react';
import type { Product } from './types';
import { initialProducts } from './data/initialProducts';
import { ProductGrid } from './components/ProductGrid';
import { ProductFilter } from './components/ProductFilter';
import { AddProductForm } from './components/AddProductForm';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (new URLSearchParams(window.location.search).get('crash') === 'true') {
      return (null as unknown as Product[]);
    }
    return initialProducts;
  });
  const [inStockOnly, setInStockOnly] = useState<boolean>(() => {
    return new URLSearchParams(window.location.search).get('inStockOnly') === 'true';
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleAddProduct = (newProduct: Product): void => {
    setProducts((prev) => [newProduct, ...(prev ?? [])]);
  };

  const handleSyncOnlineCatalog = async (): Promise<void> => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      // Bug 3 planted: mistyped URL ('prodcuts' instead of 'products')
      const res = await fetch('/api/prodcuts-deals.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const deals: Product[] = await res.json();
      setProducts((prev) => {
        const existingIds = new Set((prev ?? []).map((p) => p.id));
        const newDeals = deals.filter((deal) => !existingIds.has(deal.id));
        return [...(prev ?? []), ...newDeals];
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync deals';
      console.error('Failed to sync online catalog:', err);
      setSyncError(message);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredProducts: Product[] = (products ?? []).filter((product) =>
    inStockOnly ? product.inStock : true
  );

  const saleCount: number = (products ?? []).filter((product) => product.onSale).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Product Catalog</h1>
        <p className="app-subtitle">
          Explore products, filter real-time availability, and add new catalog items with validated inputs.
        </p>
      </header>

      <main className="catalog-layout">
        <aside className="catalog-sidebar">
          <AddProductForm onAddProduct={handleAddProduct} />
        </aside>

        <section className="catalog-main">
          {/* Bug 2 planted: prop name typo 'productsCount' passed instead of 'productCount' */}
          <ProductFilter
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            productsCount={filteredProducts.length}
            saleCount={saleCount}
            onSyncOnlineCatalog={handleSyncOnlineCatalog}
            isSyncing={isSyncing}
          />

          {syncError && (
            <div className="sync-error-banner" role="alert">
              Sync failed: {syncError}
            </div>
          )}
          <ProductGrid products={filteredProducts} />
        </section>
      </main>
    </div>
  );

}

export default App;
