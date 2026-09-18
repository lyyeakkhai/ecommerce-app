interface ProductFilterProps {
  inStockOnly: boolean;
  onToggleInStock: (checked: boolean) => void;
  productCount: number;
  saleCount: number;
}

export function ProductFilter({
  inStockOnly,
  onToggleInStock,
  productCount,
  saleCount,
}: ProductFilterProps) {
  return (
    <section className="catalog-filter-bar">
      <div className="filter-controls">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="filter-checkbox"
          />
          <span>In stock only</span>
        </label>

        {saleCount > 0 && (
          <span className="badge badge-sale-counter" title="Active sale items in catalog">
            🔥 {saleCount} on sale
          </span>
        )}
      </div>

      <div className="product-count-display">
        <strong>{productCount}</strong> {productCount === 1 ? 'product' : 'products'}
      </div>
    </section>
  );
}
