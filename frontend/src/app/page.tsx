"use client";

import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import UploadFlow from "@/components/UploadFlow";
import UploadArea from "@/components/UploadArea";
import StatCard from "@/components/StatCard";
import ImagesTable from "@/components/ImagesTable";
import { useImageData } from "@/hooks/useImageData";
import { useImageStats } from "@/hooks/useImageStats";
import { FaImage, FaDatabase, FaGithub } from "react-icons/fa";

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function HomePage() {
  const { data, loading: imagesLoading, error: imagesError, handleDelete, refetch: refetchImages } = useImageData();
  const { stats, loading: statsLoading, refetch: refetchStats } = useImageStats();

  const handleUploadSuccess = () => {
    refetchImages();
    refetchStats();
  };

  const handleDeleteWithStats = async (id: string) => {
    await handleDelete(id);
    refetchStats();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">

        {/* ===== HERO SECTION ===== */}
        <section className="space-y-8">
          {/* Logo + Name + Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src="https://cdn.nekowawolf.xyz/image/2026/1787617116_rvenvale.webp"
                alt="rvenvale logo"
                fill
                className="object-contain rounded-xl"
                unoptimized
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
              Rvenvale
            </span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight tracking-tight">
              Open-Source Self-Hosted{" "}
              <br className="hidden sm:block" />
              <span className="text-blue-600">
                GitHub CDN
              </span>{" "}
              for Image Hosting
            </h1>
            <p className="text-base sm:text-lg text-secondary max-w-2xl leading-relaxed">
              Rvenvale is a self-hosted image hosting platform that transforms, optimizes, and delivers your images through GitHub's CDN.{" "}
              <a
                href="https://github.com/nekowawolf/rvenvale"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                Clone this project <FaGithub size={16} />
              </a>
            </p>
          </div>
          
          <div className="w-full mt-10">
            <UploadFlow />
          </div>
        </section>

        {/* ===== UPLOAD SECTION ===== */}
        <section className="mb-6">
          <UploadArea onUploadSuccess={handleUploadSuccess} />
        </section>

        {/* ===== ANALYTICS SECTION ===== */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Analytics</h2>
            <p className="text-sm text-secondary mt-0.5">Overview of hosted image resources</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Total Images"
              value={stats?.total_images ?? 0}
              icon={<FaImage className="text-blue-600" />}
              loading={statsLoading}
              description="Uploaded images in the CDN"
            />
            <StatCard
              title="Total Storage"
              value={formatFileSize(stats?.total_size ?? 0)}
              icon={<FaDatabase className="text-blue-600" />}
              loading={statsLoading}
              description="Total size of all hosted images"
            />
          </div>
        </section>

        {/* ===== IMAGES TABLE SECTION ===== */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Image Library</h2>
            <p className="text-sm text-secondary mt-0.5">
              Browse and copy URLs of all hosted images
            </p>
          </div>
          <ImagesTable
            data={data}
            loading={imagesLoading}
            error={imagesError}
            onDelete={handleDeleteWithStats}
          />
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="w-full border-t border-[var(--border-divider)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left — copyright */}
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span>© 2026 Rvenvale</span>
            <span className="text-muted">·</span>
            <span className="text-muted">Powered by</span>
            <a
              href="https://www.nekowawolf.xyz/ecosystem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
            >
              Nww Ecosystem
            </a>
          </div>

          {/* Right — contribute */}
          <a
            href="https://github.com/nekowawolf/rvenvale"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border-divider)] bg-[var(--fill-color)] text-primary hover:bg-[var(--hover-bg)] hover:border-indigo-500/40 transition-all duration-200"
          >
            <FaGithub size={15} className="text-blue-600" />
            Contribute on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}