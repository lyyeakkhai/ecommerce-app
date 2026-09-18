import type { PublicProduct } from '../types';

interface ProductCardProps {
  product: PublicProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const category = product.category?.toUpperCase() ?? 'GENERAL';
  const description = product.description?.trim() ?? 'No description available.';

  return (
    <article className="product-card">
      <div className="product-card-header">
        <div>
          <span className="product-category" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent, #2563eb)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {category}
          </span>
          <h3 className="product-name">{product.name}</h3>
        </div>
        {product.onSale && <span className="badge badge-sale">Sale</span>}
      </div>
      <p className="product-description" style={{ fontSize: '0.875rem', color: 'var(--text)', margin: '0.25rem 0 0.75rem 0', lineHeight: 1.4 }}>
        {description}
      </p>
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

