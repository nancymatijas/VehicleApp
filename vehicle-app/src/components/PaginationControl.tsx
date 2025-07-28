import React from 'react';

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
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
    <button onClick={onPrev} disabled={disablePrev}>
      Previous
    </button>
    <span>Page {page}{totalCount ? ` of ${Math.ceil(totalCount / pageSize)}` : ''}</span>
    <button onClick={onNext} disabled={disableNext}>
      Next
    </button>
    {onPageSizeChange && (
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        Items per page:
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map(ps => (
            <option key={ps} value={ps}>{ps}</option>
          ))}
        </select>
      </label>
    )}
  </div>
);

export default PaginationControl;
