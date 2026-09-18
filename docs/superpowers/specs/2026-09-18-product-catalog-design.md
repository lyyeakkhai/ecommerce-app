# Design Specification: Interactive Product Catalog Mini-App

**Date:** 2026-09-18  
**Topic:** Product Catalog with Controlled State, Filters, Validation & TypeScript (TSX)  
**Status:** Approved by User  

---

## 1. Overview & Purpose

Build a dynamic, interactive product catalog application in React + TypeScript (TSX) that demonstrates:
- Controlled components using single-object state.
- Dynamic data rendering with `.map()` and stable identifiers.
- Conditional rendering patterns in TSX (ternary expressions and `&&` short-circuiting; strictly zero `if` statements inside TSX).
- Pure inline validation logic (no `alert()`, immutable state updates).
- Full type safety using TypeScript interfaces without any `tsc` errors.

---

## 2. Architecture & File Structure

All components are strictly typed and use the `.tsx` file extension:

```
src/
├── types.ts                     # TypeScript interfaces (Product, ProductFormData, FormErrors)
├── utils/
│   └── validation.ts            # Pure form validation function (AI-generated & audited)
├── data/
│   └── initialProducts.ts       # Mock products dataset
├── components/
│   ├── ProductCard.tsx          # Single product card with ternary stock badge
│   ├── ProductGrid.tsx          # Product grid container mapped with stable keys
│   ├── ProductFilter.tsx        # Filter bar ("in stock only" + red sale counter)
│   └── AddProductForm.tsx       # Controlled form with inline validation errors
├── App.tsx                      # Root component coordinating state
├── App.css                      # Application styling
└── main.tsx                     # React entrypoint
```

---

## 3. Data Models & TypeScript Interfaces (`src/types.ts`)

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

---

## 4. State Management & Data Flow

### App Root State (`App.tsx`)
- `products: Product[]`: Initialized from `initialProducts`. Updated immutably via `setProducts(prev => [newProduct, ...prev])`.
- `inStockOnly: boolean`: State for filtering products. Defaults to `false`.

### Derived State (Computed on each render)
- `filteredProducts = inStockOnly ? products.filter(p => p.inStock) : products`
- `saleCount = products.filter(p => p.onSale).length`
- Total product count: `filteredProducts.length`

### Form Controlled State (`AddProductForm.tsx`)
- Single state object: `const [formData, setFormData] = useState<ProductFormData>(initialFormState)`
- Errors state: `const [errors, setErrors] = useState<FormErrors>({})`
- Controlled input bindings: Every `<input>` has explicit `value` (or `checked`) and an `onChange` handler.
- Form submission handles `e.preventDefault()`, executes `validateProductForm(formData)`, displays inline errors if invalid, or calls `onAddProduct` and resets form on success.

---

## 5. Pure Validation Logic (`src/utils/validation.ts`)

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

*Audit Guarantee:*
- Never invokes `window.alert()`.
- Pure function with no side effects or mutations.
- Sets error state immutably in React component state.

---

## 6. TSX Conditional Rendering Rules

1. **Stock Badge (Ternary):**
   ```tsx
   {product.inStock ? (
     <span className="badge in-stock">In stock</span>
   ) : (
     <span className="badge sold-out">Sold out</span>
   )}
   ```
   Green styling for in-stock, gray styling for sold-out.

2. **Sale Counter Badge (`&&`):**
   ```tsx
   {saleCount > 0 && (
     <span className="badge sale-counter">{saleCount} On Sale</span>
   )}
   ```
   Red badge rendered conditionally only when `saleCount > 0`.

3. **Inline Errors (`&&`):**
   ```tsx
   {errors.name && <p className="error-text">{errors.name}</p>}
   {errors.price && <p className="error-text">{errors.price}</p>}
   ```

4. **Zero `if` statements inside TSX templates.**

---

## 7. Audit Checklist

- [x] Every `<input>` has `value` (or `checked`) + `onChange` (controlled components).
- [x] Zero index keys: all `.map()` elements keyed by unique `product.id`.
- [x] Zero `if` statements inside TSX.
- [x] `npx tsc --noEmit` passes cleanly.
- [x] State updates are strictly immutable (`[newProduct, ...prev]`).

---

## 8. Verification & Deliverables

1. Verify `npx tsc --noEmit` runs with 0 errors.
2. Deliberately pass `price: "99.99"` (a string) to test TypeScript's error output, and record the exact compiler message:
   `Type 'string' is not assignable to type 'number'.`
3. Verify the mini-app in the browser and capture screenshots:
   - Product grid with badges.
   - Filtered view ("In stock only").
   - Inline validation errors on the form.
   - Terminal showing `npx tsc --noEmit` passing.
4. Commit all changes to git and push to GitHub `main` branch.
