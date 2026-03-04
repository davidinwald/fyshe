"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectOption,
  Separator,
} from "@fyshe/ui";
import { trpc } from "@/trpc/client";

interface MaterialItem {
  id: string;
  category: string;
  name: string;
  color: string | null;
  brand: string | null;
  quantity: string | null;
  inStock: boolean;
  notes: string | null;
}

export function MaterialInventory({ initialItems }: { initialItems: MaterialItem[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [newCategory, setNewCategory] = useState("");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const filters = {
    search: search || undefined,
    category: categoryFilter || undefined,
    inStock: stockFilter === "" ? undefined : stockFilter === "true",
  };

  const { data: items } = trpc.material.list.useQuery(
    filters as Parameters<typeof trpc.material.list.useQuery>[0],
  );

  const displayItems = items ?? initialItems;

  const utils = trpc.useUtils();

  const createMaterial = trpc.material.create.useMutation({
    onSuccess: () => {
      utils.material.list.invalidate();
      resetForm();
      setShowAddForm(false);
    },
  });

  const updateMaterial = trpc.material.update.useMutation({
    onSuccess: () => {
      utils.material.list.invalidate();
    },
  });

  const deleteMaterial = trpc.material.delete.useMutation({
    onSuccess: () => {
      utils.material.list.invalidate();
    },
  });

  function resetForm() {
    setNewCategory("");
    setNewName("");
    setNewColor("");
    setNewBrand("");
    setNewQuantity("");
    setNewNotes("");
  }

  function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    createMaterial.mutate({
      category: newCategory,
      name: newName,
      color: newColor || undefined,
      brand: newBrand || undefined,
      quantity: newQuantity || undefined,
      notes: newNotes || undefined,
      inStock: true,
    });
  }

  function toggleStock(item: MaterialItem) {
    updateMaterial.mutate({
      id: item.id,
      data: { inStock: !item.inStock },
    });
  }

  function handleDelete(id: string) {
    if (confirm("Delete this material?")) {
      deleteMaterial.mutate({ id });
    }
  }

  // Group items by category
  const grouped = displayItems.reduce((acc: Record<string, MaterialItem[]>, item: MaterialItem) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MaterialItem[]>);

  const categories = Object.keys(grouped).sort();

  // Get unique categories from all items for the filter dropdown
  const allCategories = Array.from(
    new Set(displayItems.map((item: MaterialItem) => item.category)),
  ).sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-44"
        >
          <SelectOption value="">All Categories</SelectOption>
          {allCategories.map((cat: string) => (
            <SelectOption key={cat} value={cat}>
              {cat}
            </SelectOption>
          ))}
        </Select>
        <Select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-40"
        >
          <SelectOption value="">All Stock</SelectOption>
          <SelectOption value="true">In Stock</SelectOption>
          <SelectOption value="false">Out of Stock</SelectOption>
        </Select>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Material"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Material</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newCategory">Category *</Label>
                  <Input
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Hackle, Dubbing, Thread"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newName">Name *</Label>
                  <Input
                    id="newName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Whiting Dry Fly Hackle"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="newColor">Color</Label>
                  <Input
                    id="newColor"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g. Grizzly"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newBrand">Brand</Label>
                  <Input
                    id="newBrand"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Whiting Farms"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newQuantity">Quantity</Label>
                  <Input
                    id="newQuantity"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g. 1 cape"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newNotes">Notes</Label>
                <Input
                  id="newNotes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={createMaterial.isPending}>
                  {createMaterial.isPending ? "Adding..." : "Add Material"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              {createMaterial.isError && (
                <p className="text-sm text-destructive">{createMaterial.error.message}</p>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {displayItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No materials in your inventory.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-primary hover:underline text-sm"
            >
              Add your first material
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat: string) => (
            <Card key={cat}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {cat}
                  <Badge variant="secondary">{(grouped[cat] ?? []).length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(grouped[cat] ?? []).map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{item.name}</p>
                          <Badge variant={item.inStock ? "default" : "outline"}>
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {item.color && <span>{item.color}</span>}
                          {item.brand && <span>{item.brand}</span>}
                          {item.quantity && <span>{item.quantity}</span>}
                        </div>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          onClick={() => toggleStock(item)}
                          disabled={updateMaterial.isPending}
                        >
                          {item.inStock ? "Mark Out" : "Mark In"}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMaterial.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
