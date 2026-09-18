import { useState } from 'react';
import type { Product } from './types';
import { initialProducts } from './data/initialProducts';
import { ProductGrid } from './components/ProductGrid';
import { ProductFilter } from './components/ProductFilter';
import { AddProductForm } from './components/AddProductForm';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const filteredProducts = inStockOnly
    ? products.filter((product) => product.inStock)
    : products;

  const saleCount = products.filter((product) => product.onSale).length;

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
          <ProductFilter
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            productCount={filteredProducts.length}
            saleCount={saleCount}
          />
          <ProductGrid products={filteredProducts} />
        </section>
      </main>
    </div>
  );
}

export default App;
