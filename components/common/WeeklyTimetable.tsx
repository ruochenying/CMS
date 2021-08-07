import Table, { ColumnsType } from "antd/lib/table";

interface weeklyClassTimetableProps {
  data: string[];
}

const WeeklyClassTimetable = ({ data }: weeklyClassTimetableProps) => {
  if (!data) {
    return <></>;
  }
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const target = weekday.map((title) => {
    return (
      data.find((item) =>
        item.toLocaleLowerCase().includes(title.toLocaleLowerCase())
      ) || title
    );
  });
  const dataSource = [{}];
  target.forEach((item) => {
    Object.assign(dataSource[0], { [item.split(" ")[0]]: item.split(" ")[1] });
  });

  const columns: ColumnsType = [
    {
      title: "Sunday",
      dataIndex: "Sunday",
      align: "center",
    },
    {
      title: "Monday",
      dataIndex: "Monday",
      align: "center",
    },
    {
      title: "Tuesday",
      dataIndex: "Tuesday",
      align: "center",
    },
    {
      title: "Wednesday",
      dataIndex: "Wednesday",
      align: "center",
    },
    {
      title: "Thursday",
      dataIndex: "Thursday",
      align: "center",
    },
    {
      title: "Friday",
      dataIndex: "Friday",
      align: "center",
    },
    {
      title: "Saturday",
      dataIndex: "Saturday",
      align: "center",
    },
  ];
  return (
    <Table
      rowKey="id"
      bordered
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
    ></Table>
  );
};

export default WeeklyClassTimetable;
