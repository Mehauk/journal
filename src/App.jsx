import matter from 'gray-matter';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import BlogCard from './components/BlogCard';
import Hero from './components/Hero';
import './index.css';
import PostPage from './pages/PostPage';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    // Load all markdown posts
    const loadPosts = async () => {
      const postModules = import.meta.glob('./content/posts/*.md', { query: '?raw', import: 'default' });
      const loadedPosts = [];

      for (const path in postModules) {
        const content = await postModules[path]();
        const post = parseMarkdown(content, path);
        loadedPosts.push(post);
      }

      // Sort by date (newest first)
      loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(loadedPosts);
    };

    loadPosts();
  }, []);

  const parseMarkdown = (rawContent, path) => {
    try {
      // Use gray-matter to parse front matter
      const { data, content } = matter(rawContent);

      return {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        readTime: data.readTime || '5 min read',
        content: content,
        slug: path.split('/').pop().replace('.md', '')
      };
    } catch (error) {
      console.error('Error parsing markdown:', error, path);
      return {
        title: 'Untitled',
        date: new Date().toISOString().split('T')[0],
        content: rawContent,
        slug: path.split('/').pop().replace('.md', '')
      };
    }
  };

  // Get all unique tags
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Posts section */}
      <section id="posts" className="max-w-7xl mx-auto px-6 py-20">
        {/* Search and filters */}
        <div className="mb-12">
          <div className="glass rounded-2xl p-6 mb-6">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-lg placeholder-gray-500"
            />
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${!selectedTag
                ? 'bg-accent-purple text-white'
                : 'glass glass-hover text-gray-300'
                }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${selectedTag === tag
                  ? 'bg-accent-purple text-white'
                  : 'glass glass-hover text-gray-300'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.slug}
                post={post}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No posts found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:slug" element={<PostPage />} />
    </Routes>
  );
}

export default App;
