export enum UserRole {
  USER = 'user',
  ORGANIZER = 'organizer',
  ADMIN = 'admin'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  organizerId: string;
  bannerUrl?: string;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  createdAt: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quantityTotal: number;
  quantitySold: number;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'failed';
  totalAmount: number;
  createdAt: string;
  expiresAt: string;
}

export interface Ticket {
  id: string;
  bookingId: string;
  eventId: string;
  ticketTypeId: string;
  userId: string;
  qrCode: string;
  status: 'valid' | 'used' | 'refunded';
  scannedAt?: string;
  scannedBy?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
