// Export the refactored authentication hooks from the new structure
export { AuthProvider, useAuthContext as useAuth } from './auth/AuthContext';
// We don't re-export useAuthOperations and useLogout here to avoid naming conflicts
// Instead, we keep only the renamed useAuth export for backward compatibility

// This file maintains backward compatibility with the rest of the application
// while we've refactored the authentication logic into smaller, more focused files
