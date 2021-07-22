import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tabs, Tag } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Table, { ColumnType } from "antd/lib/table";
import DashboardLayout from "../../../../components/DashboardLayout";
import {
  StudentWithProfile,
  Course,
  programLanguageColors,
  BaseType,
} from "../../../../lib/model";
import { getStudentById } from "../../../../lib/services/api-service";

const style = {
  color: "#7356f1",
  fontSize: 24,
  marginTop: 20,
  marginBottom: 20,
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [studentWithProfile, setStudentWithProfile] =
    useState<StudentWithProfile>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  );
  const [about, setAbout] = useState<
    { label: string; value: string | number }[]
  >([]);

  const columns: ColumnType<Course>[] = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: BaseType[]) => type.map((item) => item.name).join(","),
    },
    {
      title: "Join Time",
      dataIndex: "ctime",
    },
  ];

  useEffect(() => {
    const studentId = +id;
    getStudentById(studentId).then((resp) => {
      const info = [
        { label: "Name", value: resp.name },
        { label: "Age", value: resp.age },
        { label: "Email", value: resp.email },
        { label: "Phone", value: resp.phone },
      ];
      const about = [
        { label: "Eduction", value: resp.education },
        { label: "Area", value: resp.country },
        { label: "Gender", value: resp.gender === 1 ? "Male" : "Female" },
        {
          label: "Member Period",
          value: resp.memberStartAt + " - " + resp.memberEndAt,
        },
        { label: "Type", value: resp.type.name },
        { label: "Create Time", value: resp.createdAt },
        { label: "Update Time", value: resp.updatedAt },
      ];
      setInfo(info);
      setAbout(about);
      setCourses(resp.courses);
      setStudentWithProfile(resp);
    });
  }, [id]);

  return (
    <DashboardLayout>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={studentWithProfile?.avatar}
                style={{
                  width: 100,
                  height: 100,
                  display: "block",
                  margin: "auto",
                }}
              />
            }
          >
            <Row gutter={[6, 16]}>
              {info.map((item) => (
                <Col span={12} key={item.label} style={{ textAlign: "center" }}>
                  <b>{item.label}</b>
                  <p>{item.value}</p>
                </Col>
              ))}
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={24} style={{ textAlign: "center" }}>
                <b>Address</b>
                <p>{studentWithProfile?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1" animated={true}>
              <Tabs.TabPane tab="About" key="1">
                <h3 style={style}>Information</h3>
                <Row gutter={[6, 16]}>
                  {about.map((item) => (
                    <Col span={24} key={item.label}>
                      <b
                        style={{
                          marginRight: 16,
                          minWidth: 150,
                          display: "inline-block",
                        }}
                      >
                        {item.label}:
                      </b>
                      <span>{item.value}</span>
                    </Col>
                  ))}
                </Row>
                <h3 style={style}>Interesting</h3>{" "}
                <Row gutter={[6, 16]}>
                  <Col>
                    {studentWithProfile?.interest.map((item, index) => (
                      <Tag
                        color={programLanguageColors[index]}
                        key={item}
                        style={{ padding: "5px 10px" }}
                      >
                        {item}
                      </Tag>
                    ))}
                  </Col>
                </Row>
                <h3 style={style}>Description</h3>
                <Row gutter={[6, 16]}>
                  <Col style={{ lineHeight: 2 }}>
                    {studentWithProfile?.description}
                  </Col>
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Courses" key="2">
                <Table
                  dataSource={courses}
                  columns={columns}
                  rowKey="id"
                ></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Page;
