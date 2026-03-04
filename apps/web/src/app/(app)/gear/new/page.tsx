import { GearForm } from "@/components/gear/gear-form";

export default function NewGearPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Add Gear</h1>
        <p className="text-muted-foreground">Add a new item to your gear collection.</p>
      </div>
      <GearForm />
    </div>
  );
}
