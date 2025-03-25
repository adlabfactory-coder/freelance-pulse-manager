
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2, MessageCircle, Moon, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import { Card as LogoCard } from "@/components/ui/card";

const Login: React.FC = () => {
  // États pour la connexion
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  // États pour l'inscription
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  
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
    
    try {
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
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Veuillez vérifier vos identifiants",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }
    
    setSignupLoading(true);
    
    try {
      // 1. Créer l'utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // 2. Ajouter l'utilisateur à la table users avec le rôle par défaut (client)
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              name: name,
              email: signupEmail,
              role: 'client' // rôle par défaut
            }
          ]);
        
        if (profileError) {
          throw profileError;
        }
        
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Impossible de créer votre compte",
      });
    } finally {
      setSignupLoading(false);
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
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 mx-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardContent>
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
            </CardContent>
          </TabsContent>
          
          <TabsContent value="signup">
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Votre nom" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input 
                    id="signupEmail" 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={signupEmail} 
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Mot de passe</Label>
                  <Input 
                    id="signupPassword" 
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={signupLoading}>
                  {signupLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <p className="text-sm text-center text-muted-foreground">
            Contactez l'administrateur si vous n'avez pas encore vos identifiants de connexion.
          </p>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 w-full text-green-600 hover:text-green-700 border-green-500 hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950" 
            onClick={handleWhatsAppContact}
          >
            <MessageCircle className="h-5 w-5" />
            Contacter l'admin via WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
