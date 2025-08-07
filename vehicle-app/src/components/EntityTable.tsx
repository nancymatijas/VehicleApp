import React from 'react';
import '../styles/EntityTable.css';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string | number;
}

interface EntityTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
}

function renderCellValue(value: unknown): React.ReactNode {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value) ||
    value === null ||
    value === undefined
  ) {
    return value;
  }
  return String(value);
}

function EntityTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  editDisabled = false,
  deleteDisabled = false,
}: EntityTableProps<T>) {
  return (
    <table className="entity-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={typeof col.accessor === 'string' ? col.accessor : undefined}>
              {col.header}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <tr key={row.id}>
              {columns.map((col, colIndex) => {
                const value = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
                const key = typeof col.accessor === 'string' ? col.accessor : colIndex;
                return (
                  <td key={key} data-label={col.header}>
                    {renderCellValue(value)}
                  </td>
                );
              })}
              <td data-label="Actions">
                <button
                  onClick={() => onEdit(row)}
                  disabled={editDisabled}
                  aria-label={`Edit item with ID ${row.id}`}
                  className="btn-edit"
                >
                  Edit
                </button>{' '}
                <button
                  onClick={() => onDelete(row.id)}
                  disabled={deleteDisabled}
                  aria-label={`Delete item with ID ${row.id}`}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1}>
              No records
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default EntityTable;
