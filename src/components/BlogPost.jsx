import 'highlight.js/styles/tokyo-night-dark.css';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';

import SideNav from './SideNav';

import { useNavigate } from 'react-router-dom';

const BlogPost = ({ post, onClose }) => {
    const navigate = useNavigate();

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
            <div className="lg:grid lg:grid-cols-[280px_1fr]">
                {/* Side Navigation (Desktop) */}
                <div className="hidden lg:block">
                    <SideNav
                        fileTree={post.fileTree || []}
                        headings={post.headings || []}
                        currentSlug={post.slug}
                    />
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-6 py-12 w-full">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                        {/* ... (existing breadcrumbs) */}
                        {post.breadcrumbs && post.breadcrumbs.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {index > 0 && <span className="text-gray-600">/</span>}
                                {item.path ? (
                                    <a
                                        href={item.path}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(item.path);
                                        }}
                                        className="hover:text-accent-purple transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <span className="text-white font-medium">{item.label}</span>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Post header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                            {post.title}
                        </h1>
                        {!post.isVirtual && (
                            <>
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
                            </>
                        )}
                    </div>

                    {/* Post content */}
                    {!post.isVirtual && (
                        <div className="markdown-content">
                            <ReactMarkdown
                                remarkPlugins={[
                                    remarkGfm,
                                    [remarkWikiLink, {
                                        pageResolver: (name) => [name.replace(/ /g, '-').toLowerCase()],
                                        hrefTemplate: (permalink) => permalink,
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
                    )}

                    {/* Sub-articles section */}
                    {post.subArticles && post.subArticles.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-800">
                            <h2 className="text-2xl font-bold mb-6 gradient-text">Articles</h2>
                            <div className="grid gap-4">
                                {post.subArticles.map((subArticle, index) => (
                                    <a
                                        key={index}
                                        href={`/post/${subArticle.slug}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/post/${subArticle.slug}`);
                                        }}
                                        className="block p-4 rounded-xl glass hover:bg-white/5 transition-all group"
                                    >
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-accent-purple transition-colors">
                                            {subArticle.title}
                                        </h3>
                                        {subArticle.date && (
                                            <p className="text-sm text-gray-500">
                                                {formatDate(subArticle.date)}
                                            </p>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
