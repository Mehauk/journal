import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SideNav = ({ fileTree, headings, currentSlug }) => {
    const navigate = useNavigate();
    const [expandedPaths, setExpandedPaths] = useState(new Set());

    // Auto-expand parents of current article
    useEffect(() => {
        if (currentSlug) {
            const pathsToExpand = new Set(expandedPaths);

            // Helper to find path of current slug in tree
            const findPathForSlug = (nodes, targetSlug, parents = []) => {
                for (const node of nodes) {
                    if (node.slug === targetSlug) {
                        return parents;
                    }
                    if (node.children) {
                        const found = findPathForSlug(node.children, targetSlug, [...parents, node.path]);
                        if (found) return found;
                    }
                }
                return null;
            };

            const parents = findPathForSlug(fileTree, currentSlug);
            if (parents) {
                parents.forEach(p => pathsToExpand.add(p));
                // Also expand the current node itself if it has children (it's a folder/article)
                // We'd need to know if the current slug maps to a node with children.
                // Re-traverse or just check:
                const findNode = (nodes, targetSlug) => {
                    for (const node of nodes) {
                        if (node.slug === targetSlug) return node;
                        if (node.children) {
                            const found = findNode(node.children, targetSlug);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                const currentNode = findNode(fileTree, currentSlug);
                if (currentNode && currentNode.children && currentNode.children.length > 0) {
                    pathsToExpand.add(currentNode.path);
                }

                setExpandedPaths(pathsToExpand);
            }
        }
    }, [currentSlug, fileTree]);


    const toggleExpand = (path, e) => {
        if (e) e.stopPropagation();
        setExpandedPaths(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    const renderTree = (node, depth = 0) => {
        const isCurrent = node.slug === currentSlug;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedPaths.has(node.path);

        // Indentation via margin
        const marginLeft = `${depth * 12}px`;

        return (
            <div key={node.path} className="mb-px">
                <div
                    className={`group flex items-center py-1.5 px-2 rounded-md transition-colors ${isCurrent
                        ? 'bg-accent-purple/10 text-accent-purple'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    style={{ marginLeft }}
                >
                    {/* Chevron Toggle */}
                    <button
                        onClick={(e) => hasChildren ? toggleExpand(node.path, e) : null}
                        className={`p-0.5 mr-1 rounded hover:bg-white/10 ${!hasChildren ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <svg
                            className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Label / Link */}
                    {node.slug ? (
                        <button
                            onClick={() => navigate(`/post/${node.slug}`)}
                            className="flex-1 text-left text-sm truncate"
                        >
                            {node.title || node.name}
                        </button>
                    ) : (
                        <span className="flex-1 text-sm font-medium truncate opacity-70">
                            {node.title || node.name}
                        </span>
                    )}
                </div>

                {/* Children / Headings Container */}
                {/* 
                   Logic: 
                   - If has children: Show children ONLY if expanded.
                   - If isCurrent: Show headings ALWAYS (part of "selected article content").
                   - Headings should appear *before* children? Or *after*? 
                     Usually nested files are "inside" the folder. 
                     The article content (headings) is "inside" the file.
                     If a node is BOTH file and folder:
                       - It displays its headings (content structure).
                       - Then it displays its nested files (sub-structure).
                */}

                {(isExpanded || (isCurrent && headings && headings.length > 0)) && (
                    <div className="border-l border-gray-800 ml-[15px]">
                        {/* 1. Headings (Only if this is the current active article) */}
                        {isCurrent && headings && headings.length > 0 && (
                            <div className="p-1 ">
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
                                        className="block py-1 px-3 text-xs text-gray-500 hover:text-accent-cyan transition-colors truncate border-l-2 border-transparent hover:border-gray-700"
                                        style={{ paddingLeft: `${12 + (heading.level - 2) * 8}px` }}
                                    >
                                        {heading.text}
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* 2. Children (Only if expanded) */}
                        {hasChildren && isExpanded && (
                            <div>
                                {node.children.map(child => renderTree(child, 0))}
                            </div>
                        )}
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
