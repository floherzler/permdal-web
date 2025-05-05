// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import env from "@/app/env";
import BlogPostList from "@/components/BlogPostList";

export default function Page() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    async function load() {
      console.log("Fetching staffeln on the client…");
      const resp = await databases.listDocuments(
        env.appwrite.db,
        env.appwrite.post_collection_id
      );
      setPosts(
        resp.documents.map((doc) => ({
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          title: doc.title,
          description: doc.description,
          content: doc.content,
          tags: doc.tags,
          writtenBy: doc.writtenBy,
          writtenAt: doc.writtenAt,
          updatedAt: doc.updatedAt,
        }))
      );
    }
    load();
  }, []);

  if (!posts) {
    return <div>Loading…</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <a
          href="/produkte"
          className="text-blue-500 hover:underline text-lg"
        >
          Zu den Produkten
        </a>
      </div>
      <div className="w-full max-w-4xl">
        <BlogPostList initialBlogPosts={posts} />
      </div>
    </main>
  );
}
