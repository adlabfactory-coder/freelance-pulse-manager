
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, UserRole } from "@/types";
import { toast } from "sonner";

/**
 * Hook to manage the session state and authentication events
 */
export const useSession = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  // Effect to check authentication status and subscribe to auth changes
  useEffect(() => {
    // Define safety timeout to prevent infinite logout issues
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Production mode
        const DEMO_MODE = false;
        
        if (!DEMO_MODE) {
          // Get current session
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Error retrieving session:", sessionError);
            setUser(null);
            setError(sessionError.message);
            return;
          }
          
          const session = sessionData?.session;
          
          if (session && session.user) {
            // Get additional user details from users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, name, email, role, avatar')
              .eq('id', session.user.id)
              .single();
              
            if (userError || !userData) {
              console.error("Error retrieving user details:", userError);
              setUser(null);
            } else {
              setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role as UserRole,
                avatar: userData.avatar
              });
            }
          } else {
            setUser(null);
            console.log("No active session found");
          }
        } else {
          // Demo mode (using localStorage)
          const storedUser = localStorage.getItem('currentUser');
          
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log("User found in localStorage:", parsedUser.name);
          } else {
            setUser(null);
            console.log("No user found in localStorage");
          }
        }
      } catch (err: any) {
        console.error("Error checking authentication:", err);
        setUser(null);
        setError("Error checking authentication: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event detected:", event);
        
        if (event === 'SIGNED_IN' && session) {
          // Clear timeout if user reconnects
          if (timeoutId) clearTimeout(timeoutId);
          
          // Update user details with a delayed async operation
          setTimeout(async () => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, name, email, role, avatar')
                .eq('id', session.user.id)
                .single();
                
              if (!userError && userData) {
                setUser({
                  id: userData.id,
                  name: userData.name,
                  email: userData.email,
                  role: userData.role as UserRole,
                  avatar: userData.avatar
                });
              }
            } catch (err) {
              console.error("Error retrieving user details:", err);
            }
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          // Delay before complete logout to prevent infinite loops
          timeoutId = setTimeout(() => {
            setUser(null);
          }, 200);
        }
      }
    );
    
    // Clean up listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [setUser, setIsLoading, setError]);
};
