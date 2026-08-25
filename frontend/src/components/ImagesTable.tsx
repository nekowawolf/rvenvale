"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { HiEllipsisVertical } from "react-icons/hi2";
import { FaTrash, FaCopy, FaCheck } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { createPortal } from "react-dom";
import { Image as ImageInterface } from "@/types/image";
import NextImage from "next/image";

interface ImagesTableProps {
  data: ImageInterface[];
  loading: boolean;
  error: string | null;
  onDelete?: (id: string) => Promise<void>;
}

function FallbackImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full bg-[var(--card-color2)] flex items-center justify-center text-muted text-xs">
        N/A
      </div>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      fill
      className={className}
      sizes="64px"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}

export default function ImagesTable({
  data,
  loading,
  error,
  onDelete,
}: ImagesTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      (item.filename?.toLowerCase() || "").includes(search.toLowerCase())
    );
  }, [search, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) range.push(i);
      if (currentPage < totalPages - 2) range.push("...");
      range.push(totalPages);
    }
    return range;
  };

  const handleOpenDropdown = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - 100,
    });
    setOpenDropdownIndex(index);
  };

  const handleDeleteClick = (id: string, filename: string) => {
    setSelectedId(id);
    setSelectedFilename(filename);
    setShowConfirmModal(true);
    setOpenDropdownIndex(null);
  };

  const confirmDelete = async () => {
    if (!selectedId || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(selectedId);
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
      setSelectedId(null);
      setSelectedFilename(null);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 w-4 h-4" />
        <input
          type="text"
          placeholder="Search images by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-[var(--border-divider)] bg-[var(--fill-color)] text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
        />
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-[var(--border-divider)] animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex justify-center items-center py-10 w-full">
          <div className="text-red-500 text-center py-4 px-6 bg-red-500/10 rounded-lg border border-red-500/20 w-full max-w-md">
            {error}
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl bg-[var(--fill-color)] border border-[var(--border-divider)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--card-color2)] border-b border-[var(--border-divider)]">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider min-w-[150px]">Filename</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider min-w-[80px]">Preview</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider min-w-[180px]">URL</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider min-w-[80px]">Size</th>
                {onDelete && (
                  <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider min-w-[60px]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="border-t border-[var(--border-divider)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    {/* Filename */}
                    <td className="px-4 py-4">
                      <span className="font-medium text-primary text-sm break-all">
                        {item.filename || "N/A"}
                      </span>
                    </td>

                    {/* Preview */}
                    <td className="px-4 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[var(--border-divider)]">
                        <FallbackImage
                          src={item.url}
                          alt={item.filename}
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* URL + Copy */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(item.url)}
                          className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex-shrink-0"
                          title="Copy URL"
                        >
                          {copiedUrl === item.url ? (
                            <FaCheck size={10} className="text-blue-600" />
                          ) : (
                            <FaCopy size={10} className="text-blue-600" />
                          )}
                          {copiedUrl === item.url ? "Copied!" : "Copy"}
                        </button>
                        <span className="text-muted text-xs hidden md:block truncate max-w-[140px]">
                          {item.url}
                        </span>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-4 py-4 text-secondary text-sm whitespace-nowrap">
                      {formatFileSize(item.size)}
                    </td>

                    {/* Actions */}
                    {onDelete && (
                      <td className="px-4 py-4 relative">
                        <button
                          onClick={(e) => handleOpenDropdown(e, index)}
                          className="cursor-pointer p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
                          disabled={!item._id}
                        >
                          <HiEllipsisVertical size={18} className="text-blue-600" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={onDelete ? 5 : 4} className="text-center py-12 text-muted">
                    {data.length === 0
                      ? "No images uploaded yet."
                      : "No images found matching your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dropdown Menu */}
      {openDropdownIndex !== null &&
        paginatedData[openDropdownIndex]?._id &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-30 w-36 dropdown-bg divide-y divide-[var(--border-divider)] rounded-lg shadow-lg border border-[var(--border-divider)]"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            <ul className="py-1 text-sm text-primary">
              <li>
                <button
                  onClick={() =>
                    handleDeleteClick(
                      paginatedData[openDropdownIndex]._id!,
                      paginatedData[openDropdownIndex].filename
                    )
                  }
                  className="cursor-pointer flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <FaTrash size={12} className="text-blue-600 mr-2" /> Delete
                </button>
              </li>
            </ul>
          </div>,
          document.body
        )}

      {/* Confirm Delete Modal */}
      {showConfirmModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-[var(--overlay-bg)] z-50 p-4">
            <div className="dropdown-bg rounded-xl shadow-xl p-6 max-w-sm w-full text-center border border-[var(--border-divider)]">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <FaTrash size={20} className="text-blue-600" />
              </div>
              <h3 className="text-primary text-lg font-semibold mb-2">Delete Image</h3>
              <p className="text-secondary text-sm mb-3">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <p className="text-primary text-sm font-medium bg-[var(--card-color2)] p-3 rounded-lg mb-6 break-all">
                {selectedFilename}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isDeleting}
                  className="cursor-pointer px-5 py-2 rounded-lg border border-[var(--border-divider)] hover:bg-[var(--hover-bg)] text-primary transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="cursor-pointer bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <>
          <Pagination className="flex justify-center mt-4">
            <PaginationContent className="flex flex-wrap justify-center gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {getPaginationRange().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis className="text-sm" />
                  ) : (
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(Number(page))}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer",
                        currentPage === page
                          ? "text-primary border border-[var(--border-divider)]"
                          : "text-secondary hover:bg-[var(--hover-bg)] hover:text-[var(--text-accent)]"
                      )}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer",
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-center text-xs text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} images
          </div>
        </>
      )}
    </div>
  );
}