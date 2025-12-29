export interface CheckoutCartItem {
  productId: string;
  title: string;
  image: string;
  seller: string;
  price: number;
  quantity: number;
}

export const mockCheckoutCartItems: CheckoutCartItem[] = [
  {
    productId: "1",
    title: 'MacBook Pro 13" M2',
    image: "/silver-macbook-on-desk.png",
    seller: "TechDeals GH",
    price: 4500,
    quantity: 1,
  },
  {
    productId: "3",
    title: "Wireless Earbuds - Sony",
    image: "/wireless-earbuds-sony.jpg",
    seller: "TechDeals GH",
    price: 650,
    quantity: 2,
  },
];

export const savedAddresses = [
  {
    id: "1",
    label: "Hostel",
    street: "Room 215, Unity Hall",
    city: "University of Ghana",
    isDefault: true,
  },
  {
    id: "2",
    label: "Off Campus",
    street: "25 Legon Hills",
    city: "Accra, Ghana",
    isDefault: false,
  },
];

export const paymentMethods = [
  { id: "momo", name: "Mobile Money", description: "MTN, Vodafone, AirtelTigo" },
  { id: "card", name: "Card Payment", description: "Visa, Mastercard" },
  { id: "wallet", name: "VarsityMart Wallet", description: "Balance: GH₵500.00" },
];

