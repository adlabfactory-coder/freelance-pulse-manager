
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, MessageCircle, Moon, Sun, Key, AlertCircle } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Card as LogoCard } from "@/components/ui/card";
import { mockSignIn } from "@/utils/supabase-mock-data";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true); // Utilisation du mode démo par défaut
  
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
      setCheckingSession(false);
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/dashboard");
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      if (demoMode) {
        // Utilisation de l'authentification simulée en mode démo
        const { user, error } = mockSignIn(email, password);
        
        if (error) {
          setErrorMessage(error);
          return;
        }
        
        if (user) {
          // Simulation de la connexion réussie en mode démo
          toast({
            title: "Connexion réussie (Mode Démo)",
            description: `Connecté en tant que ${user.name} (${user.role})`,
          });
          
          localStorage.setItem('demoUser', JSON.stringify(user));
          navigate("/dashboard");
        }
      } else {
        // Authentification réelle avec Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      setErrorMessage(error.message || "Veuillez vérifier vos identifiants");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/212663529031`, '_blank');
  };

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="absolute right-4 top-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <LogoCard className="w-16 h-16 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl shadow">
              AH
            </LogoCard>
          </div>
          <CardTitle className="text-2xl font-bold text-center">AdLab Hub</CardTitle>
          <CardDescription className="text-center">
            Gérez vos prospects et suivez vos commissions
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="votre@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
          
          <div className="mt-4">
            <p className="text-sm text-center text-muted-foreground">
              Comptes de démonstration:
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 border rounded">
                <p className="font-semibold">Admin</p>
                <p>admin@example.com</p>
                <p>Mot de passe: 123456</p>
              </div>
              <div className="p-2 border rounded">
                <p className="font-semibold">Freelancer</p>
                <p>commercial@example.com</p>
                <p>Mot de passe: 123456</p>
              </div>
              <div className="p-2 border rounded">
                <p className="font-semibold">Client</p>
                <p>client@example.com</p>
                <p>Mot de passe: 123456</p>
              </div>
              <div className="p-2 border rounded">
                <p className="font-semibold">Chargé d'affaires</p>
                <p>freelance@example.com</p>
                <p>Mot de passe: 123456</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <p className="text-sm text-center text-muted-foreground">
            Contactez l'administrateur pour obtenir vos identifiants de connexion.
          </p>
          <div className="flex flex-col gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 w-full text-green-600 hover:text-green-700 border-green-500 hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950" 
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="h-5 w-5" />
              Contacter l'admin via WhatsApp
            </Button>
            <Link to="/auth/reset-demo-passwords">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 w-full text-blue-600 hover:text-blue-700 border-blue-500 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Key className="h-5 w-5" />
                Réinitialiser les mots de passe démo
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
