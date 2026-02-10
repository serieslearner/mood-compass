import { Badge } from "@/components/ui/badge";

export function CrisisBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-destructive/10 px-4 py-2 text-sm">
      <Badge variant="destructive" className="text-xs">
        Crisis?
      </Badge>
      <span className="text-destructive">
        If you&apos;re in crisis, call or text{" "}
        <a href="tel:988" className="font-bold underline">
          988
        </a>{" "}
        (Suicide &amp; Crisis Lifeline) — available 24/7
      </span>
    </div>
  );
}
