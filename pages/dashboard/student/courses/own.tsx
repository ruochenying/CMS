import React, { useEffect, useState } from "react";
import { debounce, omitBy } from "lodash";
import { SearchOutlined } from "@ant-design/icons";

import DashBoardLayout from "../../../../components/DashboardLayout";
import { getStudentOwnCourses } from "../../../../lib/services/api-service";
import storage from "../../../../lib/services/storage";
import { CourseRequest, Paginator, StudentCourse } from "../../../../lib/model";
import { Col, Input, Row, Select, Tag } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import Link from "next/link";
import {
  CourseStatusColor,
  CourseStatusText,
} from "../../../../lib/constant/course";
import { DurationUnit } from "../../../../lib/constant";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [searchBy, setSearchBy] = useState<"name" | "type">("name");
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<Paginator>({
    page: 1,
    limit: 20,
  });
  const [studentCourse, setStudentCourse] = useState<StudentCourse[]>([]);

  const renderStatusTag = (status: number) => {
    return (
      <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
    );
  };

  const columns: ColumnsType<StudentCourse> = [
    {
      key: "index",
      title: "No.",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Course Name",
      dataIndex: ["course", "name"],
      sortDirections: ["ascend", "descend"],
      sorter: (a: StudentCourse, b: StudentCourse) =>
        a.course.name > b.course.name
          ? 1
          : b.course.name > a.course.name
          ? -1
          : 0,
      // eslint-disable-next-line react/display-name
      render: (_, record: StudentCourse) => (
        <Link href={`/dashboard/manager/teachers/${record.id}`}>
          {record.course.name}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: ["course", "status"],
      render: renderStatusTag,
    },
    {
      title: "Duration",
      dataIndex: ["course", "duration"],
      render: (value, record: StudentCourse) =>
        `${value} ${DurationUnit[record.course.durationUnit]}`,
    },
    {
      title: "Course Start",
      dataIndex: ["course", "startTime"],
    },
    {
      title: "Category",
      dataIndex: ["course", "typeName"],
    },

    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (time: string) =>
        formatDistanceToNow(new Date(time), { addSuffix: true }),
    },
  ];

  useEffect(() => {
    const reqParams = omitBy(
      {
        page: pagination.page,
        limit: pagination.limit,
        userId: storage.userId,
        [searchBy]: query,
      },
      (value: CourseRequest) => !value
    );

    getStudentOwnCourses(reqParams).then((resp) => {
      if (resp) {
        setLoading(true);

        setTotal(resp.total);
        setStudentCourse(resp.courses);
        setLoading(false);
      }
    });
  }, [pagination, query, searchBy]);

  const debounceSearchOnChange = debounce((value) => {
    setQuery(value);
  }, 1000);
  return (
    <DashBoardLayout>
      <Row gutter={[20, 6]}>
        <Col>
          <Input.Search
            addonBefore={
              <Select
                defaultValue="name"
                onChange={(value: "name" | "type") => setSearchBy(value)}
              >
                <Select.Option value="name">Name</Select.Option>
                <Select.Option value="type">Category</Select.Option>
              </Select>
            }
            placeholder={`Search by ${searchBy}`}
            onSearch={(value) => setQuery(value)}
            onChange={(e) => debounceSearchOnChange(e.target.value)}
          />
        </Col>
      </Row>
      <div style={{ margin: "20px 0px" }} />
      <Table<StudentCourse>
        columns={columns}
        dataSource={studentCourse}
        rowKey={(record) => record.id}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={({ current, pageSize }) => {
          setPagination({
            ...pagination,
            page: current,
            limit: pageSize,
          });
        }}
      />
    </DashBoardLayout>
  );
};

export default Dashboard;
