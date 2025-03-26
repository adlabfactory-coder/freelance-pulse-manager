
import { User, UserRole } from "@/types";

// Fonction pour récupérer les utilisateurs de démo
export const getMockUsers = (): User[] => {
  return [
    {
      id: "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc",
      name: "Admin Démo",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      avatar: null,
      calendly_enabled: true,
      calendly_url: "https://calendly.com/admin-demo",
      calendly_sync_email: "admin@example.com"
    },
    {
      id: "487fb1af-4396-49d1-ba36-8711facbb03c",
      name: "Commercial Démo",
      email: "commercial@example.com",
      role: UserRole.FREELANCER,
      avatar: null,
      calendly_enabled: true,
      calendly_url: "https://calendly.com/commercial-demo",
      calendly_sync_email: "commercial@example.com"
    },
    {
      id: "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda",
      name: "Client Démo",
      email: "client@example.com",
      role: UserRole.CLIENT,
      avatar: null,
      calendly_enabled: false,
      calendly_url: "",
      calendly_sync_email: ""
    },
    {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      name: "John Doe",
      email: "john@example.com",
      role: UserRole.FREELANCER,
      avatar: null,
      calendly_enabled: false,
      calendly_url: null,
      calendly_sync_email: null
    },
    {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0852",
      name: "Jane Smith",
      email: "jane@example.com",
      role: UserRole.FREELANCER,
      avatar: null,
      calendly_enabled: false,
      calendly_url: null,
      calendly_sync_email: null
    },
    {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0853",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: UserRole.FREELANCER,
      avatar: null,
      calendly_enabled: false,
      calendly_url: null,
      calendly_sync_email: null
    },
    {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0854",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: UserRole.FREELANCER,
      avatar: null,
      calendly_enabled: false,
      calendly_url: null,
      calendly_sync_email: null
    }
  ];
};

// Fonction pour récupérer un utilisateur de démo par son ID
export const getMockUserById = (userId: string): User | null => {
  // Gérer d'abord les anciens IDs numériques en les convertissant
  // vers les nouveaux IDs UUID de démonstration
  if (userId === "1") {
    userId = "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc"; // Admin
  } else if (userId === "2") {
    userId = "487fb1af-4396-49d1-ba36-8711facbb03c"; // Commercial
  } else if (userId === "3") {
    userId = "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda"; // Client
  }
  
  // Puis chercher l'utilisateur dans les données mockées
  const users = getMockUsers();
  const user = users.find(u => u.id === userId);
  return user || null;
};
