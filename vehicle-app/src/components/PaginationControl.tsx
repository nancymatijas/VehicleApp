import React from 'react';
import '../styles/PaginationSort.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  totalCount?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

const PaginationControl: React.FC<PaginationProps> = ({
  page,
  pageSize,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  totalCount,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
}) => (
  <div className="pagination-control">
    <button
      type="button"
      onClick={onPrev}
      disabled={disablePrev}
      className="pagination-control__button"
    >
      Previous
    </button>
    <span className="pagination-control__page-info">
      {`Page ${page}`}
      {totalCount && ` of ${Math.ceil(totalCount / pageSize)}`}
    </span>
    <button
      type="button"
      onClick={onNext}
      disabled={disableNext}
      className="pagination-control__button"
    >
      Next
    </button>
    {onPageSizeChange && (
      <label htmlFor="pageSizeSelect" className="pagination-control__label">
        Items per page:
        <select
          id="pageSizeSelect"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="pagination-control__select"
        >
          {pageSizeOptions.map((ps) => (
            <option key={ps} value={ps}>
              {ps}
            </option>
          ))}
        </select>
      </label>
    )}
  </div>
);

export default PaginationControl;
