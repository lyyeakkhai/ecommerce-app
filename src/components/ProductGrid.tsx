import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const productList = products ?? [];

  return (
    <div className="product-grid-container">
      {productList.length === 0 ? (
        <p className="empty-catalog-message">No products found matching your filter.</p>
      ) : (
        <div className="product-grid">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

