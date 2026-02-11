"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Check, X } from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";

interface Medication {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  active: boolean;
  notes: string | null;
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();

  // Form state
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchMedications() {
    try {
      const res = await fetch("/api/medications");
      if (res.ok) {
        setMedications(await res.json());
      }
    } catch {
      // API not connected
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedications();
  }, []);

  async function handleAddMedication(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dosage: dosage || null, frequency: frequency || null }),
      });

      if (res.ok) {
        toast.success(t("medications.addedSuccess"));
        setName("");
        setDosage("");
        setFrequency("");
        setDialogOpen(false);
        fetchMedications();
      } else {
        toast.error(t("medications.addedError"));
      }
    } catch {
      toast.error(t("common.somethingWentWrong"));
    } finally {
      setSaving(false);
    }
  }

  async function logMedication(medicationId: string, skipped: boolean) {
    try {
      const res = await fetch("/api/medications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationId, skipped }),
      });
      if (res.ok) {
        toast.success(skipped ? t("medications.markedSkipped") : t("medications.markedTaken"));
      } else {
        toast.error(t("medications.logError"));
      }
    } catch {
      toast.error(t("common.somethingWentWrong"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("medications.title")}</h1>
          <p className="text-muted-foreground">
            {t("medications.subtitle")}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("medications.addMedication")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("medications.dialogTitle")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">{t("medications.name")}</Label>
                <Input
                  id="med-name"
                  placeholder={t("medications.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-dosage">{t("medications.dosage")}</Label>
                <Input
                  id="med-dosage"
                  placeholder={t("medications.dosagePlaceholder")}
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-frequency">{t("medications.frequency")}</Label>
                <Input
                  id="med-frequency"
                  placeholder={t("medications.frequencyPlaceholder")}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? t("medications.adding") : t("medications.addButton")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : medications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("medications.noMedications")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <Card key={med.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{med.name}</CardTitle>
                  <Badge variant={med.active ? "default" : "secondary"}>
                    {med.active ? t("medications.active") : t("medications.inactive")}
                  </Badge>
                </div>
                {(med.dosage || med.frequency) && (
                  <CardDescription>
                    {[med.dosage, med.frequency].filter(Boolean).join(" — ")}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => logMedication(med.id, false)}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    {t("medications.taken")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => logMedication(med.id, true)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    {t("medications.skipped")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
