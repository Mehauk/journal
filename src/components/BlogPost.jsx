import 'highlight.js/styles/tokyo-night-dark.css';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';

import SideNav from './SideNav';

const TableOfContents = ({ headings }) => {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0% -80% 0%' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (!headings || headings.length === 0) return null;

    return (
        <nav className="hidden xl:block sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
            <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest px-4">On this page</h4>
            <div className="space-y-1">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block py-1.5 px-4 text-sm transition-all border-l-2 truncate ${activeId === heading.id
                            ? 'text-accent-purple border-accent-purple bg-accent-purple/5'
                            : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-700'
                            }`}
                        style={{ paddingLeft: `${heading.level * 0.75 + 1}rem` }}
                    >
                        {heading.text}
                    </a>
                ))}
            </div>
        </nav>
    );
};

const BlogPost = ({ post }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

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
            <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
                {/* Side Navigation */}
                <SideNav
                    fileTree={post.fileTree || []}
                    currentSlug={post.slug}
                    isOpen={isNavOpen}
                    onClose={() => setIsNavOpen(false)}
                />

                {/* Main Content Area */}
                <main className="flex-1 w-full min-w-0">
                    <div className="flex flex-col xl:flex-row px-4 sm:px-6 lg:px-8 py-12 gap-12">
                        {/* Central Post Column */}
                        <div className="flex-1 max-w-4xl mx-auto w-full">
                            {/* Breadcrumbs */}
                            <div className="flex items-start">
                                <button
                                    onClick={() => setIsNavOpen(true)}
                                    className="pr-2 text-gray-400 hover:text-white lg:hidden"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <nav className="mb-8 sm:flex flex-wrap items-center gap-2 text-sm text-gray-400 hidden">
                                    {post.breadcrumbs && post.breadcrumbs.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            {index > 0 && <span className="text-gray-600">{">"}</span>}
                                            {item.path ? (
                                                <a
                                                    href={item.path}
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
                            </div>

                            {/* Post header */}
                            <div className="mb-12">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 gradient-text leading-tight">
                                    {post.title}
                                </h1>
                                {!post.isVirtual && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                                            <time className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(post.date)}
                                            </time>
                                            <span className="text-gray-700">•</span>
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {post.readTime || '5 min read'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags && post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
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
                                            pre: ({ node, inline, className, children, ...props }) => {
                                                if (children.type == "code") {
                                                    const codeContent = String(children.props.children).replace(/\n$/, '');
                                                    const lines = codeContent.split('\n');

                                                    return (
                                                        <pre>
                                                            <code className={className} {...props}>
                                                                {lines.map((line, i) => (
                                                                    <span key={i} className="line-wrapper">
                                                                        <span className="line-content">{line || '\n'}</span>
                                                                    </span>
                                                                ))}
                                                            </code>
                                                        </pre>
                                                    );
                                                }
                                                return (
                                                    <pre>{children}</pre>
                                                );
                                            },
                                            a: ({ node, href, children, ...props }) => {
                                                if (href && href.includes('/post/#')) {
                                                    href = href.replace('/post/', '');
                                                    return (
                                                        <a
                                                            href={href}
                                                            {...props}
                                                        >
                                                            {children}
                                                        </a>
                                                    );
                                                }

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

                                                if (href && href.startsWith('/post/')) {
                                                    return (
                                                        <a
                                                            href={href}
                                                            className="text-accent-blue hover:text-accent-cyan transition-colors cursor-pointer"
                                                            {...props}
                                                        >
                                                            {children}
                                                        </a>
                                                    );
                                                }

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
                                <div className="mt-24 pt-12 border-t border-gray-800">
                                    <h2 className="text-3xl font-black mb-8 gradient-text">Continue Reading</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {post.subArticles.map((subArticle, index) => (
                                            <a
                                                key={index}
                                                href={`/post/${subArticle.slug}`}
                                                className="block p-6 rounded-2xl glass hover:bg-white/5 transition-all group border border-white/5"
                                            >
                                                <h3 className="text-xl font-bold mb-3 group-hover:text-accent-purple transition-colors">
                                                    {subArticle.title}
                                                </h3>
                                                {subArticle.date && (
                                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                                        {formatDate(subArticle.date)}
                                                    </p>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky TOC Column */}
                        <div className="hidden xl:block w-72">
                            <TableOfContents headings={post.headings || []} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BlogPost;
