import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { createCaller } from "@/trpc/server";
import { ArticleDetail } from "@/components/content/article-detail";
import { CommentSection } from "@/components/social/comment-section";
import { LikeButton } from "@/components/social/like-button";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const trpc = await createCaller();

  try {
    const article = await trpc.article.getBySlug({ slug });
    return {
      title: article.title,
      description: article.excerpt ?? undefined,
      openGraph: {
        title: article.title,
        description: article.excerpt ?? undefined,
        images: article.coverImage ? [article.coverImage] : undefined,
      },
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const trpc = await createCaller();

  try {
    const article = await trpc.article.getBySlug({ slug });

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <ArticleDetail article={article} />

        <div className="flex items-center gap-4 border-t border-b border-border py-4">
          <LikeButton articleId={article.id} />
        </div>

        <CommentSection articleId={article.id} />
      </div>
    );
  } catch {
    notFound();
  }
}
