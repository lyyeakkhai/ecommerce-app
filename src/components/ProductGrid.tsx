import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[] | null;
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid-container">
      {/* Bug 1 planted: Direct .map() call without null check causes crash when products is null */}
      <div className="product-grid">
        {(products as unknown as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

