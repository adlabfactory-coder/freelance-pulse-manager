
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, FileText, UserCog, Trash, Calendar, FileSpreadsheet, BookOpen } from "lucide-react";
import ContactInfoDisplay from "./ContactInfoDisplay";
import ContactAppointmentDialog from "./ContactAppointmentDialog";
import { Contact } from "@/services/contacts/types";
import ContactEditForm from "./ContactEditForm";
import { formatDateToFrench } from "@/utils/format";
import AddQuoteDialog from "@/components/quotes/AddQuoteDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { contactService } from "@/services/contact-service";
import { useNavigate } from "react-router-dom";
import { Quote, QuoteStatus, getQuoteStatusLabel } from "@/types/quote";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { Subscription, SubscriptionStatus } from "@/types/subscription";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactDetailProps {
  contact: Contact;
  onUpdate: (updatedContact: Contact) => void;
  quotes: Quote[];
  appointments: Appointment[];
  subscriptions: Subscription[];
  interactionsLoading: boolean;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ 
  contact, 
  onUpdate, 
  quotes,
  appointments,
  subscriptions,
  interactionsLoading
}) => {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { isAdmin, isAdminOrSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDeleteContact = async () => {
    if (!contact.id) return;
    
    setIsDeleting(true);
    try {
      const success = await contactService.deleteContact(contact.id);
      
      if (success) {
        toast({
          title: "Contact supprimé",
          description: "Le contact a été supprimé avec succès.",
        });
        navigate("/contacts");
      } else {
        throw new Error("Impossible de supprimer le contact");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du contact."
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getStatusBadgeColor = (status: QuoteStatus | AppointmentStatus | SubscriptionStatus) => {
    const statusColors: Record<string, string> = {
      // Devis
      draft: "bg-gray-200 text-gray-800",
      pending: "bg-yellow-200 text-yellow-800",
      sent: "bg-blue-200 text-blue-800",
      accepted: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800",
      expired: "bg-gray-200 text-gray-800",
      paid: "bg-green-200 text-green-800",
      cancelled: "bg-red-200 text-red-800",
      
      // Rendez-vous
      scheduled: "bg-blue-200 text-blue-800",
      confirmed: "bg-green-200 text-green-800",
      completed: "bg-green-200 text-green-800",
      no_show: "bg-red-200 text-red-800",
      
      // Abonnements
      active: "bg-green-200 text-green-800",
      inactive: "bg-gray-200 text-gray-800",
      trial: "bg-purple-200 text-purple-800",
    };
    
    return statusColors[status] || "bg-gray-200 text-gray-800";
  };

  const getAppointmentStatusLabel = (status: AppointmentStatus): string => {
    const statusLabels: Record<AppointmentStatus, string> = {
      scheduled: "Planifié",
      pending: "En attente",
      confirmed: "Confirmé",
      completed: "Terminé",
      cancelled: "Annulé",
      no_show: "Absence"
    };
    
    return statusLabels[status] || "Inconnu";
  };

  const getSubscriptionStatusLabel = (status: SubscriptionStatus): string => {
    const statusLabels: Record<SubscriptionStatus, string> = {
      active: "Actif",
      cancelled: "Annulé",
      pending: "En attente",
      expired: "Expiré",
      inactive: "Inactif",
      trial: "Essai"
    };
    
    return statusLabels[status] || "Inconnu";
  };

  const handleQuoteClick = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  const handleAppointmentClick = (appointmentId: string) => {
    navigate(`/appointments?highlight=${appointmentId}`);
  };
  
  const handleSubscriptionClick = (subscriptionId: string) => {
    navigate(`/subscriptions?highlight=${subscriptionId}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec les informations principales */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{contact.name}</h1>
          <p className="text-muted-foreground">
            Client créé le {formatDateToFrench(new Date(contact.createdAt))}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <UserCog className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          
          {isAdminOrSuperAdmin && (
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <Card>
        <CardContent className="pt-6">
          <ContactInfoDisplay contact={contact} />
        </CardContent>
      </Card>

      {/* Interactions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="appointments" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Rendez-vous ({appointments.length})
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Devis ({quotes.length})
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Abonnements ({subscriptions.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Rendez-vous */}
            <TabsContent value="appointments">
              {interactionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : appointments.length > 0 ? (
                <div className="rounded-md border">
                  <div className="divide-y">
                    {appointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleAppointmentClick(appointment.id)}
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">{appointment.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateToFrench(new Date(appointment.date))}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(appointment.status as AppointmentStatus)}>
                          {getAppointmentStatusLabel(appointment.status as AppointmentStatus)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun rendez-vous trouvé
                </div>
              )}
            </TabsContent>
            
            {/* Devis */}
            <TabsContent value="quotes">
              {interactionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : quotes.length > 0 ? (
                <div className="rounded-md border">
                  <div className="divide-y">
                    {quotes.map((quote) => (
                      <div 
                        key={quote.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleQuoteClick(quote.id)}
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">Devis #{quote.id.substring(0, 8)}</div>
                          <div className="text-sm text-muted-foreground">
                            {quote.createdAt ? formatDateToFrench(new Date(quote.createdAt)) : 'Date inconnue'} - {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quote.totalAmount)}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(quote.status as QuoteStatus)}>
                          {getQuoteStatusLabel(quote.status as QuoteStatus)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun devis trouvé
                </div>
              )}
            </TabsContent>
            
            {/* Abonnements */}
            <TabsContent value="subscriptions">
              {interactionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : subscriptions.length > 0 ? (
                <div className="rounded-md border">
                  <div className="divide-y">
                    {subscriptions.map((subscription) => (
                      <div 
                        key={subscription.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleSubscriptionClick(subscription.id)}
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">{subscription.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateToFrench(new Date(subscription.startDate))} - {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(subscription.price)}
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(subscription.status as SubscriptionStatus)}>
                          {getSubscriptionStatusLabel(subscription.status as SubscriptionStatus)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun abonnement trouvé
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={() => setAppointmentDialogOpen(true)}
        >
          <CalendarClock className="h-4 w-4 mr-2" />
          Planifier un rendez-vous
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setQuoteDialogOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Créer un devis
        </Button>
      </div>

      {/* Dialogues */}
      <ContactAppointmentDialog 
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        contactId={contact.id}
        contactName={contact.name}
      />
      
      {editDialogOpen && (
        <ContactEditForm 
          contact={contact}
          onSuccess={() => {
            setEditDialogOpen(false);
            onUpdate(contact);
          }}
          onCancel={() => setEditDialogOpen(false)}
        />
      )}
      
      <AddQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        initialContactId={contact.id}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contact ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce contact (rendez-vous, devis) seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContact}
              disabled={isDeleting} 
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactDetail;
