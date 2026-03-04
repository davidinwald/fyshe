"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectOption,
} from "@fyshe/ui";
import { ARTICLE_CATEGORIES } from "@fyshe/validators";
import { trpc } from "@/trpc/client";

const CATEGORY_LABELS: Record<string, string> = {
  TECHNIQUE: "Technique",
  GEAR_REVIEW: "Gear Review",
  LOCATION_GUIDE: "Location Guide",
  SEASONAL_TIP: "Seasonal Tip",
  FLY_TYING: "Fly Tying",
  CONSERVATION: "Conservation",
};

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    category: string;
    tags: string[];
    coverImage: string | null;
    isPublished: boolean;
  };
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? ARTICLE_CATEGORIES[0],
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(", ") ?? "",
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished ?? false,
  );

  const utils = trpc.useUtils();

  const createArticle = trpc.article.create.useMutation({
    onSuccess: () => {
      utils.article.list.invalidate();
      utils.article.myArticles.invalidate();
      router.push("/articles/my");
    },
  });

  const updateArticle = trpc.article.update.useMutation({
    onSuccess: () => {
      utils.article.list.invalidate();
      utils.article.myArticles.invalidate();
      router.push("/articles/my");
    },
  });

  const mutation = isEditing ? updateArticle : createArticle;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data = {
      title,
      content,
      excerpt: excerpt || undefined,
      category: category as (typeof ARTICLE_CATEGORIES)[number],
      tags,
      coverImage: coverImage || undefined,
      isPublished,
    };

    if (isEditing) {
      updateArticle.mutate({ id: initialData!.id, data });
    } else {
      createArticle.mutate(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Article" : "New Article"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of the article..."
              rows={2}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here... (HTML supported)"
              rows={12}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {ARTICLE_CATEGORIES.map((cat) => (
                  <SelectOption key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. trout, spring, dry-fly"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPublished"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isPublished">Publish immediately</Label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : isPublished
                    ? "Publish Article"
                    : "Save Draft"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              {mutation.error.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
