
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { Check, Trash2, Plus } from "lucide-react";
import { QuoteItem, QuoteStatus, User } from "@/types";
import { Contact } from "@/services/contacts/types";
import { createQuote } from "@/services/quote-service";
import { fetchServices, Service } from "@/services/services-service";
import { fetchUsers } from "@/services/supabase-user-service";
import { contactService } from "@/services/contacts";
import { addDays } from "date-fns";
import { formatCurrency } from "@/utils/format";

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteCreated: () => void;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteCreated,
}) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [quoteData, setQuoteData] = useState<Partial<Quote>>({
    status: QuoteStatus.DRAFT,
    validUntil: addDays(new Date(), 30),
    totalAmount: 0,
    items: []
  });

  const [currentItem, setCurrentItem] = useState<Partial<QuoteItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 0
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [contactsData, usersData, servicesData] = await Promise.all([
          contactService.getContacts(),
          fetchUsers(),
          fetchServices()
        ]);
        
        setContacts(contactsData || []);
        setFreelancers(usersData.filter(user => user.role === 'freelancer' || user.role === 'admin') || []);
        setServices(servicesData || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les données nécessaires.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadData();
    }
  }, [open, toast]);

  useEffect(() => {
    if (quoteData.items) {
      const total = quoteData.items.reduce((sum, item) => {
        const quantity = item.quantity || 0;
        const unitPrice = item.unitPrice || 0;
        const discount = item.discount || 0;
        const tax = item.tax || 0;
        
        const subtotal = quantity * unitPrice;
        const discountAmount = subtotal * (discount / 100);
        const taxAmount = (subtotal - discountAmount) * (tax / 100);
        
        return sum + (subtotal - discountAmount + taxAmount);
      }, 0);
      
      setQuoteData(prev => ({
        ...prev,
        totalAmount: parseFloat(total.toFixed(2))
      }));
    }
  }, [quoteData.items]);

  const handleSelectService = (serviceId: string) => {
    const selectedService = services.find(service => service.id === serviceId);
    
    if (selectedService) {
      setCurrentItem({
        description: selectedService.name,
        quantity: 1,
        unitPrice: selectedService.price,
        discount: 0,
        tax: 20,
        serviceId: selectedService.id
      });
    }
  };

  const handleAddItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires de l'article.",
      });
      return;
    }
    
    setQuoteData(prev => ({
      ...prev,
      items: [...(prev.items || []), currentItem as QuoteItem]
    }));
    
    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 20
    });
  };

  const handleRemoveItem = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  const calculateItemTotal = (item: Partial<QuoteItem>) => {
    const quantity = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    const discount = item.discount || 0;
    const tax = item.tax || 0;
    
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * (tax / 100);
    
    return subtotal - discountAmount + taxAmount;
  };

  const handleSubmit = async () => {
    if (!quoteData.contactId || !quoteData.freelancerId || !quoteData.items?.length) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires et ajouter au moins un article.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createQuote(quoteData as Quote);
      
      if (result.success) {
        onOpenChange(false);
        onQuoteCreated();
        
        setQuoteData({
          status: QuoteStatus.DRAFT,
          validUntil: addDays(new Date(), 30),
          totalAmount: 0,
          items: []
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du devis.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau devis</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau devis.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Chargement des données...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact">Client</Label>
                  <Select
                    value={quoteData.contactId}
                    onValueChange={value => setQuoteData(prev => ({ ...prev, contactId: value }))}
                  >
                    <SelectTrigger id="contact">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} ({contact.company || "Particulier"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="freelancer">Commercial</Label>
                  <Select
                    value={quoteData.freelancerId}
                    onValueChange={value => setQuoteData(prev => ({ ...prev, freelancerId: value }))}
                  >
                    <SelectTrigger id="freelancer">
                      <SelectValue placeholder="Sélectionner un commercial" />
                    </SelectTrigger>
                    <SelectContent>
                      {freelancers.map(freelancer => (
                        <SelectItem key={freelancer.id} value={freelancer.id}>
                          {freelancer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={quoteData.status}
                    onValueChange={value => setQuoteData(prev => ({ ...prev, status: value as QuoteStatus }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuoteStatus.DRAFT}>Brouillon</SelectItem>
                      <SelectItem value={QuoteStatus.SENT}>Envoyé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="validUntil">Valide jusqu'au</Label>
                  <DatePicker
                    date={quoteData.validUntil}
                    onSelect={date => setQuoteData(prev => ({ ...prev, validUntil: date }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Notes ou commentaires sur le devis"
                    value={quoteData.notes || ""}
                    onChange={e => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-4">Ajouter un article</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="service">Service ou Pack</Label>
                      <Select
                        onValueChange={handleSelectService}
                      >
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Sélectionner un service ou pack" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Modification ici: changer "" en "custom" pour ne pas avoir de valeur vide */}
                          <SelectItem value="custom">Personnalisé</SelectItem>
                          {services.map(service => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - {formatCurrency(service.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Description de l'article"
                        value={currentItem.description || ""}
                        onChange={e => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="quantity">Quantité</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          placeholder="Quantité"
                          value={currentItem.quantity || ""}
                          onChange={e => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="unitPrice">Prix unitaire (€)</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="Prix unitaire"
                          value={currentItem.unitPrice || ""}
                          onChange={e => setCurrentItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="discount">Remise (%)</Label>
                        <Input
                          id="discount"
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Remise en %"
                          value={currentItem.discount || ""}
                          onChange={e => setCurrentItem(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="tax">TVA (%)</Label>
                        <Input
                          id="tax"
                          type="number"
                          min={0}
                          placeholder="TVA en %"
                          value={currentItem.tax || ""}
                          onChange={e => setCurrentItem(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      className="w-full" 
                      onClick={handleAddItem}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ajouter l'article
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Articles du devis</h3>
                  {quoteData.items && quoteData.items.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-2 text-left text-xs">Description</th>
                            <th className="p-2 text-right text-xs">Qté</th>
                            <th className="p-2 text-right text-xs">Prix</th>
                            <th className="p-2 text-right text-xs">Total</th>
                            <th className="p-2 text-center text-xs">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quoteData.items.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2 text-sm">{item.description}</td>
                              <td className="p-2 text-right text-sm">{item.quantity}</td>
                              <td className="p-2 text-right text-sm">
                                {formatCurrency(item.unitPrice)}
                                {item.discount ? 
                                  <span className="text-xs text-green-600 block">
                                    -{item.discount}%
                                  </span> 
                                : null}
                              </td>
                              <td className="p-2 text-right font-medium text-sm">
                                {formatCurrency(calculateItemTotal(item))}
                              </td>
                              <td className="p-2 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-muted/50">
                          <tr>
                            <td colSpan={3} className="p-2 text-right font-bold">
                              Total:
                            </td>
                            <td className="p-2 text-right font-bold">
                              {formatCurrency(quoteData.totalAmount || 0)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-muted/20">
                      Aucun article ajouté
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? (
                  "Création en cours..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Créer le devis
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
