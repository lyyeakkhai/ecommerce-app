import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card-header">
        <h3 className="product-name">{product.name}</h3>
        {product.onSale && <span className="badge badge-sale">Sale</span>}
      </div>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <div className="product-card-footer">
        {product.inStock ? (
          <span className="badge badge-in-stock">In stock</span>
        ) : (
          <span className="badge badge-sold-out">Sold out</span>
        )}
      </div>
    </article>
  );
}
