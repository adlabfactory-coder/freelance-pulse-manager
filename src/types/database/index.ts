
// Re-export enums with explicit naming
export { ContactStatus, AppointmentStatus, QuoteStatus } from './enums';

// Use 'export type' to comply with isolatedModules restriction
export type { DatabaseEnums } from './enums';
