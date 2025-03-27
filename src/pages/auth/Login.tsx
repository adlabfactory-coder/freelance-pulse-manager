
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

// Define form schema
const formSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().optional().default(false)
});

type FormData = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // État pour stocker la page d'origine
  const from = location.state?.from?.pathname || "/dashboard";

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    },
  });

  // Mock login data for demo purposes
  const mockData = [
    { role: "admin", email: "admin@example.com", password: "password" },
    { role: "freelancer", email: "freelancer@example.com", password: "password" },
    { role: "client", email: "client@example.com", password: "password" },
    { role: "super_admin", email: "superadmin@example.com", password: "password" },
  ];

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Configurer les options de persistance en fonction de "Se souvenir de moi"
      if (data.rememberMe) {
        localStorage.setItem('auth_persistence', 'true');
      } else {
        localStorage.removeItem('auth_persistence');
      }

      // Call the signIn function from auth context
      const result = await signIn(data.email, data.password);
      
      if (result.success) {
        toast.success("Connexion réussie");
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Identifiants invalides");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to autofill form with mock data
  const autofillForm = (role: string) => {
    const mockUser = mockData.find((u) => u.role === role);
    if (mockUser) {
      form.setValue("email", mockUser.email);
      form.setValue("password", mockUser.password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à AdLab Hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Votre mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Rester connecté
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground mb-2">
            Pour la démonstration, vous pouvez vous connecter avec :
          </div>
          <div className="grid grid-cols-2 gap-2 w-full mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => autofillForm("admin")}
            >
              Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => autofillForm("freelancer")}
            >
              Freelancer
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => autofillForm("super_admin")}
            >
              Super Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => autofillForm("client")}
            >
              Client
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
