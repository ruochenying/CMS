import React, { useState, useEffect } from "react";
import { debounce, omitBy } from "lodash";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { Table, Popconfirm, Space, Button, Input } from "antd";
import TextLink from "antd/lib/typography/Link";
import { ColumnsType } from "antd/es/table";
import { formatDistanceToNow } from "date-fns";
import { Student, CourseShort, StudentType } from "../../../../lib/model";
import DashBoardLayout from "../../../../components/DashboardLayout";
import {
  getStudents,
  deleteStudent,
} from "../../../../lib/services/api-service";
import StudentForm from "../../../../components/student/StudentForm";
import ModalForm from "../../../../components/ModelForm";

const businessAreas = ["China", "New Zealand", "Canada", "Australia"];
const Pagination = { current: 1, pageSize: 20 };

const Page = () => {
  const [pagination, setPagination] = useState(Pagination);
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>();
  const [selectedStudent, setSelectedStudent] = useState<Student>(null);
  const [studentList, setStudentList] = useState<Student[]>();

  const { Search } = Input;

  useEffect(() => {
    const reqParams = omitBy(
      {
        limit: pagination.pageSize,
        page: pagination.current,
        query: query,
      },
      (value) => !value
    );
    setLoading(true);
    getStudents(reqParams).then((resp) => {
      setTotal(resp.total);

      setStudentList(resp.students);
    });
    setLoading(false);
  }, [query, pagination]);

  const cancel = () => {
    setModalVisible(false);
    setSelectedStudent(null);
  };

  const renderAction = (value: any, record: Student, index: number) => {
    return (
      <Space size="middle">
        <TextLink
          onClick={() => {
            setSelectedStudent(record);
            setModalVisible(true);
          }}
        >
          Edit
        </TextLink>
        <Popconfirm
          title="Are you sure to delete?"
          onConfirm={async () => {
            const response = await deleteStudent(record.id);
            if (response) {
              const newStudentList = [...studentList];
              const index = studentList.findIndex(
                (student) => student.id === record.id
              );
              newStudentList.splice(index, 1);
              setStudentList(newStudentList);
              setTotal(total - 1);
            }
          }}
          okText="Confirm"
          cancelText="Cancel"
        >
          <TextLink>Delete</TextLink>
        </Popconfirm>
      </Space>
    );
  };

  const debounceSearchOnChange = debounce((value) => {
    setQuery(value);
  }, 1000);

  const columns: ColumnsType<Student> = [
    {
      key: "index",
      title: "No.",
      render: (value: any, record: Student, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["ascend", "descend"],
      sorter: (a: Student, b: Student) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
      // eslint-disable-next-line react/display-name
      render: (value: any, record: Student, index: number) => (
        <Link href={`/dashboard/manager/students/${record.id}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: "Area",
      dataIndex: "country",

      filters: businessAreas.map((item) => ({ text: item, value: item })),
      onFilter: (value: string, record: Student) =>
        record.country.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      render: (courses: CourseShort[], record: Student, index: number) =>
        courses.map((course) => course.name).join(","),
    },
    {
      title: "Student Type",
      dataIndex: "type",
      render: (type: StudentType, record: Student, index: number) => type?.name,
      filters: [
        { text: "developer", value: "developer" },
        { text: "tester", value: "tester" },
      ],
      onFilter: (value: string, record: Student) =>
        record.type.name.includes(value),
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (time: string, record: Student, index: number) =>
        formatDistanceToNow(new Date(time), { addSuffix: true }),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  return (
    <DashBoardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 20 }}
          onClick={() => {
            setModalVisible(true);
          }}
        >
          Add
        </Button>
        <Search
          placeholder="Search by name"
          allowClear
          onSearch={(value) => setQuery(value)}
          onChange={(e) => debounceSearchOnChange(e.target.value)}
          style={{ width: 400 }}
        />
      </div>

      <Table<Student>
        columns={columns}
        dataSource={studentList}
        rowKey={(record) => record.id}
        pagination={{ ...pagination, total: total, showSizeChanger: true }}
        loading={loading}
        onChange={({ current, pageSize }) => {
          setPagination({
            ...pagination,
            current: current,
            pageSize: pageSize,
          });
        }}
      />
      <ModalForm
        title={!!selectedStudent ? "Edit Student" : "Add Student"}
        centered
        visible={modalVisible}
        cancel={cancel}
      >
        <StudentForm
          student={selectedStudent}
          onFinish={(updatedStudent: Student) => {
            if (!!updatedStudent) {
              const newStudentList = [...studentList];
              const index = studentList.findIndex(
                (student) => student.id === updatedStudent.id
              );
              if (index >= 0) {
                newStudentList[index] = updatedStudent;
              } else {
                newStudentList.push(updatedStudent);
                setTotal(total + 1);
              }
              setStudentList(newStudentList);
            }

            setModalVisible(false);
          }}
        />
      </ModalForm>
    </DashBoardLayout>
  );
};

export default Page;
