import matter from 'gray-matter';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlogPost from '../components/BlogPost';

const PostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                // Dynamically import the markdown file
                const postModule = await import(`../content/posts/${slug}.md?raw`);
                const content = postModule.default;

                // Parse the markdown
                const { data, content: markdownContent } = matter(content);

                setPost({
                    title: data.title || 'Untitled',
                    date: data.date || new Date().toISOString().split('T')[0],
                    tags: data.tags || [],
                    excerpt: data.excerpt || '',
                    readTime: data.readTime || '5 min read',
                    content: markdownContent,
                    slug: slug
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
    }, [loading]);

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

    return <BlogPost post={post} onClose={() => navigate('/')} />;
};

export default PostPage;
