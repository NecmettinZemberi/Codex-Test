'use client';

import { buildPageItems, pageSizeOptions } from '@/lib/pagination';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (value: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
}: PaginationControlsProps) {
  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <div className="surface mt-6 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Sayfa {currentPage} / {totalPages} · Toplam {totalItems} parça
          </p>

          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <span>Listele</span>
            <select
              value={itemsPerPage}
              onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
              className="field-input h-9 w-24 py-1 text-sm normal-case tracking-normal"
              aria-label="Sayfada gösterilecek parça sayısı"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="button-secondary w-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Önceki
              </button>
              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="button-secondary w-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Sonraki
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {pageItems.map((item, index) =>
                item === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onPageChange(item)}
                    aria-current={currentPage === item ? 'page' : undefined}
                    className={
                      currentPage === item
                        ? 'inline-flex min-w-10 items-center justify-center rounded-lg border border-accent bg-accent px-3 py-2 text-sm font-semibold text-base'
                        : 'button-secondary min-w-10 px-3 py-2'
                    }
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
