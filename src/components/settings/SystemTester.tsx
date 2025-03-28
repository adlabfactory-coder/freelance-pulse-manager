
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Shield, LayoutDashboard, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type TestGroup = {
  name: string;
  tests: {
    name: string;
    status: "idle" | "running" | "success" | "failed";
    error?: string;
  }[];
  icon: React.ReactNode;
};

const SystemTester: React.FC = () => {
  const [groups, setGroups] = useState<TestGroup[]>([
    {
      name: "Authentification",
      icon: <Shield className="h-4 w-4 text-primary" />,
      tests: [
        { name: "Connexion Super Admin", status: "idle" },
        { name: "Connexion Admin", status: "idle" },
        { name: "Connexion Chargé d'affaires", status: "idle" },
        { name: "Connexion Freelancer", status: "idle" }
      ]
    },
    {
      name: "Navigation",
      icon: <LayoutDashboard className="h-4 w-4 text-primary" />,
      tests: [
        { name: "Accès tableau de bord", status: "idle" },
        { name: "Accès paramètres", status: "idle" },
        { name: "Accès abonnements", status: "idle" },
        { name: "Accès rapports", status: "idle" }
      ]
    },
    {
      name: "Gestion utilisateurs",
      icon: <Users className="h-4 w-4 text-primary" />,
      tests: [
        { name: "Création compte", status: "idle" },
        { name: "Modification compte", status: "idle" },
        { name: "Suppression compte", status: "idle" }
      ]
    }
  ]);

  const [isTesting, setIsTesting] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number | null>(null);
  const [currentTestIndex, setCurrentTestIndex] = useState<number | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  const getTotalTests = () => {
    return groups.reduce((sum, group) => sum + group.tests.length, 0);
  };

  const getCompletedTests = () => {
    return groups.reduce((sum, group) => {
      return sum + group.tests.filter(t => t.status === "success" || t.status === "failed").length;
    }, 0);
  };

  const runTest = async (groupIndex: number, testIndex: number) => {
    // Update status to running
    setGroups(prev => {
      const newGroups = [...prev];
      newGroups[groupIndex].tests[testIndex].status = "running";
      return newGroups;
    });

    // Simulate API test - in real application, this would make actual API calls
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Randomly succeed (80% chance) or fail (20% chance) for demonstration
      const success = Math.random() > 0.2;
      
      // Update status based on test result
      setGroups(prev => {
        const newGroups = [...prev];
        newGroups[groupIndex].tests[testIndex].status = success ? "success" : "failed";
        if (!success) {
          newGroups[groupIndex].tests[testIndex].error = "Erreur simulée pour démonstration";
        }
        return newGroups;
      });
      
      // Update progress
      const totalTests = getTotalTests();
      const completedTests = getCompletedTests() + 1; // +1 for the current test
      setOverallProgress(Math.round((completedTests / totalTests) * 100));
      
    } catch (error) {
      setGroups(prev => {
        const newGroups = [...prev];
        newGroups[groupIndex].tests[testIndex].status = "failed";
        newGroups[groupIndex].tests[testIndex].error = "Erreur inattendue lors du test";
        return newGroups;
      });
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setOverallProgress(0);
    
    // Reset all tests to idle
    setGroups(prev => {
      return prev.map(group => ({
        ...group,
        tests: group.tests.map(test => ({ ...test, status: "idle", error: undefined }))
      }));
    });

    // Run all tests sequentially
    for (let g = 0; g < groups.length; g++) {
      setCurrentGroupIndex(g);
      for (let t = 0; t < groups[g].tests.length; t++) {
        setCurrentTestIndex(t);
        await runTest(g, t);
      }
    }
    
    setIsTesting(false);
    setCurrentGroupIndex(null);
    setCurrentTestIndex(null);
    
    toast.success("Tous les tests ont été effectués");
  };

  const getGroupStatus = (group: TestGroup) => {
    const hasRunningTest = group.tests.some(t => t.status === "running");
    const allSuccessful = group.tests.every(t => t.status === "success");
    const hasFailed = group.tests.some(t => t.status === "failed");
    
    if (hasRunningTest) return "running";
    if (allSuccessful) return "success";
    if (hasFailed) return "failed";
    return "idle";
  };
  
  const getStatusIcon = (status: "idle" | "running" | "success" | "failed") => {
    switch (status) {
      case "running": return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test du système</CardTitle>
        <CardDescription>
          Exécutez des tests automatiques pour vérifier le bon fonctionnement du système
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50">
          <AlertDescription>
            Ces tests permettent de vérifier automatiquement l'ensemble des fonctionnalités critiques de l'application.
          </AlertDescription>
        </Alert>
        
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progression des tests</span>
            <span>{getCompletedTests()} / {getTotalTests()} tests</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
        
        {/* Test groups */}
        <div className="space-y-4 mt-4">
          {groups.map((group, groupIndex) => {
            const groupStatus = getGroupStatus(group);
            return (
              <div 
                key={group.name}
                className={`border rounded-md overflow-hidden ${
                  currentGroupIndex === groupIndex ? "ring-1 ring-primary" : ""
                }`}
              >
                <div className="bg-card p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {group.icon}
                    <h3 className="font-medium">{group.name}</h3>
                    {groupStatus !== "idle" && (
                      <Badge 
                        variant={
                          groupStatus === "success" ? "outline" : 
                          groupStatus === "failed" ? "destructive" : 
                          "secondary"
                        }
                        className="ml-2"
                      >
                        {groupStatus === "running" ? "En cours" : 
                         groupStatus === "success" ? "Succès" : 
                         "Échec"}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  {group.tests.map((test, testIndex) => (
                    <div 
                      key={test.name}
                      className={`px-3 py-2 flex items-center justify-between ${
                        currentGroupIndex === groupIndex && currentTestIndex === testIndex 
                        ? "bg-muted" 
                        : ""
                      }`}
                    >
                      <span>{test.name}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between">
          <Button 
            onClick={runAllTests} 
            disabled={isTesting}
            variant="default"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exécution des tests...
              </>
            ) : (
              "Exécuter tous les tests"
            )}
          </Button>
          
          <Button 
            variant="outline"
            disabled={isTesting}
            onClick={() => {
              setGroups(prev => {
                return prev.map(group => ({
                  ...group,
                  tests: group.tests.map(test => ({ ...test, status: "idle", error: undefined }))
                }));
              });
              setOverallProgress(0);
              toast.info("Tests réinitialisés");
            }}
          >
            Réinitialiser
          </Button>
        </div>
        
        {/* Test results summary */}
        {getCompletedTests() > 0 && (
          <div className="pt-4 border-t mt-4">
            <h3 className="text-sm font-medium mb-2">Résumé des tests</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold mb-1">
                  {groups.reduce((sum, group) => sum + group.tests.filter(t => t.status === "success").length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Tests réussis</div>
              </div>
              
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold mb-1 text-red-600">
                  {groups.reduce((sum, group) => sum + group.tests.filter(t => t.status === "failed").length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Tests échoués</div>
              </div>
              
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold mb-1 text-amber-600">
                  {getTotalTests() - getCompletedTests()}
                </div>
                <div className="text-xs text-muted-foreground">Tests restants</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemTester;
