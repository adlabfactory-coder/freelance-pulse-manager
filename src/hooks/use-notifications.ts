
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Quote, QuoteStatus } from "@/types";

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "appointment" | "quote";
  read: boolean;
  linkTo?: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fonction pour marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    
    // Recalculer le nombre de notifications non lues
    updateUnreadCount();
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Mettre à jour le compteur de notifications non lues
  const updateUnreadCount = () => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  // Charger les rendez-vous de la journée
  const loadTodaysAppointments = async () => {
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', `${formattedDate}T00:00:00`)
        .lte('date', `${formattedDate}T23:59:59`);
      
      if (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
        return [];
      }
      
      return data.map((appointment) => ({
        id: `appointment-${appointment.id}`,
        title: "Rendez-vous aujourd'hui",
        description: `${appointment.title} à ${format(new Date(appointment.date), 'HH:mm', { locale: fr })}`,
        date: new Date(appointment.date),
        type: "appointment" as const,
        read: false,
        linkTo: "/appointments"
      }));
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return [];
    }
  };

  // Charger les devis en attente de validation
  const loadPendingQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          contact:contacts(name)
        `)
        .eq('status', 'sent');
      
      if (error) {
        console.error("Erreur lors du chargement des devis:", error);
        return [];
      }
      
      return data.map((quote) => ({
        id: `quote-${quote.id}`,
        title: "Devis en attente",
        description: `Devis pour ${quote.contact?.name || 'Client'} - ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quote.totalAmount)}`,
        date: new Date(quote.updatedAt),
        type: "quote" as const,
        read: false,
        linkTo: "/quotes"
      }));
    } catch (error) {
      console.error("Erreur inattendue:", error);
      return [];
    }
  };

  // Charger toutes les notifications
  const loadNotifications = async () => {
    setLoading(true);
    
    try {
      const [appointments, quotes] = await Promise.all([
        loadTodaysAppointments(),
        loadPendingQuotes()
      ]);
      
      // Combiner et trier par date (plus récent en premier)
      const allNotifications = [...appointments, ...quotes].sort((a, b) => 
        b.date.getTime() - a.date.getTime()
      );
      
      setNotifications(allNotifications);
      updateUnreadCount();
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: loadNotifications
  };
};
