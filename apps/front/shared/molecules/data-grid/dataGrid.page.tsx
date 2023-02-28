import DataGridContainer from './containers'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[]
}

export default function DataGrid(props: Props) {
  const { data, columns } = props

  return <DataGridContainer data={data} columns={columns} />
}
