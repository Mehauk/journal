import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Link to={`/post/${post.slug}`}>
            <article className="glass glass-hover rounded-2xl p-6 cursor-pointer transform transition-all hover:scale-105 fade-in-up">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <time>{formatDate(post.date)}</time>
                    <span>•</span>
                    <span>{post.readTime || '5 min read'}</span>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-white group-hover:gradient-text transition-all">
                    {post.title}
                </h2>

                <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </article>
        </Link>
    );
};

export default BlogCard;
