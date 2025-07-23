'use client'

import env from "@/app/env";
import { client } from '@/models/client/config';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';

export default function BlogPostList({ initialBlogPosts }: { initialBlogPosts: BlogPost[] }) {
    const [posts, setBlogPost] = useState<BlogPost[]>(initialBlogPosts);
    const db = env.appwrite.db;
    const blogPostCollection = env.appwrite.post_collection_id;
    const channel = `databases.${db}.collections.${blogPostCollection}.documents`;
    useEffect(() => {
        const unsubscribe = client.subscribe(channel, (response) => {
            const eventType = response.events[0];
            console.log(response.events)
            const changedBlogPost = response.payload as BlogPost

            if (eventType.includes('create')) {
                setBlogPost((prevBlogPost) => [...prevBlogPost, changedBlogPost])
            } else if (eventType.includes('delete')) {
                setBlogPost((prevBlogPost) => prevBlogPost.filter((post) => post.$id !== changedBlogPost.$id))
            } else if (eventType.includes('update')) {
                setBlogPost((prevBlogPost) => prevBlogPost.map((post) => post.$id === changedBlogPost.$id ? changedBlogPost : post))
            }
        });
        return () => unsubscribe()
    }, [])

    return (
        <div className="flex flex-wrap gap-4 justify-center pt-8">
            {/* {user && <h1 className="text-2xl font-bold text-center">Willkommen {user.name}</h1>} */}
            <Table className="w-full max-w-4xl">
                <TableHeader className="bg-gray-200">
                    <TableRow>
                        <TableCell className="font-bold">BlogPostID</TableCell>
                        <TableCell className="font-bold">Title</TableCell>
                        <TableCell className="font-bold">Tags</TableCell>
                        <TableCell className="font-bold">Written At</TableCell>
                        <TableCell className="font-bold">Written By</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.$id} className="hover:bg-gray-100 cursor-pointer">
                            <TableCell>{post.$id}</TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.tags.join(', ')}</TableCell>
                            <TableCell>{new Date(post.writtenAt).toDateString()}</TableCell>
                            <TableCell>{post.writtenBy}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
