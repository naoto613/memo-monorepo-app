import { useMemo, useState } from 'react'
import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[]
}

const useDataGridPresenter = (props: Props) => {
  const { data, columns } = props

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnPinning, setColumnPinning] = useState({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnPinning,
      expanded,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSubRows: (row: any) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useMemo(() => {
    table.setPageSize(100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    table,
  }
}

export default useDataGridPresenter
