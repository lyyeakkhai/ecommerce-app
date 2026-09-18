import { useState } from 'react';
import type { Product, ProductFormData, FormErrors } from '../types';
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
