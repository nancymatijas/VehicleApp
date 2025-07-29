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
            <th key={typeof col.accessor === 'string' ? col.accessor : undefined} style={{ width: col.width }}>
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
              {columns.map((col) => {
                const value =
                  typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : row[col.accessor];
                return (
                  <td key={typeof col.accessor === 'string' ? col.accessor : undefined}>
                    {renderCellValue(value)}
                  </td>
                );
              })}
              <td>
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
            <td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
              No records
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default EntityTable;
