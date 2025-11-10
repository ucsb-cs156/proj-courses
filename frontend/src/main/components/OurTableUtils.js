export function convertOldStyleColumnsToNewStyle(oldStyleColumns) {
  const result = [];
  for (const col of oldStyleColumns) {
    const newCol = {
      id: col.accessor || col.accessorKey, // Use accessor or accessorKey as id
      header: col.Header || col.header, // Use Header or header for the column title
      accessorKey: col.accessor || col.accessorKey, // Use accessor or accessorKey
      ...col,
    };
    result.push({ ...newCol });
  }
  return result;
}
