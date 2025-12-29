import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  initialPageSize?: number;
  className?: string;
  /** If false, hide the built-in pagination controls (useful for server-side pagination) */
  showPagination?: boolean;
}

export default function TanstackTable<T>({
  data,
  columns,
  initialPageSize = 10,
  className,
  showPagination = true,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: initialPageSize } as any },
  });

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            {table.getHeaderGroups().map((hg: any) => (
              <tr key={hg.id} className="text-left text-neutral-500 border-b">
                {hg.headers.map((header: any) => (
                  <th key={header.id} className="py-3 px-2">
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: any) => (
              <tr key={row.id} className="border-t hover:bg-neutral-50">
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="py-3 px-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <div className="text-sm text-neutral-600">Page</div>
          <div className="inline-flex items-center gap-1">
            <button
              className="px-3 py-1 rounded hover:bg-neutral-100"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>
            <div className="px-3 py-1">
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </div>
            <button
              className="px-3 py-1 rounded hover:bg-neutral-100"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>

          <select
            className="ml-3 border rounded px-2 py-1 text-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
