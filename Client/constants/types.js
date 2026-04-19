/** @format */

// USER
export const User = {
  _id: "",
  name: "",
  email: "",
  role: "user", // "user" | "admin"
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  createdAt: "",
};

// PRODUCT
export const Product = {
  _id: "",
  name: "",
  description: "",
  price: 0,
  comparePrice: 0,
  images: [],
  sizes: [],
  category: {
    _id: "",
    name: "",
  }, // OR string in API
  stock: 0,
  ratings: {
    average: 0,
    count: 0,
  },
  isFeatured: false,
  isActive: true,
  createdAt: "",
};

// CART ITEM
export const CartItem = {
  product: Product,
  quantity: 0,
  size: "",
};

// ADDRESS
export const Address = {
  _id: "",
  type: "Home", // Home | Work | Other
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isDefault: false,
  createdAt: "",
};

// ORDER ITEM
export const OrderItem = {
  product: "",
  name: "",
  quantity: 0,
  price: 0,
  image: "",
  size: "",
};

// ORDER
export const Order = {
  _id: "",
  user: "",
  orderNumber: "",
  items: [],
  shippingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  paymentMethod: "",
  paymentStatus: "pending", // pending | paid | failed | refunded
  orderStatus: "placed", // placed | processing | shipped | delivered | cancelled
  subtotal: 0,
  shippingCost: 0,
  tax: 0,
  totalAmount: 0,
  notes: "",
  deliveredAt: "",
  createdAt: "",
};

// WISHLIST CONTEXT SHAPE
export const WishlistContextType = {
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
  loading: false,
};