# Product Catalog Mini-App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reactive product catalog in React and TypeScript (TSX) featuring controlled inputs with a single state object, inline validation, stock badges via ternary, sale counter via `&&`, and strict TypeScript interfaces.

**Architecture:** Modular component architecture with centralized TypeScript definitions (`types.ts`), pure validation helper (`utils/validation.ts`), reusable presentation components (`ProductCard.tsx`, `ProductGrid.tsx`, `ProductFilter.tsx`, `AddProductForm.tsx`), and a coordinating root component (`App.tsx`).

**Tech Stack:** React 19, TypeScript, Vite, CSS.

## Global Constraints

- All component files must strictly use `.tsx` extension.
- Every `<input>` must have `value` (or `checked`) and `onChange` (controlled components).
- Zero index keys: all `.map()` elements must be keyed by unique `product.id`.
- Zero `if` statements inside TSX templates (use ternary or `&&` expressions).
- No `window.alert()`: validation errors must be managed in state and displayed inline.
- State updates must be strictly immutable.
- `npx tsc --noEmit` must pass cleanly with 0 errors.

---

### Task 1: TypeScript Interfaces and Mock Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data/initialProducts.ts`

**Interfaces:**
- Produces: `Product`, `ProductFormData`, `FormErrors`, `ValidationResult` in `src/types.ts`
- Produces: `initialProducts: Product[]` in `src/data/initialProducts.ts`

- [ ] **Step 1: Create `src/types.ts`**

Define `Product`, `ProductFormData`, `FormErrors`, and `ValidationResult`.

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  onSale: boolean;
}

export interface ProductFormData {
  name: string;
  price: string;
  inStock: boolean;
  onSale: boolean;
}

export interface FormErrors {
  name?: string;
  price?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}
```

- [ ] **Step 2: Create `src/data/initialProducts.ts`**

Provide initial mock products with a variety of inStock and onSale states.

```typescript
import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    inStock: true,
    onSale: true,
  },
  {
    id: 'prod-2',
    name: 'Mechanical Gaming Keyboard',
    price: 129.50,
    inStock: true,
    onSale: false,
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Vertical Mouse',
    price: 49.99,
    inStock: false,
    onSale: true,
  },
  {
    id: 'prod-4',
    name: 'Ultra-Wide Curved Monitor 34"',
    price: 499.00,
    inStock: true,
    onSale: true,
  },
  {
    id: 'prod-5',
    name: 'USB-C Multiport Hub Adapter',
    price: 39.95,
    inStock: false,
    onSale: false,
  },
];
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: Exit code 0 (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/data/initialProducts.ts
git commit -m "feat: add typescript interfaces and mock products dataset"
```

---

### Task 2: Pure Form Validation Logic

**Files:**
- Create: `src/utils/validation.ts`

**Interfaces:**
- Consumes: `ProductFormData`, `ValidationResult`, `FormErrors` from `src/types.ts`
- Produces: `validateProductForm(data: ProductFormData): ValidationResult`

- [ ] **Step 1: Create `src/utils/validation.ts`**

Implement pure validation function setting inline errors for empty names and non-numeric / non-positive prices.

```typescript
import { ProductFormData, ValidationResult, FormErrors } from '../types';

export function validateProductForm(data: ProductFormData): ValidationResult {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Product name is required.';
  }

  const trimmedPrice = data.price.trim();
  if (!trimmedPrice) {
    errors.price = 'Price is required.';
  } else {
    const numericPrice = Number(trimmedPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      errors.price = 'Price must be a valid number greater than 0.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: Exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/utils/validation.ts
git commit -m "feat: implement pure product form validation logic"
```

---

### Task 3: ProductCard and ProductGrid Components

**Files:**
- Create: `src/components/ProductCard.tsx`
- Create: `src/components/ProductGrid.tsx`

**Interfaces:**
- Consumes: `Product` from `src/types.ts`
- Produces: `ProductCard({ product }: { product: Product })`
- Produces: `ProductGrid({ products }: { products: Product[] })`

- [ ] **Step 1: Create `src/components/ProductCard.tsx`**

Render product details with stock badge via ternary (green for "In stock", gray for "Sold out") and sale badge. Zero `if` statements inside TSX.

```tsx
import { Product } from '../types';

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
```

- [ ] **Step 2: Create `src/components/ProductGrid.tsx`**

Render product list mapped with stable keys (`product.id`). Never use array index.

```tsx
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid-container">
      {products.length === 0 ? (
        <p className="empty-catalog-message">No products found matching your filter.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: Exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductCard.tsx src/components/ProductGrid.tsx
git commit -m "feat: add ProductCard and ProductGrid components"
```

---

### Task 4: ProductFilter Component

**Files:**
- Create: `src/components/ProductFilter.tsx`

**Interfaces:**
- Produces: `ProductFilter({ inStockOnly, onToggleInStock, productCount, saleCount }: ProductFilterProps)`

- [ ] **Step 1: Create `src/components/ProductFilter.tsx`**

Renders "X products" count, controlled checkbox for "In stock only", and red sale counter using `&&` only when `saleCount > 0`.

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: Exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductFilter.tsx
git commit -m "feat: add ProductFilter component with sale counter and in-stock toggle"
```

---

### Task 5: Controlled AddProductForm Component

**Files:**
- Create: `src/components/AddProductForm.tsx`

**Interfaces:**
- Consumes: `Product`, `ProductFormData`, `FormErrors` from `src/types.ts`
- Consumes: `validateProductForm` from `src/utils/validation.ts`
- Produces: `AddProductForm({ onAddProduct }: { onAddProduct: (product: Product) => void })`

- [ ] **Step 1: Create `src/components/AddProductForm.tsx`**

Single state object `formData`, `e.preventDefault()`, inline errors, zero alerts, controlled inputs with `value`/`checked` and `onChange`.

```tsx
import { useState } from 'react';
import { Product, ProductFormData, FormErrors } from '../types';
import { validateProductForm } from '../utils/validation';

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
}

const initialFormState: ProductFormData = {
  name: '',
  price: '',
  inStock: true,
  onSale: false,
};

export function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: formData.name.trim(),
      price: parseFloat(parseFloat(formData.price.trim()).toFixed(2)),
      inStock: formData.inStock,
      onSale: formData.onSale,
    };

    onAddProduct(newProduct);
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Add New Product</h2>

      <div className="form-group">
        <label htmlFor="product-name">Product Name</label>
        <input
          id="product-name"
          type="text"
          name="name"
          placeholder="e.g. Wireless Mouse"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="product-price">Price ($)</label>
        <input
          id="product-price"
          type="text"
          name="price"
          placeholder="e.g. 29.99"
          value={formData.price}
          onChange={handleChange}
          className={errors.price ? 'input-error' : ''}
        />
        {errors.price && <p className="error-message">{errors.price}</p>}
      </div>

      <div className="form-checkbox-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          <span>In Stock</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="onSale"
            checked={formData.onSale}
            onChange={handleChange}
          />
          <span>On Sale</span>
        </label>
      </div>

      <button type="submit" className="submit-button">
        Add Product
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: Exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/AddProductForm.tsx
git commit -m "feat: add controlled AddProductForm component with inline validation"
```

---

### Task 6: Wire Catalog in App.tsx and Style in App.css

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: all components and initialProducts
- Produces: Complete working interactive UI

- [ ] **Step 1: Update `src/App.tsx`**

Integrate state, filters, computed sale count, and components.

```tsx
import { useState } from 'react';
import { Product } from './types';
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
```

- [ ] **Step 2: Update `src/App.css`**

Add modern, clean styling for catalog cards, green "In stock" and gray "Sold out" badges, red sale counter, controlled form, and inline error messages.

- [ ] **Step 3: Verify TypeScript compilation and build**

Run: `npx tsc --noEmit && npm run build`  
Expected: Exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "feat: assemble interactive product catalog with styled components"
```

---

### Task 7: Intentional Type Error Test, Verification, Deliverables & Push

**Files:**
- Test check: verify type error when passing string to `price`
- Verification: preview app, take screenshots, push to `main`

- [ ] **Step 1: Test deliberate type mismatch in TypeScript**

Temporarily pass `price: "99.99"` in a test snippet to capture the exact compiler output from `npx tsc --noEmit`.
Record the exact error sentence:
`Type 'string' is not assignable to type 'number'.`

- [ ] **Step 2: Verify zero compiler errors**

Run: `npx tsc --noEmit`  
Ensure clean exit.

- [ ] **Step 3: Run dev server and capture deliverable screenshots**

Capture screenshots for:
1. Product catalog grid with stock badges (green "In stock", gray "Sold out").
2. Filtered view ("In stock only" active).
3. Form with inline validation errors visible.
4. Terminal output showing `npx tsc --noEmit` passing.

- [ ] **Step 4: Push to GitHub repository**

```bash
git push origin main
```
Confirm GitHub remote `https://github.com/lyyeakkhai/ecommerce-app.git` is up-to-date with `main`.
