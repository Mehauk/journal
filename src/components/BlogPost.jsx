import 'highlight.js/styles/tokyo-night-dark.css';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';

const BlogPost = ({ post, onClose }) => {
    if (!post) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-dark">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back button */}
                <button
                    onClick={onClose}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to posts
                </button>

                {/* Post header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400">
                        <time>{formatDate(post.date)}</time>
                        <span>•</span>
                        <span>{post.readTime || '5 min read'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags && post.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Post content */}
                <div className="markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkWikiLink]}
                        rehypePlugins={[
                            rehypeSlug,
                            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                            rehypeHighlight
                        ]}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
