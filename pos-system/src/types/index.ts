export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
} 