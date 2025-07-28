import React from 'react';

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
    <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1} cellPadding={8}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} style={{ width: col.width }}>{col.header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <tr key={row.id}>
              {columns.map((col, idx) => {
                const value = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
                return <td key={idx}>{renderCellValue(value)}</td>;
              })}
              <td>
                <button onClick={() => onEdit(row)} disabled={editDisabled}>Edit</button>{' '}
                <button onClick={() => onDelete(row.id)} disabled={deleteDisabled} style={{ color: 'red' }}>Delete</button>
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
