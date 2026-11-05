"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Inbox,
  AlertCircle,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  pageSize?: number;
  rowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
  headerActions?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Rechercher...",
  searchFilter,
  emptyMessage = "Aucun élément trouvé",
  emptySubMessage = "Essayez d'ajuster vos critères de recherche.",
  error = null,
  onRetry,
  pageSize = 10,
  rowKey,
  onRowClick,
  headerActions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtrage
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || !searchFilter) return data;
    return data.filter((item) => searchFilter(item, searchQuery.toLowerCase()));
  }, [data, searchQuery, searchFilter]);

  // Tri
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      const compare = aVal > bVal ? 1 : -1;
      return sortOrder === "asc" ? compare : -compare;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // État d'erreur strict (Règle 16)
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-8 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-neutral-900">
          Une erreur est survenue lors du chargement des données
        </h4>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn btn-outline btn-sm text-sm mt-2"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre d'outils supérieure */}
      {(searchFilter || headerActions) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {searchFilter ? (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full h-10 ps-10 pe-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm sm:text-base placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-colors"
              />
            </div>
          ) : (
            <div />
          )}

          {headerActions && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-600">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3.5 px-4 font-semibold uppercase tracking-wider text-sm ${
                      col.className || ""
                    }`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors cursor-pointer select-none"
                      >
                        <span>{col.header}</span>
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 text-neutral-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-neutral-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox className="w-8 h-8 text-neutral-300" />
                      <p className="font-semibold text-neutral-900 text-sm">
                        {emptyMessage}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {emptySubMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={rowKey(item)}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      onRowClick
                        ? "cursor-pointer hover:bg-neutral-50/80"
                        : "hover:bg-neutral-50/40"
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-3.5 px-4 ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(item)
                          : String(
                              (item as Record<string, unknown>)[col.key] ?? ""
                            )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {sortedData.length > pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200/80 bg-neutral-50/60 text-sm text-neutral-600">
            <span>
              Affichage de{" "}
              <strong className="text-neutral-900 font-semibold">
                {(currentPage - 1) * pageSize + 1}
              </strong>{" "}
              à{" "}
              <strong className="text-neutral-900 font-semibold">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </strong>{" "}
              sur{" "}
              <strong className="text-neutral-900 font-semibold">
                {sortedData.length}
              </strong>{" "}
              résultats
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Page suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
