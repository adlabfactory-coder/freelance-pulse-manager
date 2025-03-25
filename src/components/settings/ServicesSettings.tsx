
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Check, X, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/utils/format";
import { 
  fetchServices, 
  createService, 
  updateService, 
  deleteService 
} from "@/services/services-service";
import { Service, ServiceType } from "@/types";

const ServicesSettings: React.FC = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les services. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedService({
      name: "",
      description: "",
      type: "service",
      price: 0,
      is_active: true,
    });
    setEditDialogOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setConfirmDeleteDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (!selectedService || !selectedService.name || selectedService.price === undefined) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    try {
      if (selectedService.id) {
        // Update existing service
        await updateService(selectedService as Service);
        toast({
          title: "Service mis à jour",
          description: `Le service "${selectedService.name}" a été mis à jour avec succès.`,
        });
      } else {
        // Create new service
        await createService(selectedService as Omit<Service, "id" | "created_at" | "updated_at">);
        toast({
          title: "Service créé",
          description: `Le service "${selectedService.name}" a été créé avec succès.`,
        });
      }
      
      setEditDialogOpen(false);
      loadServices();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du service:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du service.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService || !selectedService.id) return;

    try {
      await deleteService(selectedService.id);
      toast({
        title: "Service supprimé",
        description: `Le service "${selectedService.name}" a été supprimé avec succès.`,
      });
      setConfirmDeleteDialogOpen(false);
      loadServices();
    } catch (error) {
      console.error("Erreur lors de la suppression du service:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du service.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services et Packs</h2>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center">Chargement des services...</div>
      ) : services.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aucun service</AlertTitle>
          <AlertDescription>
            Aucun service n'a été créé. Cliquez sur "Ajouter un service" pour commencer.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      {service.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize ${service.type === 'pack' ? 'text-purple-600' : ''}`}>
                      {service.type}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(service.price)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.is_active ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(service)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedService?.id ? "Modifier le service" : "Ajouter un service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du service *</Label>
              <Input
                id="name"
                value={selectedService?.name || ""}
                onChange={(e) =>
                  setSelectedService((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nom du service"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={selectedService?.type}
                onValueChange={(value) =>
                  setSelectedService((prev) => ({ ...prev, type: value as ServiceType }))
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={selectedService?.price || ""}
                onChange={(e) =>
                  setSelectedService((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                }
                placeholder="Prix du service"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedService?.description || ""}
                onChange={(e) =>
                  setSelectedService((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description du service"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={selectedService?.is_active}
                onCheckedChange={(checked) =>
                  setSelectedService((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="is_active">Service actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveService}>
              <Check className="mr-2 h-4 w-4" /> Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer le service "{selectedService?.name}" ?
              Cette action est irréversible.
            </p>
            
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                La suppression d'un service peut affecter les devis existants qui l'utilisent.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesSettings;
