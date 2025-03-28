
// Export the refactored authentication hooks from the new structure
export { AuthProvider, useAuthContext as useAuth } from './auth/useAuthContext';
export { useAuthOperations } from './auth/useAuthOperations';
export { useLogout } from './auth/useLogout';

// This file maintains backward compatibility with the rest of the application
// while we've refactored the authentication logic into smaller, more focused files
