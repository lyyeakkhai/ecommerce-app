export interface ProductFilterProps {
  inStockOnly: boolean;
  onToggleInStock: (checked: boolean) => void;
  productCount: number;
  saleCount: number;
  onSyncOnlineCatalog?: () => void;
  onSyncDeals?: () => void;
  isSyncing?: boolean;
}

export function ProductFilter({
  inStockOnly,
  onToggleInStock,
  productCount,
  saleCount,
  onSyncOnlineCatalog,
  onSyncDeals,
  isSyncing = false,
}: ProductFilterProps) {

  const handleSync = onSyncOnlineCatalog ?? onSyncDeals;

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

        {handleSync && (
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="sync-button"
          >
            {isSyncing ? 'Syncing...' : 'Sync Online Catalog'}
          </button>
        )}
      </div>

      <div className="product-count-display">
        <strong>{productCount}</strong> {productCount === 1 ? 'product' : 'products'}
      </div>
    </section>
  );
}

