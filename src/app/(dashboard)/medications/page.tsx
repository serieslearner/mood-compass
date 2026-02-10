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
        toast.success("Medication added!");
        setName("");
        setDosage("");
        setFrequency("");
        setDialogOpen(false);
        fetchMedications();
      } else {
        toast.error("Failed to add medication");
      }
    } catch {
      toast.error("Something went wrong");
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
        toast.success(skipped ? "Marked as skipped" : "Marked as taken");
      } else {
        toast.error("Failed to log medication");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medications</h1>
          <p className="text-muted-foreground">
            Track your medications and log when you take them.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  placeholder="e.g., Lithium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input
                  id="med-dosage"
                  placeholder="e.g., 300mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-frequency">Frequency</Label>
                <Input
                  id="med-frequency"
                  placeholder="e.g., Twice daily"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Adding..." : "Add medication"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : medications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No medications added yet. Add your first medication to start tracking.
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
                    {med.active ? "Active" : "Inactive"}
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
                    Taken
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => logMedication(med.id, true)}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Skipped
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
