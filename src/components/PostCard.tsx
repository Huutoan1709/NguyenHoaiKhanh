import React from 'react';

interface PostCardProps {
    title: string;
    excerpt: string;
    slug: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, excerpt, slug }) => {
    return (
        <div className="post-card">
            <h2>{title}</h2>
            <p>{excerpt}</p>
            <a href={`/posts/${slug}`}>Read more</a>
        </div>
    );
};

export default PostCard;