import { github } from "../config/socials";

const Hero = () => {

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-blue/20 to-accent-cyan/20"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                {github.avatar && (
                    <div className="mb-8">
                        <a
                            href={github.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <img
                                src={github.avatar}
                                alt={github.name}
                                className="w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300"
                            />
                        </a>
                        {github.name && (
                            <p className="mt-4 text-xl text-gray-300 font-medium">
                                Hi, I'm {github.name}
                            </p>
                        )}
                    </div>
                )}
                <h1 className="text-6xl md:text-8xl font-bold mb-6">
                    <span className="gradient-text">Technical Journal</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8" style={{ animationDelay: '0.2s' }}>
                    A place where I document my adventures
                </p>
                <div className="flex gap-4 justify-center">
                    <a
                        href="#posts"
                        className="glass glass-hover px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
                    >
                        Explore Posts
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <a href="#posts">
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce p-2">
                    <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </a>

        </section>
    );
};

export default Hero;
