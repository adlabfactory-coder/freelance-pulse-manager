
import { supabase } from "@/lib/supabase-client";
import { UserRole } from "@/types/roles";

interface UserCreationResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors?: Error[];
}

export const initializeTestUsers = async (): Promise<UserCreationResult> => {
  const result: UserCreationResult = {
    success: false,
    successCount: 0,
    errorCount: 0,
    errors: [],
  };
  
  try {
    // Arrays to hold our user creation operations
    const userOperations = [];
    const createdUsers = [];
    
    // Create 20 freelancer accounts
    for (let i = 1; i <= 20; i++) {
      const email = `freelancer${i}.adlabfactory@example.com`;
      const name = `Freelancer${i} AdlabFactory`;
      
      userOperations.push({
        email,
        name,
        role: UserRole.FREELANCER,
      });
    }
    
    // Create 20 account manager accounts
    for (let i = 1; i <= 20; i++) {
      const email = `charge${i}.adlabfactory@example.com`;
      const name = `Charge${i} AdlabFactory`;
      
      userOperations.push({
        email,
        name,
        role: UserRole.ACCOUNT_MANAGER,
      });
    }
    
    // Create 4 admin accounts
    const adminUsers = [
      { name: "Mohamed Talihi", email: "talihi.mohamed@example.com" },
      { name: "Mouad Qarbal", email: "qarbal.mouad@example.com" },
      { name: "Rachid Elouadouni", email: "elouadouni.rachid@example.com" },
      { name: "Aicha Tarif", email: "tarif.aicha@example.com" },
    ];
    
    adminUsers.forEach(admin => {
      userOperations.push({
        ...admin,
        role: UserRole.ADMIN,
      });
    });
    
    // Create 1 super admin account
    userOperations.push({
      email: "bennouna.anis@example.com",
      name: "Anis Bennouna",
      role: UserRole.SUPER_ADMIN,
    });
    
    // Create all the users in the database
    for (const userOp of userOperations) {
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', userOp.email)
          .single();
        
        if (existingUser) {
          // Update existing user
          const { error } = await supabase
            .from('users')
            .update({ name: userOp.name, role: userOp.role })
            .eq('email', userOp.email);
          
          if (!error) {
            result.successCount++;
            createdUsers.push(userOp.email);
          } else {
            console.error(`Error updating user ${userOp.email}:`, error);
            result.errorCount++;
            result.errors?.push(new Error(`Failed to update ${userOp.email}: ${error.message}`));
          }
        } else {
          // Create new user
          const { error } = await supabase
            .from('users')
            .insert([{ 
              email: userOp.email, 
              name: userOp.name, 
              role: userOp.role,
              // Add default values for required fields
              avatar: null
            }]);
          
          if (!error) {
            result.successCount++;
            createdUsers.push(userOp.email);
          } else {
            console.error(`Error creating user ${userOp.email}:`, error);
            result.errorCount++;
            result.errors?.push(new Error(`Failed to create ${userOp.email}: ${error.message}`));
          }
        }
      } catch (error: any) {
        console.error(`Error processing user ${userOp.email}:`, error);
        result.errorCount++;
        result.errors?.push(new Error(`Failed to process ${userOp.email}: ${error.message}`));
      }
    }
    
    result.success = result.errorCount === 0;
    console.log(`Created/updated ${result.successCount} users with ${result.errorCount} errors`);
    return result;
    
  } catch (error: any) {
    console.error("Error in initializeTestUsers:", error);
    result.success = false;
    result.errorCount++;
    result.errors?.push(error);
    return result;
  }
};
