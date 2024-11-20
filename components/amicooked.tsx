"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, TrendingUp, Star, Clock, ThumbsUp, ThumbsDown, MessageSquare, X, Image as ImageIcon } from 'lucide-react'
import Head from 'next/head'
import { Post, Comment } from '../types'
import { fetchPosts, createPost, voteOnPost, fetchVotes, addComment, fetchComments } from '../api'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const MAX_PREVIEW_LENGTH = 280;

interface PostCardProps {
    post: Post;
    onVote: (postId: number, voteType: 'cooked' | 'going_to_make_it') => void;
    onComment: (postId: number, comment: string) => void;
    onReply: (postId: number, text: string, image?: File) => void;
    depth?: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote, onComment, onReply, depth = 0 }) => {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState('');
    const [replyImage, setReplyImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const truncatedText = post.text.length > MAX_PREVIEW_LENGTH && !isExpanded
        ? post.text.slice(0, MAX_PREVIEW_LENGTH) + '...'
        : post.text;

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onComment(post.id, newComment);
            setNewComment('');
        }
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReply.trim()) {
            onReply(post.id, newReply, replyImage || undefined);
            setNewReply('');
            setReplyImage(null);
            setImagePreview(null);
            setShowReplyForm(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReplyImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on vote buttons or expand text button
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        router.push(`/post/${post.id}`);
    };

    return (
        <div className={`ml-${depth * 4}`}>
            <Card 
                className="bg-slate-800 border-slate-700 mb-4 shadow-sm hover:bg-slate-800/80 transition-colors cursor-pointer"
                onClick={handleClick}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <span className="font-mono text-teal-400">{post.code}</span>
                    <span className="text-sm text-slate-400">
                        {new Date(post.created_at).toLocaleString()}
                    </span>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-slate-200 whitespace-pre-wrap break-words">
                        {truncatedText}
                    </p>
                    {post.text.length > MAX_PREVIEW_LENGTH && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-blue-500 hover:text-blue-400 text-sm mt-2"
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
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
                <CardFooter className="flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onVote(post.id, 'cooked');
                                }}
                                className="border-red-500 text-red-400 hover:bg-red-900/50"
                            >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Cooked ({post.votes.cooked})
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onVote(post.id, 'going_to_make_it');
                                }}
                                className="border-green-500 text-green-400 hover:bg-green-900/50"
                            >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                WAGMI ({post.votes.going_to_make_it})
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowComments(!showComments);
                                }}
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/50"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Comments ({post.comments.length})
                            </Button>
                            {depth < 2 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowReplyForm(!showReplyForm);
                                    }}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Reply
                                </Button>
                            )}
                        </div>
                    </div>

                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="w-full">
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Write your reply..."
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-slate-200"
                                />
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                            <ImageIcon size={20} />
                                            Add Image
                                        </div>
                                    </label>
                                    {imagePreview && (
                                        <div className="relative w-20 h-20">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReplyImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Post Reply
                                </Button>
                            </div>
                        </form>
                    )}

                    {showComments && (
                        <div className="w-full space-y-4">
                            <form onSubmit={handleCommentSubmit}>
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
                    )}
                </CardFooter>
            </Card>
            
            {post.replies && post.replies.map((reply) => (
                <PostCard
                    key={reply.id}
                    post={reply}
                    onVote={onVote}
                    onComment={onComment}
                    onReply={onReply}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
};

interface CommentProps {
    comment: Comment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const truncatedText = comment.text.length > MAX_PREVIEW_LENGTH && !isExpanded
        ? comment.text.slice(0, MAX_PREVIEW_LENGTH) + '...'
        : comment.text;

    return (
        <Card key={comment.id} className="bg-slate-700 border-slate-600 mb-2">
            <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                <span className="font-mono text-sm text-teal-400">{comment.code}</span>
                <span className="text-xs text-slate-400">
                    {new Date(comment.created_at).toLocaleString()}
                </span>
            </CardHeader>
            <CardContent className="py-2 px-4">
                <p className="text-sm text-slate-300 whitespace-pre-wrap break-words">
                    {truncatedText}
                </p>
                {comment.text.length > MAX_PREVIEW_LENGTH && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-500 hover:text-blue-400 text-sm block mt-1"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </CardContent>
        </Card>
    )
}

export default function Amicooked() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [postImage, setPostImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showNewPostForm, setShowNewPostForm] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await fetchPosts();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading posts:', error);
            setLoading(false);
        }
    };

    const handleNewPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPost.trim()) {
            try {
                const post = await createPost(newPost, postImage);
                setPosts([post, ...posts]);
                setNewPost('');
                setPostImage(null);
                setImagePreview(null);
                setShowNewPostForm(false);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPostImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVote = async (postId: number, voteType: 'cooked' | 'going_to_make_it') => {
        try {
            const votes = await voteOnPost(postId, voteType);
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, votes }
                    : post
            ));
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-200 p-4 flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Head>
                <title>Amicooked - Anonymous Community</title>
                <meta name="description" content="Share your situations anonymously" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-slate-200">Amicooked</h1>
                        <Button
                            onClick={() => setShowNewPostForm(!showNewPostForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Post
                        </Button>
                    </div>

                    {showNewPostForm && (
                        <Card className="bg-slate-800 border-slate-700 mb-4">
                            <CardContent className="pt-6">
                                <form onSubmit={handleNewPost} className="space-y-4">
                                    <Textarea
                                        placeholder="What's your situation?"
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                        className="bg-slate-700 border-slate-600 text-slate-200"
                                        rows={4}
                                    />
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                                <ImageIcon size={20} />
                                                Add Image
                                            </div>
                                        </label>
                                        {imagePreview && (
                                            <div className="relative w-20 h-20">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPostImage(null);
                                                        setImagePreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        Post
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Tabs defaultValue="new" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                        <TabsTrigger value="new" className="text-slate-200">
                            <Clock className="mr-2 h-4 w-4" /> New
                        </TabsTrigger>
                        <TabsTrigger value="trending" className="text-slate-200">
                            <TrendingUp className="mr-2 h-4 w-4" /> Trending
                        </TabsTrigger>
                        <TabsTrigger value="top" className="text-slate-200">
                            <Star className="mr-2 h-4 w-4" /> Top
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="new">
                        {posts.filter(post => !post.reply_to).map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onVote={handleVote}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value="trending">
                        {posts
                            .filter(post => !post.reply_to)
                            .sort((a, b) => (b.votes.cooked + b.votes.going_to_make_it) - (a.votes.cooked + a.votes.going_to_make_it))
                            .map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onVote={handleVote}
                                />
                            ))}
                    </TabsContent>
                    <TabsContent value="top">
                        {posts
                            .filter(post => !post.reply_to)
                            .sort((a, b) => b.votes.going_to_make_it - a.votes.going_to_make_it)
                            .map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onVote={handleVote}
                                />
                            ))}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}