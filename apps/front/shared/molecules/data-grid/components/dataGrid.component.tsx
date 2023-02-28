import useDataGridPresenter from './dataGrid.presenter'
import {
  Flex,
  Text,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Table,
} from '@chakra-ui/react'
import { flexRender } from '@tanstack/react-table'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[]
}

export default function DataGridComponent(props: Props) {
  const { data, columns } = props

  const { table } = useDataGridPresenter({
    data,
    columns,
  })

  // レンダリング対象のデータがない場合は返却
  if (!data) return

  return (
    <HStack spacing={0} h={'100%'}>
      <TableContainer maxH={'600px'} overflowY={'auto'}>
        <Table size={'sm'}>
          <Thead position={'sticky'} top={0} zIndex={2}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder && (
                      <HStack
                        cursor={'pointer'}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Text>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Text>
                      </HStack>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(0, table.getState().pagination.pageSize)
              .map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <Td key={cell.id}>
                      <Flex h={6} alignItems={'center'}>
                        <Text as={'div'} noOfLines={[1, 1]} w={'100%'}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Text>
                      </Flex>
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </HStack>
  )
}
