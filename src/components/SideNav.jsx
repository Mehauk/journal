import { useEffect, useState } from 'react';

const SideNav = ({ fileTree, currentSlug, isOpen, onClose }) => {
    const [expandedPaths, setExpandedPaths] = useState(new Set());

    // Auto-expand parents of current article
    useEffect(() => {
        if (currentSlug) {
            const pathsToExpand = new Set(expandedPaths);

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

        const marginLeft = `${depth * 12}px`;

        return (
            <div key={node.path} className="mb-px">
                <a
                    href={`/post/${node.slug}`}
                    className={`group flex items-center py-1.5 px-2 rounded-md transition-colors ${isCurrent
                        ? 'bg-accent-purple/10 text-accent-purple'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    style={{ marginLeft }}
                >
                    <button
                        className={`p-0.5 mr-1 rounded hover:bg-white/10 ${!hasChildren ? 'hidden pointer-events-none' : ''}`}
                    >
                        <svg
                            className={`w-3 h-3 ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <p
                        className="flex-1 text-left text-sm truncate"
                    >
                        {node.title || node.name}
                    </p>
                </a>

                {hasChildren && isExpanded && (
                    <div className="border-l border-gray-800 ml-[15px]">
                        {node.children.map(child => renderTree(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-dark border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col py-8 px-4 overflow-y-auto custom-scrollbar">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 px-2 tracking-widest">EXPLORER</h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white lg:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-1">
                        {fileTree.map(node => renderTree(node))}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideNav;
