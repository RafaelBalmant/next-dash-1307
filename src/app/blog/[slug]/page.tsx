import { FC } from "react";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: { slug: string };
}

const BlogPage: FC<BlogPageProps> = ({ params }) => {
  const { slug } = params;

  if (!slug) return notFound();

  return (
    <main>
      <h1>Post do Blog: {slug}</h1>
      <p>Conteúdo dinâmico para o post</p>
    </main>
  );
};

export default BlogPage; 