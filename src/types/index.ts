export type JobStatus = "scheduled" | "en_route" | "in_progress" | "completed" | "cancelled";
export type JobType = "maintenance" | "repair" | "install" | "emergency";
export type JobPriority = "emergency" | "high" | "normal";
export type ContractStatus = "active" | "expiring" | "expired" | "renewed";
export type ContractTier = "basic" | "premium";

export interface Company {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  stripeId?: string;
  ownerAuthId?: string;
  planTier: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan?: string;
  subscriptionStatus?: string;
  createdAt: string;
}

export interface Tech {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email?: string;
  skills: string[];
  vanInventory?: Record<string, number>;
  isActive: boolean;
  lat?: number;
  lng?: number;
  lastSeen?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string;
  lat?: number;
  lng?: number;
  equipment?: Equipment[];
  notes?: string;
  createdAt: string;
}

export interface Equipment {
  type: string;
  brand: string;
  model: string;
  serial?: string;
  installedYear?: number;
}

export interface Job {
  id: string;
  companyId: string;
  customerId: string;
  techId?: string;
  jobType: JobType;
  status: JobStatus;
  priority: JobPriority;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  description?: string;
  techNotes?: string;
  photos: string[];
  partsUsed?: PartUsed[];
  laborMinutes?: number;
  totalAmount?: number;
  invoiceSent: boolean;
  reviewSent: boolean;
  createdAt: string;
  customer?: Customer;
  tech?: Tech;
}

export interface PartUsed {
  partId: string;
  quantity: number;
  unitCost: number;
}

export interface Part {
  id: string;
  companyId: string;
  name: string;
  partNumber?: string;
  supplier?: string;
  unitCost: number;
  sellPrice: number;
  stockQty: number;
  minStock: number;
  createdAt: string;
}

export interface MaintenanceContract {
  id: string;
  companyId: string;
  customerId: string;
  tier: ContractTier;
  price: number;
  startDate: string;
  renewalDate: string;
  status: ContractStatus;
  autoRenew: boolean;
  outreachSent: boolean;
  createdAt: string;
  customer?: Customer;
}

export interface DispatchSuggestion {
  jobId: string;
  techId: string;
  reasoning: string;
  estimatedDriveMinutes: number;
}

export interface QuoteResult {
  equipmentType: string;
  estimatedAge: string;
  likelyIssue: string;
  serviceType: string;
  durationHours: number;
  quoteLow: number;
  quoteHigh: number;
  notes: string;
}

export interface DashboardMetrics {
  todayJobs: number;
  assignedJobs: number;
  unassignedJobs: number;
  revenueThisMonth: number;
  revenueCollected: number;
  revenueOutstanding: number;
  contractsExpiringSoon: number;
  contractsExpiringValue: number;
  techUtilization: TechUtilization[];
  recentActivity: ActivityItem[];
}

export interface TechUtilization {
  techId: string;
  techName: string;
  jobsToday: number;
  hoursWorked: number;
  jobsCompleted: number;
}

export interface ActivityItem {
  id: string;
  type: "job_completed" | "invoice_sent" | "contract_renewed" | "job_created" | "review_sent";
  description: string;
  timestamp: string;
  jobId?: string;
}
