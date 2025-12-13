import { useNavigate } from 'react-router-dom';

const SideNav = ({ fileTree, headings, currentSlug }) => {
    const navigate = useNavigate();

    const renderTree = (node, depth = 0) => {
        const isCurrent = node.slug === currentSlug;
        const hasChildren = node.children && node.children.length > 0;
        const paddingLeft = `${depth * 16}px`;

        return (
            <div key={node.path} className="mb-1">
                <div style={{ paddingLeft }}>
                    {node.slug ? (
                        <button
                            onClick={() => navigate(`/post/${node.slug}`)}
                            className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-all border border-transparent ${isCurrent
                                    ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="truncate block">{node.title || node.name}</span>
                        </button>
                    ) : (
                        <div
                            className="px-3 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider"
                        >
                            {node.title || node.name}
                        </div>
                    )}

                    {/* Render headings if this is the current file */}
                    {isCurrent && headings && headings.length > 0 && (
                        <div className="mt-1 mb-2 ml-3 border-l border-gray-800 pl-3">
                            {headings.map((heading, index) => (
                                <a
                                    key={index}
                                    href={`#${heading.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.getElementById(heading.id);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                            window.history.pushState(null, '', `#${heading.id}`);
                                        }
                                    }}
                                    className="block py-1 text-xs text-gray-500 hover:text-accent-cyan transition-colors truncate"
                                >
                                    {heading.text}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Render children if any */}
                {hasChildren && (
                    <div>
                        {node.children.map(child => renderTree(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="h-screen sticky top-0 overflow-y-auto py-8 px-4 border-r border-gray-800 custom-scrollbar">
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 mb-4 px-2">EXPLORER</h3>
                <div className="space-y-1">
                    {fileTree.map(node => renderTree(node))}
                </div>
            </div>
        </aside>
    );
};

export default SideNav;
