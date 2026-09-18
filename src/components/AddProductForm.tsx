import { useState } from 'react';
import type { Product, ProductFormData, ProductFormDraft, FormErrors } from '../types';
import { validateProductForm } from '../utils/validation';

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
  initialDraft?: ProductFormDraft;
}

const defaultDraft: ProductFormDraft = {
  name: '',
  price: '',
  costPrice: '',
  category: '',
  description: '',
  inStock: true,
  onSale: false,
};

const getInitialFormState = (draft?: ProductFormDraft): ProductFormData => ({
  name: draft?.name ?? defaultDraft.name ?? '',
  price: draft?.price ?? defaultDraft.price ?? '',
  costPrice: draft?.costPrice ?? defaultDraft.costPrice ?? '',
  category: draft?.category ?? defaultDraft.category ?? '',
  description: draft?.description ?? defaultDraft.description ?? '',
  inStock: draft?.inStock ?? defaultDraft.inStock ?? true,
  onSale: draft?.onSale ?? defaultDraft.onSale ?? false,
});

export function AddProductForm({ onAddProduct, initialDraft }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(() => getInitialFormState(initialDraft));
  const [errors, setErrors] = useState<FormErrors>(() => {
    return new URLSearchParams(window.location.search).get('showErrors') === 'true'
      ? {
          name: 'Product name is required.',
          price: 'Price must be a valid number greater than 0.',
        }
      : {};
  });

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
    const costErrors: FormErrors = {};

    if (formData.costPrice && formData.costPrice.trim()) {
      const numericCost = Number(formData.costPrice.trim());
      if (isNaN(numericCost) || numericCost < 0) {
        costErrors.costPrice = 'Cost price must be a valid number greater than or equal to 0.';
      }
    }

    const combinedErrors: FormErrors = {
      ...validation.errors,
      ...costErrors,
    };

    if (!validation.isValid || Object.keys(costErrors).length > 0) {
      setErrors(combinedErrors);
      return;
    }

    const parsedPrice = parseFloat(parseFloat(formData.price.trim()).toFixed(2));
    const rawCost = formData.costPrice?.trim();
    const parsedCost = rawCost
      ? parseFloat(parseFloat(rawCost).toFixed(2))
      : parseFloat((parsedPrice * 0.7).toFixed(2));

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: formData.name.trim(),
      price: parsedPrice,
      costPrice: parsedCost,
      inStock: formData.inStock,
      onSale: formData.onSale,
      category: formData.category?.trim() || undefined,
      description: formData.description?.trim() || undefined,
    };

    onAddProduct(newProduct);
    setFormData(getInitialFormState(initialDraft));
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

      <div className="form-group">
        <label htmlFor="product-cost-price">Cost Price ($)</label>
        <input
          id="product-cost-price"
          type="text"
          name="costPrice"
          placeholder="e.g. 15.00"
          value={formData.costPrice ?? ''}
          onChange={handleChange}
          className={errors.costPrice ? 'input-error' : ''}
        />
        {errors.costPrice && <p className="error-message">{errors.costPrice}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="product-category">Category</label>
        <input
          id="product-category"
          type="text"
          name="category"
          placeholder="e.g. Accessories"
          value={formData.category ?? ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-description">Description</label>
        <input
          id="product-description"
          type="text"
          name="description"
          placeholder="e.g. Ergonomic wireless mouse..."
          value={formData.description ?? ''}
          onChange={handleChange}
        />
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

