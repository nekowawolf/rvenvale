"use client";

import { useState, useRef } from "react";
import { FiUploadCloud, FiX, FiCheckCircle } from "react-icons/fi";
import { uploadImage } from "@/services/imageService";

interface UploadAreaProps {
  onUploadSuccess: () => void;
}

export default function UploadArea({ onUploadSuccess }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setSuccessMsg(null);
    
    // Validasi basic
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WebP, etc).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      await uploadImage(file);
      setSuccessMsg("Image successfully uploaded and processed to CDN!");
      onUploadSuccess(); // Trigger refetch
      if (inputRef.current) inputRef.current.value = ""; // Reset input
    } catch (err: any) {
      const msg = err.message || "Failed to upload image. Please try again.";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError("This is a live preview. Please clone the project and self-host to upload images.");
      } else {
        setError(msg);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-[var(--fill-color)] border border-[var(--border-divider)] rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary">Upload Image</h2>
        <p className="text-sm text-secondary mt-1">
          Drag and drop your image here, or click to browse. Automatically converts to WebP.
        </p>
      </div>

      <div
        className={`relative w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-500/5"
            : "border-[var(--border-divider)] hover:border-blue-400 hover:bg-[var(--hover-bg)]"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />
        
        <div className="bg-blue-500/10 p-3 rounded-full mb-3 text-blue-500">
          <FiUploadCloud size={28} />
        </div>
        
        {isUploading ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Uploading & Processing...</p>
            <p className="text-xs text-muted">Sending to MongoDB and GitHub CDN</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">
              <span className="text-blue-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted">SVG, PNG, JPG, GIF or WebP (max. 10MB)</p>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <FiX className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
          <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-green-500">{successMsg}</p>
        </div>
      )}
    </div>
  );
}
