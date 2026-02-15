import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Customer {
    id: bigint;
    name: string;
    address: string;
    mobile: string;
}
export interface OrderProduct {
    productId: bigint;
    quantity: bigint;
}
export type Time = bigint;
export interface PromoCode {
    id: bigint;
    expiryDate?: Time;
    code: string;
    discountType: {
        __kind__: "flat";
        flat: number;
    } | {
        __kind__: "percentage";
        percentage: number;
    };
    minOrderValue: number;
    isActive: boolean;
}
export interface Category {
    id: bigint;
    name: string;
    description: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    paymentStatus?: string;
    paymentMethod?: string;
    transactionReference?: string;
    orderDate: Time;
    totalAmount: number;
    customerId: bigint;
    isNew: boolean;
    discountedAmount?: number;
    products: Array<OrderProduct>;
    promoCodeId?: bigint;
}
export interface UserProfile {
    name: string;
    address?: string;
    mobile?: string;
}
export interface Product {
    id: bigint;
    categoryId: bigint;
    inStock: boolean;
    healthBenefits: string;
    name: string;
    description: string;
    image: string;
    price: number;
}
export enum OrderStatus {
    pending = "pending",
    completed = "completed",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(name: string, description: string): Promise<bigint>;
    createCustomer(name: string, mobile: string, address: string): Promise<bigint>;
    createProduct(name: string, categoryId: bigint, price: number, description: string, healthBenefits: string, image: string, inStock: boolean): Promise<bigint>;
    createPromoCode(code: string, discountType: {
        __kind__: "flat";
        flat: number;
    } | {
        __kind__: "percentage";
        percentage: number;
    }, minOrderValue: number, expiryDate: Time | null, isActive: boolean): Promise<bigint>;
    deleteCategory(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    deletePromoCode(id: bigint): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllPromoCodes(): Promise<Array<PromoCode>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(id: bigint): Promise<Customer | null>;
    getCustomerByMobile(mobile: string): Promise<Customer | null>;
    getNewOrderCount(): Promise<bigint>;
    getOrdersByCustomer(customerId: bigint): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByCategory(categoryId: bigint): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markOrderAsSeen(orderId: bigint): Promise<void>;
    placeOrder(customerId: bigint, products: Array<OrderProduct>, totalAmount: number, promoCodeId: bigint | null): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: bigint, name: string, description: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(id: bigint, name: string, categoryId: bigint, price: number, description: string, healthBenefits: string, image: string, inStock: boolean): Promise<void>;
    updatePromoCode(id: bigint, code: string, discountType: {
        __kind__: "flat";
        flat: number;
    } | {
        __kind__: "percentage";
        percentage: number;
    }, minOrderValue: number, expiryDate: Time | null, isActive: boolean): Promise<void>;
    validatePromoCode(code: string, orderAmount: number): Promise<PromoCode | null>;
}
