import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="btn-saas btn-secondary !h-9 text-xs"
      >
        Prev
      </button>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="btn-saas btn-primary !h-9 text-xs"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
