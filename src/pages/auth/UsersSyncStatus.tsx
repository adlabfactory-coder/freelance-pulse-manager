
import React, { useState } from "react";
import { useUsersSync } from "@/hooks/use-users-sync";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const UsersSyncStatus: React.FC = () => {
  const { syncStatus, summary, loading, refreshStatus } = useUsersSync();
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">État de synchronisation des utilisateurs</CardTitle>
              <CardDescription>
                Vérifiez l'état de synchronisation entre la table users et auth.users
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <Link to="/auth/login">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Vérification en cours...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{summary.total}</p>
                        <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{summary.synced}</p>
                        <p className="text-sm text-muted-foreground">Utilisateurs synchronisés</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">{summary.notSynced}</p>
                        <p className="text-sm text-muted-foreground">Utilisateurs non synchronisés</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-md">
                  <div className="grid grid-cols-3 bg-muted px-4 py-2 rounded-t-md">
                    <div className="font-medium">Email</div>
                    <div className="font-medium">Statut</div>
                    <div className="font-medium">Détails</div>
                  </div>
                  
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {syncStatus.map((status, index) => (
                      <div key={index} className="grid grid-cols-3 px-4 py-3">
                        <div className="text-sm truncate">{status.email}</div>
                        <div>
                          {status.synced ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Synchronisé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <XCircle className="mr-1 h-3 w-3" /> Non synchronisé
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {status.error && (
                            <span className="text-red-500">{status.error}</span>
                          )}
                          {!status.error && status.inAuth && "Présent dans auth.users"}
                          {!status.error && !status.inAuth && "Absent de auth.users"}
                        </div>
                      </div>
                    ))}
                    
                    {syncStatus.length === 0 && (
                      <div className="px-4 py-3 text-center text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/auth/login">
              Retour
            </Link>
          </Button>
          
          <Button 
            variant="default"
            onClick={() => refreshStatus()}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Actualisation...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UsersSyncStatus;
