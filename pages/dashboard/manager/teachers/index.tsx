import { useEffect, useState } from "react";
import { debounce, omitBy } from "lodash";
import { Table, Popconfirm, Space, Button, Input } from "antd";
import Link from "next/link";
import TextLink from "antd/lib/typography/Link";
import { PlusOutlined } from "@ant-design/icons";

import DashBoardLayout from "../../../../components/DashboardLayout";
import { Teacher, Paginator, Skill } from "../../../../lib/model";
import {
  deleteTeacher,
  getTeachers,
} from "../../../../lib/services/api-service";
import { ColumnsType } from "antd/lib/table";
import { businessAreas } from "../../../../lib/constant";
import ModalForm from "../../../../components/ModelForm";
import TeacherForm from "../../../../components/teacher/TeacherForm";

const Page = () => {
  const [pagination, setPagination] = useState<Paginator>({
    page: 1,
    limit: 20,
  });
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>(null);

  useEffect(() => {
    const reqParams = omitBy(
      {
        page: pagination.page,
        limit: pagination.limit,
        query: query,
      },
      (value) => !value
    );
    setLoading(true);
    getTeachers(reqParams).then((resp) => {
      setTotal(resp.total);
      setTeacherList(resp.teachers);
    });
    setLoading(false);
  }, [query, pagination]);

  const debounceSearchOnChange = debounce((value) => {
    setQuery(value);
  }, 1000);

  const renderAction = (value: any, record: Teacher, index: number) => {
    return (
      <Space size="middle">
        <TextLink
          onClick={() => {
            setSelectedTeacher(record);
            setModalVisible(true);
          }}
        >
          Edit
        </TextLink>
        <Popconfirm
          title="Are you sure to delete?"
          onConfirm={async () => {
            const response = await deleteTeacher(record.id);
            if (response) {
              const newTeacherList = [...teacherList];
              const index = teacherList.findIndex(
                (student) => student.id === record.id
              );
              newTeacherList.splice(index, 1);
              setTeacherList(newTeacherList);
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

  const columns: ColumnsType<Teacher> = [
    {
      key: "index",
      title: "No.",
      render: (value: any, record: Teacher, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["ascend", "descend"],
      sorter: (a: Teacher, b: Teacher) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
      // eslint-disable-next-line react/display-name
      render: (value: any, record: Teacher, index: number) => (
        <Link href={`/dashboard/manager/teachers/${record.id}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: "Area",
      dataIndex: "country",
      width: "10%",
      filters: businessAreas.map((item) => ({ text: item, value: item })),
      onFilter: (value: string, record: Teacher) =>
        record.country.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Skill",
      dataIndex: "skills",
      width: "25%",
      render: (skills: Skill[], record: Teacher, index: number) =>
        skills.map((skill) => skill.name).join(","),
    },
    {
      title: "Course Amount",
      dataIndex: "courseAmount",
    },
    {
      title: "Phone",
      dataIndex: "phone",
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
        <Input.Search
          placeholder="Search by name"
          allowClear
          onSearch={(value) => setQuery(value)}
          onChange={(e) => debounceSearchOnChange(e.target.value)}
          style={{ width: 400 }}
        />
      </div>
      <Table<Teacher>
        columns={columns}
        dataSource={teacherList}
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
      <ModalForm
        title={!!selectedTeacher ? "Edit Teacher" : "Add Teacher"}
        centered
        visible={modalVisible}
        cancel={() => {
          setModalVisible(false);
          setSelectedTeacher(null);
        }}
      >
        <TeacherForm
          teacher={selectedTeacher}
          onFinish={(updatedTeacher: Teacher) => {
            if (!!updatedTeacher) {
              const newTeacherList = [...teacherList];
              const index = teacherList.findIndex(
                (teacher) => teacher.id === updatedTeacher.id
              );
              console.log(index);
              if (index >= 0) {
                newTeacherList[index] = updatedTeacher;
              } else {
                newTeacherList.push(updatedTeacher);
                setTotal(total + 1);
              }
              setTeacherList(newTeacherList);
            }

            setModalVisible(false);
          }}
        />
      </ModalForm>
    </DashBoardLayout>
  );
};

export default Page;
