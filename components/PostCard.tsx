import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, ArrowUp, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Post } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface PostCardProps {
    post: Post;
    onVote: (postId: number, voteType: 'cooked' | 'going_to_make_it') => void;
}

export default function PostCard({ post, onVote }: PostCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 280;
    const isLongText = post.text.length > maxLength;
    const displayText = isExpanded ? post.text : post.text.slice(0, maxLength);

    const handleCardClick = () => {
        router.push(`/post/${post.id}`);
    };

    const handleVoteClick = (e: React.MouseEvent, voteType: 'cooked' | 'going_to_make_it') => {
        e.stopPropagation();
        onVote(post.id, voteType);
    };

    const handleReadMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <Card 
            className="mb-4 bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            onClick={handleCardClick}
        >
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="text-slate-200">
                        {displayText}
                        {isLongText && !isExpanded && (
                            <button
                                onClick={handleReadMoreClick}
                                className="ml-2 text-blue-400 hover:text-blue-300"
                            >
                                Read more
                            </button>
                        )}
                    </div>

                    {post.image_path && (
                        <div className="relative w-full h-64">
                            <img
                                src={`http://localhost:5000/uploads/${post.image_path}`}
                                alt="Post attachment"
                                className="object-cover rounded-lg w-full h-full"
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between text-slate-400">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                                onClick={(e) => handleVoteClick(e, 'cooked')}
                            >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Cooked ({post.votes.cooked})
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-green-400 hover:bg-slate-700"
                                onClick={(e) => handleVoteClick(e, 'going_to_make_it')}
                            >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                WAGMI ({post.votes.going_to_make_it})
                            </Button>
                        </div>
                        <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {post.comments.length} comments
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
