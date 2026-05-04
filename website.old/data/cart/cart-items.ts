import type { Product } from "@/types/models";

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export const mockCartItems: CartItem[] = [
  {
    productId: "1",
    product: {
      id: "1",
      title: 'MacBook Pro 13" M2 - Perfect Condition',
      price: 4500,
      images: ["/silver-macbook-on-desk.png"],
      seller: { firstName: "John", lastName: "M" },
      store: { name: "TechDeals GH" },
    } as Product,
    quantity: 1,
    price: 4500,
  },
  {
    productId: "3",
    product: {
      id: "3",
      title: "Wireless Earbuds - Sony WF-1000XM4",
      price: 650,
      images: ["/wireless-earbuds-sony.jpg"],
      seller: { firstName: "Mike", lastName: "J" },
      store: { name: "TechDeals GH" },
    } as Product,
    quantity: 2,
    price: 650,
  },
];

