import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Post as PostType } from '../../types';
import { fetchPosts, voteOnPost, addComment } from '../../api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PostPage() {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState<PostType | null>(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadPost();
        }
    }, [id]);

    const loadPost = async () => {
        try {
            const posts = await fetchPosts();
            const foundPost = posts.find(p => p.id === Number(id));
            if (foundPost) {
                setPost(foundPost);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading post:', error);
            setLoading(false);
        }
    };

    const handleVote = async (voteType: 'cooked' | 'going_to_make_it') => {
        if (!post) return;
        try {
            const votes = await voteOnPost(post.id, voteType);
            setPost(prev => prev ? { ...prev, votes } : null);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post || !newComment.trim()) return;

        try {
            const comment = await addComment(post.id, newComment);
            setPost(prev => prev ? {
                ...prev,
                comments: [comment, ...prev.comments]
            } : null);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-200 p-4 flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-200 p-4 flex flex-col items-center justify-center">
                <p className="mb-4">Post not found</p>
                <Link href="/">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Head>
                <title>Post Details - Amicooked</title>
                <meta name="description" content="View post and comments" />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-4">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-200">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <Card className="bg-slate-800 border-slate-700 mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <span className="font-mono text-teal-400">{post.code}</span>
                        <span className="text-sm text-slate-400">
                            {new Date(post.created_at).toLocaleString()}
                        </span>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-slate-200 whitespace-pre-wrap break-words">
                            {post.text}
                        </p>
                        {post.image_path && (
                            <div className="mt-4">
                                <img
                                    src={`http://localhost:5000/uploads/${post.image_path}`}
                                    alt="Post attachment"
                                    className="max-w-full rounded-lg"
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVote('cooked')}
                                className="border-red-500 text-red-400 hover:bg-red-900/50"
                            >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Cooked ({post.votes.cooked})
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVote('going_to_make_it')}
                                className="border-green-500 text-green-400 hover:bg-green-900/50"
                            >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                WAGMI ({post.votes.going_to_make_it})
                            </Button>
                        </div>
                        <div className="flex items-center text-amber-400">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {post.comments.length} Comments
                        </div>
                    </CardFooter>
                </Card>

                <div className="mb-6">
                    <form onSubmit={handleComment}>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-slate-200"
                            />
                            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                                Post
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="space-y-4">
                    {post.comments.map((comment) => (
                        <Card key={comment.id} className="bg-slate-700 border-slate-600">
                            <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                                <span className="font-mono text-sm text-teal-400">{comment.code}</span>
                                <span className="text-xs text-slate-400">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                                <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                                    {comment.text}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
