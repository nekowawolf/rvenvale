import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[var(--body-color)] flex flex-col justify-between mt-12 sm:min-h-[50vh] lg:mt-16">
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-8 pb-20 sm:pt-10 sm:pb-8 mt-auto flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
        {/* Left — copyright & info */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-fill-color text-secondary">
          <span>© 2026 Rvenvale</span>
          <span className="text-muted">·</span>
          <span className="text-muted">Powered by</span>
          <a
            href="https://www.nekowawolf.xyz/ecosystem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 transition-colors font-medium relative group"
          >
            Nww Ecosystem
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        {/* Right — contribute */}
        <div className="flex shrink-0">
          <a
            href="https://github.com/nekowawolf/rvenvale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-full border border-[var(--border-divider)] bg-[var(--card-color)] text-primary hover:bg-[var(--hover-bg)] hover:border-blue-500/40 transition-all duration-300 shadow-sm backdrop-blur-sm"
          >
            <FaGithub size={18} className="text-blue-600" />
            Contribute on GitHub
          </a>
        </div>
      </div>

      {/* Giant Wordmark Section */}
      <div className="relative w-full h-[10vw] min-h-[50px] sm:h-[14vw] sm:min-h-[100px] max-h-[320px] mt-auto">

        {/* Blue Glow */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[80%] bg-blue-600/50 blur-[60px] md:blur-[100px] rounded-[100%] z-0 pointer-events-none" />

        {/* The Wordmark */}
        <div className="absolute inset-0 left-1/2 w-screen -translate-x-1/2 flex items-end justify-center pointer-events-none select-none">
          <span
            className="font-black text-center leading-[0.75] uppercase whitespace-nowrap text-fill-color max-sm:mb-[0.3em] sm:mb-[-0.05em]"
            style={{
              fontSize: 'clamp(2rem, 18.5vw, 40rem)',
              letterSpacing: '-0.04em',
              backgroundImage: 'linear-gradient(to bottom, var(--text-primary) 10%, transparent 98%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 95%)',
              maskImage: 'linear-gradient(to bottom, black 10%, transparent 95%)',
            }}
          >
            RVENVALE
          </span>
        </div>
      </div>
    </footer>
  );
}