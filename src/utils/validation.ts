import type { ProductFormData, ValidationResult, FormErrors } from '../types';

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
