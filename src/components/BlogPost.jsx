import 'highlight.js/styles/tokyo-night-dark.css';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';

const BlogPost = ({ post, onClose }) => {
    const navigate = useNavigate();

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
                        remarkPlugins={[
                            remarkGfm,
                            [remarkWikiLink, {
                                pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
                                hrefTemplate: (permalink) => `/post/${permalink}`,
                                aliasDivider: '|',
                            }]
                        ]}
                        rehypePlugins={[
                            rehypeSlug,
                            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                            rehypeHighlight
                        ]}
                        components={{
                            a: ({ node, href, children, ...props }) => {
                                console.log(href);
                                // Handle same-page heading links
                                if (href && href.includes('/post/#')) {
                                    href = href.replace('/post/', '');
                                    return (
                                        <a
                                            href={href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const headingId = href.slice(1);
                                                const element = document.getElementById(headingId);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                                // Update URL hash
                                                window.history.pushState(null, '', href);
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </a>
                                    );
                                }

                                // External links
                                if (href && (href.startsWith('/post/http://') || href.startsWith('/post/https://'))) {
                                    href = href.replace('/post/', '');
                                    return (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        >
                                            {children}
                                        </a>
                                    );
                                }

                                // Handle internal post links (from remark-wiki-link or manual links)
                                if (href && href.startsWith('/post/')) {
                                    return (
                                        <a
                                            href={href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(href);
                                            }}
                                            className="text-accent-blue hover:text-accent-cyan transition-colors cursor-pointer"
                                            {...props}
                                        >
                                            {children}
                                        </a>
                                    );
                                }

                                // Default link
                                return <a href={href} {...props}>{children}</a>;
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div >
    );
};

export default BlogPost;
