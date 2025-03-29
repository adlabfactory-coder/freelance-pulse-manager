
// Re-export de tous les types

// User and auth exports
export type { User, UserProfile, UserAuthData } from './user';
export { UserRole } from './roles';

// Export types using explicit export type syntax for isolatedModules compatibility
export type { DatabaseEnums } from './database';

// Re-export status enums with explicit names to avoid ambiguity
export { AppointmentStatus as AppointmentStatusEnum } from './appointment';
export type { Appointment } from './appointment';

export { QuoteStatus as QuoteStatusEnum } from './quote';
export type { Quote, QuoteItem } from './quote';

export * from './contacts';
export * from './service';
export * from './subscription';
export * from './layout'; // Add layout types
