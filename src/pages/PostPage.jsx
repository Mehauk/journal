import matter from 'gray-matter';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BlogPost from '../components/BlogPost';

const PostPage = () => {
    const location = useLocation();
    const slug = location.pathname.replace('/post/', '');

    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setPost(null);

        const loadPost = async () => {
            try {
                // Load all posts
                const postModules = import.meta.glob('../content/posts/**/*.md', { query: '?raw', import: 'default' });

                const fileTree = [];
                const headings = [];
                let foundContent = null;
                const subArticlesList = [];
                const ancestors = [];

                // Helper to insert into tree
                const insertIntoTree = (tree, parts, data, fullSlug, parentSlug = '') => {
                    if (parts.length === 0) return;

                    const part = parts[0];
                    const isLastPart = parts.length === 1;

                    // Generate slug for this node
                    const currentPartSlug = part.replaceAll(' ', '-');
                    const nodeSlug = parentSlug ? `${parentSlug}/${currentPartSlug}` : currentPartSlug;

                    let node = tree.find(n => n.name === part);

                    if (!node) {
                        node = {
                            name: part,
                            title: isLastPart ? (data.title || part) : part,
                            path: parts.join('/'), // This path isn't really used for logic, just debug/key
                            type: isLastPart ? 'file' : 'folder',
                            children: [],
                            slug: nodeSlug // Always assign a slug so it can be navigated to (Virtual Post)
                        };
                        tree.push(node);
                    }

                    if (isLastPart) {
                        // It's a file, treat as content node
                        // If logic was perfect, nodeSlug should match strictly generated fullSlug, 
                        // but let's blindly trust the file's strict slug for the leaf to be safe.
                        node.slug = fullSlug;
                        node.title = data.title || node.title;
                        node.type = 'file';
                    } else {
                        // It's a folder in this context
                        insertIntoTree(node.children, parts.slice(1), data, fullSlug, nodeSlug);
                    }
                };

                for (const path in postModules) {
                    try {
                        // Extract slug from path
                        const postSlug = path
                            .replace('../content/posts/', '')
                            .replace('.md', '')
                            .replaceAll(' ', '-');

                        // Build Tree Node
                        const rawPathParts = path.replace('../content/posts/', '').replace('.md', '').split('/');
                        const content = await postModules[path](); // We need content for title
                        const { data } = matter(content);

                        insertIntoTree(fileTree, rawPathParts, data, postSlug);

                        // Check if this is the main post
                        if (postSlug.toLowerCase() === slug.toLowerCase()) {
                            foundContent = content; // content is already awaited above
                        }

                        // Check if this is an ancestor
                        if (slug.toLowerCase().startsWith(postSlug.toLowerCase() + '/')) {
                            ancestors.push({
                                title: data.title || 'Untitled',
                                slug: postSlug
                            });
                        }

                        // Check if this is a sub-article
                        if (postSlug.toLowerCase().startsWith(slug.toLowerCase() + '/') &&
                            !postSlug.slice(slug.length + 1).includes('/')) {

                            subArticlesList.push({
                                title: data.title || 'Untitled',
                                slug: postSlug,
                                date: data.date
                            });
                        }
                    } catch (e) {
                        console.error("Error processing file:", path, e);
                    }
                }

                let postData = {};
                let markdownContent = '';

                if (foundContent) {
                    const result = matter(foundContent);
                    postData = result.data;
                    markdownContent = result.content;
                } else if (subArticlesList.length > 0) {
                    // Virtual Post
                    const virtualTitle = slug.split('/').pop().replace(/-/g, ' ');
                    postData = {
                        title: virtualTitle.charAt(0).toUpperCase() + virtualTitle.slice(1),
                        isVirtual: true // Flag to indicate this is a folder listing
                    };
                    markdownContent = ''; // No content for virtual posts
                } else {
                    throw new Error('Post not found');
                }

                // Extract headings
                // First strip code blocks to avoid matching comments as headings
                const contentForHeadings = markdownContent.replace(/^```[\s\S]*?^```/gm, '');

                const headingRegex = /^(#{1,6})\s+(.*)$/gm;
                let match;
                while ((match = headingRegex.exec(contentForHeadings)) !== null) {
                    headings.push({
                        level: match[1].length,
                        text: match[2],
                        id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    });
                }

                // Sort ancestors
                ancestors.sort((a, b) => a.slug.length - b.slug.length);

                const breadcrumbs = [
                    { label: 'Home', path: '/' },
                    ...ancestors.map(a => ({ label: a.title, path: `/post/${a.slug}` })),
                    { label: postData.title || 'Untitled', path: null }
                ];

                setPost({
                    title: postData.title || 'Untitled',
                    date: postData.date || new Date().toISOString().split('T')[0],
                    tags: postData.tags || [],
                    excerpt: postData.excerpt || '',
                    readTime: postData.readTime || (foundContent ? '5 min read' : ''),
                    content: markdownContent,
                    slug: slug,
                    subArticles: subArticlesList,
                    breadcrumbs: breadcrumbs,
                    fileTree: fileTree,
                    headings: headings,
                    isVirtual: postData.isVirtual || false
                });
                setLoading(false);
            } catch (error) {
                console.error('Error loading post:', error);
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    // Scroll to heading if URL has a fragment
    useEffect(() => {
        if (!loading && window.location.hash) {
            const headingId = window.location.hash.slice(1);
            setTimeout(() => {
                const element = document.getElementById(headingId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [loading, window.location.hash]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-400">Post not found</div>
            </div>
        );
    }

    return <BlogPost post={post} />;
};

export default PostPage;
