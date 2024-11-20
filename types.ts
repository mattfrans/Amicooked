export interface Vote {
    cooked: number;
    going_to_make_it: number;
}

export interface Comment {
    id: number;
    text: string;
    created_at: string;
    situation_id: number;
    code: string;
}

export interface Post {
    id: number;
    text: string;
    image_path?: string;
    created_at: string;
    code: string;
    reply_to?: number;
    replies?: Post[];
    votes: {
        cooked: number;
        going_to_make_it: number;
    };
    comments: Comment[];
}

export interface ApiResponse {
    message?: string;
    status?: string;
}
