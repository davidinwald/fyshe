import { ArticleForm } from "@/components/content/article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">New Article</h1>
        <p className="text-muted-foreground">
          Write and publish an article for the community.
        </p>
      </div>
      <ArticleForm />
    </div>
  );
}
