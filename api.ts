import { Post, Comment, ApiResponse } from './types';
import { generateAnonymousName } from './utils/anonymousNames';

const API_URL = 'http://localhost:5000';

export async function fetchPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/situations`);
    const data = await response.json();
    return data.map((post: any) => ({
        ...post,
        code: generateAnonymousName(),
        replies: post.replies?.map((reply: any) => ({
            ...reply,
            code: generateAnonymousName()
        }))
    }));
}

export async function createPost(text: string, image?: File, replyTo?: number): Promise<Post> {
    const formData = new FormData();
    formData.append('text', text);
    if (image) {
        formData.append('image', image);
    }
    if (replyTo) {
        formData.append('reply_to', replyTo.toString());
    }

    const response = await fetch(`${API_URL}/situations`, {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    return {
        ...data,
        code: generateAnonymousName(),
        votes: {
            cooked: 0,
            going_to_make_it: 0
        },
        comments: [],
        replies: []
    };
}

export async function voteOnPost(postId: number, voteType: 'cooked' | 'going_to_make_it'): Promise<{ cooked: number; going_to_make_it: number }> {
    const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            post_id: postId,
            vote_type: voteType
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to vote on post');
    }
    
    return response.json();
}

export async function fetchVotes(postId: number): Promise<{ cooked: number; going_to_make_it: number }> {
    const response = await fetch(`${API_URL}/vote/${postId}`);
    return await response.json();
}

export async function addComment(postId: number, text: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            situation_id: postId,
            text
        }),
    });
    const data = await response.json();
    return {
        ...data,
        code: generateAnonymousName()
    };
}

export async function fetchComments(postId: number): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/comments/${postId}`);
    const data = await response.json();
    return data.map((comment: any) => ({
        ...comment,
        code: generateAnonymousName()
    }));
}
