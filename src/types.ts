export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  inStock: boolean;
  onSale: boolean;
  description?: string;
  category?: string;
}

export type PublicProduct = Omit<Product, 'costPrice'>;

export interface ProductFormData {
  name: string;
  price: string;
  costPrice?: string;
  description?: string;
  category?: string;
  inStock: boolean;
  onSale: boolean;
}

export type ProductFormDraft = Partial<ProductFormData>;

export interface FormErrors {
  name?: string;
  price?: string;
  costPrice?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

