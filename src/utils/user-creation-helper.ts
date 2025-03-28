
import { supabase } from '@/lib/supabase-client';
import { UserRole } from '@/types/roles';
import { toast } from 'sonner';

// Fonction pour créer de nombreux utilisateurs en batch
export const createMultipleUsers = async (options: {
  freelancersCount?: number,
  accountManagersCount?: number,
  admins?: Array<{firstName: string, lastName: string}>, 
  superAdmin?: {firstName: string, lastName: string}
}) => {
  const {
    freelancersCount = 0,
    accountManagersCount = 0,
    admins = [],
    superAdmin = null
  } = options;

  const createdUsers = [];
  let successCount = 0;
  let errorCount = 0;

  // Créer les comptes freelancers
  for (let i = 1; i <= freelancersCount; i++) {
    const firstName = `freelancer${i}`;
    const lastName = "adlabfactory";
    const email = `${firstName}.${lastName}@example.com`.toLowerCase();
    const password = "Password123!";  // Pour la démonstration seulement
    
    try {
      const result = await createUser({
        email,
        password,
        name: `${firstName} ${lastName}`,
        role: UserRole.FREELANCER
      });
      
      if (result.success) {
        successCount++;
        createdUsers.push({
          email,
          role: UserRole.FREELANCER,
          id: result.id
        });
      } else {
        errorCount++;
        console.error(`Erreur lors de la création du freelancer ${i}:`, result.error);
      }
    } catch (error) {
      errorCount++;
      console.error(`Exception lors de la création du freelancer ${i}:`, error);
    }
  }

  // Créer les comptes chargés d'affaires
  for (let i = 1; i <= accountManagersCount; i++) {
    const firstName = `charge${i}`;
    const lastName = "adlabfactory";
    const email = `${firstName}.${lastName}@example.com`.toLowerCase();
    const password = "Password123!";  // Pour la démonstration seulement
    
    try {
      const result = await createUser({
        email,
        password,
        name: `${firstName} ${lastName}`,
        role: UserRole.ACCOUNT_MANAGER
      });
      
      if (result.success) {
        successCount++;
        createdUsers.push({
          email,
          role: UserRole.ACCOUNT_MANAGER,
          id: result.id
        });
      } else {
        errorCount++;
        console.error(`Erreur lors de la création du chargé d'affaires ${i}:`, result.error);
      }
    } catch (error) {
      errorCount++;
      console.error(`Exception lors de la création du chargé d'affaires ${i}:`, error);
    }
  }

  // Créer les comptes administrateurs
  for (const admin of admins) {
    const firstName = admin.firstName;
    const lastName = admin.lastName;
    const email = `${firstName}.${lastName}@example.com`.toLowerCase();
    const password = "Password123!";  // Pour la démonstration seulement
    
    try {
      const result = await createUser({
        email,
        password,
        name: `${firstName} ${lastName}`,
        role: UserRole.ADMIN
      });
      
      if (result.success) {
        successCount++;
        createdUsers.push({
          email,
          role: UserRole.ADMIN,
          id: result.id
        });
      } else {
        errorCount++;
        console.error(`Erreur lors de la création de l'administrateur ${firstName} ${lastName}:`, result.error);
      }
    } catch (error) {
      errorCount++;
      console.error(`Exception lors de la création de l'administrateur ${firstName} ${lastName}:`, error);
    }
  }

  // Créer ou modifier le super admin
  if (superAdmin) {
    const firstName = superAdmin.firstName;
    const lastName = superAdmin.lastName;
    const email = `${firstName}.${lastName}@example.com`.toLowerCase();
    const password = "SuperAdmin123!";  // Pour la démonstration seulement
    
    try {
      // D'abord, vérifier s'il existe déjà un super admin
      const { data: existingSuperAdmins } = await supabase
        .from('users')
        .select('id, email')
        .eq('role', UserRole.SUPER_ADMIN)
        .limit(1);
      
      let result;
      if (existingSuperAdmins && existingSuperAdmins.length > 0) {
        // Mettre à jour le super admin existant
        const superAdminId = existingSuperAdmins[0].id;
        result = await updateUser({
          id: superAdminId,
          email,
          name: `${firstName} ${lastName}`,
          role: UserRole.SUPER_ADMIN
        });
      } else {
        // Créer un nouveau super admin
        result = await createUser({
          email,
          password,
          name: `${firstName} ${lastName}`,
          role: UserRole.SUPER_ADMIN
        });
      }
      
      if (result.success) {
        successCount++;
        createdUsers.push({
          email,
          role: UserRole.SUPER_ADMIN,
          id: result.id
        });
      } else {
        errorCount++;
        console.error(`Erreur lors de la gestion du super admin ${firstName} ${lastName}:`, result.error);
      }
    } catch (error) {
      errorCount++;
      console.error(`Exception lors de la gestion du super admin ${firstName} ${lastName}:`, error);
    }
  }

  // Retourner le résumé des opérations
  return {
    success: errorCount === 0,
    successCount,
    errorCount,
    createdUsers
  };
};

// Fonction utilitaire pour créer un utilisateur
const createUser = async ({ email, password, name, role }: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<{
  success: boolean;
  error?: string;
  id?: string;
}> => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return {
        success: false,
        error: `Un utilisateur avec l'email ${email} existe déjà`
      };
    }

    // Créer l'utilisateur dans auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (authError) {
      return {
        success: false,
        error: authError.message
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Pas d'utilisateur créé"
      };
    }

    // Si tout est ok, attendons un peu que le trigger crée l'utilisateur dans la table users
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier si l'utilisateur a bien été créé dans la table users
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (userError || !newUser || newUser.length === 0) {
      // L'utilisateur n'existe pas dans la table users, créons-le manuellement
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
          role
        })
        .select('id')
        .single();

      if (insertError) {
        return {
          success: false,
          error: insertError.message
        };
      }

      return {
        success: true,
        id: insertedUser?.id
      };
    }

    return {
      success: true,
      id: newUser[0].id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erreur inconnue lors de la création de l'utilisateur"
    };
  }
};

// Fonction utilitaire pour mettre à jour un utilisateur
const updateUser = async ({ id, email, name, role }: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}): Promise<{
  success: boolean;
  error?: string;
  id?: string;
}> => {
  try {
    // Mettre à jour l'utilisateur dans la table users
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name,
        email,
        role
      })
      .eq('id', id);

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    // Mettre à jour les métadonnées dans auth.users si possible
    // Cela dépend si la fonction handle_user_update est correctement configurée
    
    return {
      success: true,
      id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erreur inconnue lors de la mise à jour de l'utilisateur"
    };
  }
};

// Fonction pour lancer la création d'utilisateurs de test
export const initializeTestUsers = async () => {
  const admins = [
    { firstName: 'Talihi', lastName: 'Mohamed' },
    { firstName: 'Qarbal', lastName: 'Mouad' },
    { firstName: 'Rachid', lastName: 'Elouadouni' },
    { firstName: 'Aicha', lastName: 'Tarif' },
  ];
  
  const superAdmin = { firstName: 'BENNOUNA', lastName: 'ANIS' };
  
  const result = await createMultipleUsers({
    freelancersCount: 20,
    accountManagersCount: 20,
    admins,
    superAdmin
  });
  
  return result;
};
