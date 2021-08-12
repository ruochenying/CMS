import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card, Col, List, Rate, Row, Tabs } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Table, { ColumnType } from "antd/lib/table";
import { HeartFilled } from "@ant-design/icons";

import DashBoardLayout from "../../../../components/DashboardLayout";
import { Course, TeacherResponse } from "../../../../lib/model";
import { getTeacherById } from "../../../../lib/services/api-service";
import Link from "next/link";

const style = {
  color: "#7356f1",
  fontSize: 24,
  marginTop: 20,
  marginBottom: 20,
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  );
  const [about, setAbout] = useState<
    { label: string; value: string | number }[]
  >([]);

  const [teacherWithProfile, setTeacherWithProfile] =
    useState<TeacherResponse>(null);

  const columns: ColumnType<Course>[] = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      // eslint-disable-next-line react/display-name
      render: (value, record) => (
        <Link href={`/dashboard/manager/courses/${record.id}`}>{value}</Link>
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      title: "Create Time",
      dataIndex: "ctime",
    },
    {
      title: "Enjoy",
      dataIndex: "star",
      // eslint-disable-next-line react/display-name
      render: (value) => (
        <Rate
          character={<HeartFilled />}
          defaultValue={value}
          disabled
          style={{ color: "red" }}
        />
      ),
    },
  ];

  useEffect(() => {
    const teacherId = +id;
    getTeacherById(teacherId).then((resp) => {
      if (resp) {
        setInfo([
          {
            label: "Name",
            value: resp.name,
          },
          {
            label: "Country",
            value: resp.country,
          },
          {
            label: "Email",
            value: resp.email,
          },
          {
            label: "Phone",
            value: resp.phone,
          },
        ]);
        const about = [
          { label: "Birthday", value: resp.profile.birthday },
          {
            label: "Gender",
            value: resp.profile.gender === 1 ? "Male" : "Female",
          },
          { label: "Create Time", value: resp.createdAt },
          { label: "Update Time", value: resp.updatedAt },
        ];
        setAbout(about);
        setTeacherWithProfile(resp);
      }
    });
  }, [id]);
  // console.log(about);

  return (
    <DashBoardLayout>
      <Row gutter={[16, 6]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={teacherWithProfile?.profile.avatar}
                style={{
                  width: 100,
                  height: 100,
                  display: "block",
                  margin: "auto",
                }}
              />
            }
          >
            <Row gutter={[16, 6]}>
              {info.map((item) => {
                return (
                  <Col
                    key={item.label}
                    span={12}
                    style={{ textAlign: "center" }}
                  >
                    <b>{item.label}</b>
                    <p>{item.value}</p>
                  </Col>
                );
              })}
            </Row>
            <Row gutter={[16, 6]}>
              <Col span={24} style={{ textAlign: "center" }}>
                <b>Address</b>
                <p>
                  {teacherWithProfile?.profile?.address?.map(
                    (item) => item + " "
                  )}
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1" animated={true}>
              <Tabs.TabPane tab="About" key="1">
                <h3 style={style}>Information</h3>
                {about?.map((item) => {
                  return (
                    <Row key={item.label}>
                      <Col span={5}>
                        <b>{item.label}</b>
                      </Col>
                      <Col span={6}>
                        <p>{item.value}</p>
                      </Col>
                    </Row>
                  );
                })}
                <h3 style={style}>Skills</h3>
                {teacherWithProfile?.skills.map((item, index) => {
                  return (
                    <Row key={index} align="middle">
                      <Col span={4}>
                        <b>{item.name + ":"}</b>
                      </Col>
                      <Col span={10}>
                        <Rate disabled defaultValue={item.level} />
                      </Col>
                    </Row>
                  );
                })}
                <h3 style={style}>Description</h3>
                <Row gutter={[16, 6]}>
                  <Col style={{ lineHeight: 2 }}>
                    {teacherWithProfile?.profile?.description}
                  </Col>
                </Row>
                <h3 style={style}>Education</h3>

                <List>
                  {teacherWithProfile?.profile?.education?.map(
                    (item, index) => (
                      <List.Item extra={item.degree} key={index}>
                        <List.Item.Meta
                          title={item.startEnd.replace(" ", " To ")}
                          description={item.level}
                        ></List.Item.Meta>
                      </List.Item>
                    )
                  )}
                </List>

                <h3 style={style}>Work Experience</h3>
                <List>
                  {teacherWithProfile?.profile?.workExperience?.map(
                    (item, index) => (
                      <List.Item key={index}>
                        <List.Item.Meta
                          title={item.startEnd.replace(" ", " To ")}
                          description={
                            <Row>
                              <Col span={4}>
                                <b>{item.company}</b>
                              </Col>
                              <Col offset={1}>{item.post}</Col>
                            </Row>
                          }
                        ></List.Item.Meta>
                      </List.Item>
                    )
                  )}
                </List>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Courses" key="2">
                <Table
                  dataSource={teacherWithProfile?.courses}
                  columns={columns}
                  rowKey="id"
                ></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </DashBoardLayout>
  );
};

export default Page;
