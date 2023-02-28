import DataGridComponent from '../components'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[]
}

export default function DataGridContainer(props: Props) {
  const { data, columns } = props

  return <DataGridComponent data={data} columns={columns} />
}
