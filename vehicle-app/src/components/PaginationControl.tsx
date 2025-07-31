import React from 'react';
import '../styles/PaginationSort.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
  <div className="pagination-control__navigation">
    <button
      type="button"
      onClick={onPrev}
      disabled={disablePrev}
      className="pagination-control__button"
    >
      <IoIosArrowBack />
    </button>
    <span className="pagination-control__page-info">
      {`${page}`}
      {totalCount && ` of ${Math.ceil(totalCount / pageSize)}`}
    </span>
    <button
      type="button"
      onClick={onNext}
      disabled={disableNext}
      className="pagination-control__button"
    >
      <IoIosArrowForward />
    </button>
  </div>
  {onPageSizeChange && (
    <div className="pagination-control__page-size">
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
    </div>
  )}
</div>

);

export default PaginationControl;
