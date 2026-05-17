// types/index.ts - Central type definitions for Community Connect App

export type UserRole = 'owner' | 'tenant' | 'security' | 'admin';
export type VisitorStatus = 'pending' | 'approved' | 'rejected' | 'checked-in' | 'checked-out';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PostType = 'announcement' | 'discussion' | 'classified' | 'event' | 'poll';
export type VendorCategory = 'milkman' | 'cook' | 'maid' | 'plumber' | 'electrician' | 'carpenter' | 'other';

// User & Authentication Types
export interface User {
  id: string;
  communityId: string;
  role: UserRole;
  personalInfo: PersonalInfo;
  residenceInfo: ResidenceInfo;
  familyMembers: FamilyMember[];
  vehicles: Vehicle[];
  pets: Pet[];
  emergencyContacts: EmergencyContact[];
  verified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  photoUrl?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  idProof?: {
    type: 'aadhar' | 'pan' | 'passport' | 'license';
    number: string;
    documentUrl: string;
  };
}

export interface ResidenceInfo {
  block: string;
  flatNumber: string;
  floor: number;
  wing?: string;
  moveInDate: Date;
  moveOutDate?: Date;
  ownership: 'owned' | 'rented';
  ownerId?: string; // If tenant, reference to owner
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  photo?: string;
  phone?: string;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bike' | 'scooter' | 'bicycle';
  make: string;
  model: string;
  color: string;
  registrationNumber: string;
  parkingSlot?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  photo?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  address: Address;
  totalFlats: number;
  blocks: string[];
  wings?: string[];
  floors: number;
  amenities: Amenity[];
  rules: string[];
  adminContacts: AdminContact[];
  settings: CommunitySettings;
  createdAt: Date;
}

export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

export interface Amenity {
  id: string;
  name: string;
  type: 'gym' | 'pool' | 'clubhouse' | 'park' | 'playground' | 'other';
  isBookable: boolean;
  bookingCharge?: number;
  operatingHours?: {
    start: string;
    end: string;
  };
  capacity?: number;
}

export interface AdminContact {
  name: string;
  designation: string;
  phone: string;
  email?: string;
}

export interface CommunitySettings {
  visitorApprovalRequired: boolean;
  autoApproveFrequentVisitors: boolean;
  maintenanceDueDay: number;
  lateFeeAmount: number;
  lateFeeGracePeriod: number; // days
  allowTenantPosting: boolean;
  moderateAllPosts: boolean;
}

// Visitor Types
export interface Visitor {
  id: string;
  hostUserId: string;
  hostName: string;
  communityId: string;
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
  vehicleType?: string;
  photoUrl?: string;
  idProof?: string;
  expectedDate: Date;
  entryTime?: Date;
  exitTime?: Date;
  status: VisitorStatus;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalTime?: Date;
  rejectionReason?: string;
  qrCode: string;
  securityNotes?: string;
  isFrequentVisitor: boolean;
  visitCount: number;
  createdAt: Date;
}

export interface VisitorApproval {
  visitorId: string;
  approved: boolean;
  reason?: string;
  approvedBy: string;
  approvalTime: Date;
}

// Vendor Types
export interface Vendor {
  id: string;
  communityId: string;
  name: string;
  category: VendorCategory;
  phone: string;
  alternatePhone?: string;
  photo?: string;
  servingFlats: string[]; // flat IDs
  schedule?: {
    days: string[];
    timeSlot: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: {
    type: string;
    url: string;
  }[];
  ratings: number;
  reviewCount: number;
  reviews: Review[];
  active: boolean;
  notes?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  userName: string;
  communityId: string;
  type: 'maintenance' | 'utility' | 'facility' | 'penalty' | 'other';
  category?: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'bank-transfer' | 'cheque';
  transactionId?: string;
  receiptUrl?: string;
  description: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface MaintenanceBill {
  id: string;
  userId: string;
  communityId: string;
  month: string; // YYYY-MM
  charges: BillCharge[];
  totalAmount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  generatedAt: Date;
}

export interface BillCharge {
  category: string;
  description: string;
  amount: number;
}

export interface UtilityBill {
  id: string;
  userId: string;
  type: 'electricity' | 'water' | 'gas';
  billNumber: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  billUrl?: string;
}

// Community Social Types
export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  type: PostType;
  title: string;
  content: string;
  images: string[];
  attachments?: Attachment[];
  tags?: string[];
  likes: string[]; // user IDs
  comments: Comment[];
  shares: number;
  views: number;
  isPinned: boolean;
  isModerated: boolean;
  moderatedBy?: string;
  eventDate?: Date; // for event type
  eventLocation?: string;
  pollOptions?: PollOption[]; // for poll type
  classifiedPrice?: number; // for classified type
  classifiedCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  likes: string[];
  replies: Comment[];
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
  voteCount: number;
}

export interface Attachment {
  type: 'document' | 'image' | 'video';
  name: string;
  url: string;
  size: number;
}

// Notice Types
export interface Notice {
  id: string;
  communityId: string;
  title: string;
  content: string;
  category: 'announcement' | 'maintenance' | 'event' | 'emergency' | 'meeting' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments: Attachment[];
  expiryDate?: Date;
  targetAudience: string[]; // 'all' | user roles | specific IDs
  readBy: string[]; // user IDs who have read
  createdBy: string;
  createdByName: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Facility Booking Types
export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  userId: string;
  userName: string;
  communityId: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  guestCount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentRequired: boolean;
  paymentAmount?: number;
  paymentStatus?: PaymentStatus;
  approvedBy?: string;
  approvalTime?: Date;
  cancellationReason?: string;
  specialRequests?: string;
  createdAt: Date;
}

// Tenant Management Types
export interface TenantAgreement {
  id: string;
  ownerId: string;
  ownerName: string;
  tenantId: string;
  tenantName: string;
  flatId: string;
  flatNumber: string;
  communityId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  deposit: number;
  maintenanceIncluded: boolean;
  agreementUrl?: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  terminationDate?: Date;
  terminationReason?: string;
  renewalRequested: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Security & Incident Types
export interface Incident {
  id: string;
  communityId: string;
  reportedBy: string;
  reporterName: string;
  type: 'theft' | 'accident' | 'dispute' | 'damage' | 'suspicious' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  dateTime: Date;
  images?: string[];
  involvedParties?: string[];
  witnesses?: string[];
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  actionTaken?: string;
  closedBy?: string;
  closedAt?: Date;
  createdAt: Date;
}

export interface PatrolLog {
  id: string;
  communityId: string;
  guardId: string;
  guardName: string;
  checkpoints: Checkpoint[];
  startTime: Date;
  endTime?: Date;
  status: 'ongoing' | 'completed';
  notes?: string;
  incidents?: string[]; // incident IDs
}

export interface Checkpoint {
  id: string;
  location: string;
  expectedTime: string;
  actualTime?: Date;
  status: 'pending' | 'checked' | 'missed';
  notes?: string;
}

// Parking Types
export interface ParkingSlot {
  id: string;
  communityId: string;
  slotNumber: string;
  type: 'covered' | 'open' | 'basement';
  floor?: number;
  assignedTo?: string; // user ID
  assignedVehicle?: string; // vehicle registration
  isVisitorSlot: boolean;
  isElectricCharging: boolean;
  status: 'occupied' | 'vacant' | 'reserved' | 'maintenance';
  notes?: string;
}

export interface ParkingViolation {
  id: string;
  communityId: string;
  vehicleNumber: string;
  violationType: 'wrong-slot' | 'no-slot' | 'blocking' | 'expired-permit' | 'other';
  location: string;
  photoUrl?: string;
  reportedBy: string;
  dateTime: Date;
  fineAmount?: number;
  status: 'reported' | 'acknowledged' | 'resolved' | 'appealed';
  notes?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  communityId: string;
  type: 'visitor' | 'payment' | 'announcement' | 'booking' | 'emergency' | 'other';
  title: string;
  message: string;
  data?: any; // additional payload
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// Analytics Types
export interface CommunityAnalytics {
  communityId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  metrics: {
    totalResidents: number;
    activeResidents: number;
    visitorsCount: number;
    paymentsCollected: number;
    paymentsOutstanding: number;
    incidentsReported: number;
    facilitiesBooked: number;
    postsCreated: number;
    newRegistrations: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  otp: string;
  communityCode: string;
  agreeTerms: boolean;
}

export interface VisitorForm {
  name: string;
  phone: string;
  purpose: string;
  expectedDate: Date;
  expectedTime: string;
  vehicleNumber?: string;
  vehicleType?: string;
  notes?: string;
}

export interface PaymentForm {
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Verify: { phone: string };
  Home: undefined;
  Visitors: undefined;
  VisitorDetail: { visitorId: string };
  AddVisitor: undefined;
  Community: undefined;
  PostDetail: { postId: string };
  Payments: undefined;
  PaymentDetail: { paymentId: string };
  Profile: undefined;
  Settings: undefined;
  Vendors: undefined;
  VendorDetail: { vendorId: string };
  Notices: undefined;
  NoticeDetail: { noticeId: string };
  Facilities: undefined;
  BookFacility: { facilityId: string };
  TenantManagement: undefined;
  SecurityDashboard: undefined;
};

export type TabParamList = {
  Home: undefined;
  Visitors: undefined;
  Community: undefined;
  Payments: undefined;
  Profile: undefined;
};
