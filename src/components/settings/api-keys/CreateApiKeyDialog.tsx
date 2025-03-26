
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { addMonths } from "date-fns";

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, expiresAt?: Date) => void;
}

const CreateApiKeyDialog: React.FC<CreateApiKeyDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [keyName, setKeyName] = useState("");
  const [expiration, setExpiration] = useState<Date | undefined>(addMonths(new Date(), 6));
  const [hasExpiration, setHasExpiration] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    
    onSubmit(keyName, hasExpiration ? expiration : undefined);
    setKeyName("");
    setExpiration(addMonths(new Date(), 6));
    setHasExpiration(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle clé API</DialogTitle>
          <DialogDescription>
            Cette clé sera générée avec un identifiant unique. Vous devrez la copier car elle ne sera plus visible entièrement après.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Application mobile, API externe..."
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiration" className="text-right">
                Expiration
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="expiration-toggle"
                  checked={hasExpiration}
                  onCheckedChange={setHasExpiration}
                />
                <Label htmlFor="expiration-toggle">Activer l'expiration</Label>
              </div>
            </div>

            {hasExpiration && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1"></div>
                <div className="col-span-3">
                  <DatePicker 
                    date={expiration} 
                    onSelect={setExpiration}
                    disabled={!hasExpiration}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Créer la clé API</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateApiKeyDialog;
