export enum PartyStatus {
  RECRUITING = 'RECRUITING', // 모집중
  ACTIVE = 'ACTIVE',         // 진행중
  FULL = 'FULL',             // 인원마감
  ENDED = 'ENDED'            // 종료
}

export enum ServiceType {
  NETFLIX = 'Netflix',
  WAVE = 'Wavve',
  WATCHA = 'Watcha',
  DISNEY = 'Disney+',
  SPOTIFY = 'Spotify',
  YOUTUBE = 'Youtube Premium'
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  nickname: string;
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: UserRole;
}

export interface Party {
  id: string;
  serviceName: ServiceType;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  pricePerMonth: number;
  maxMembers: number;
  currentMembers: number;
  status: PartyStatus;
  startDate: string;
  nextBillingDate: string;
  category: 'Video' | 'Music' | 'Productivity';
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface SubscriptionProduct {
  id: string;
  name: string;
  tier: string;
  price: number;
  maxProfiles: number;
  iconUrl: string;
  description: string;
  category: string;
  billingCycle: 'Monthly' | 'Yearly';
  status: ProductStatus;
}

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED';

export interface UserSubscription {
  id: string;
  userId: string;
  productId: string;
  product: SubscriptionProduct; // Snapshot or reference
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}