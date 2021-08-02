import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Steps, Tag, Collapse } from "antd";
import DashBoardLayout from "../../../../components/DashboardLayout";
import { getCourseById } from "../../../../lib/services/api-service";
import { CourseDetail, Schedule } from "../../../../lib/model";
import CourseOverview from "../../../../components/course/CourseOverview";
import {
  CourseStatusBadge,
  CourseStatusColor,
  CourseStatusText,
} from "../../../../lib/constant/course";
import styles from "./[id].module.css";
import WeeklyClassTimetable from "../../../../components/common/WeeklyTimetable";

const { Panel } = Collapse;

const getChapterExtra = (data: Schedule, index: number) => {
  const activeIndex = data.chapters.findIndex(
    (item) => item.id === data.current
  );
  const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;

  return (
    <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
  );
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [courseDetail, setCourseDetail] = useState<CourseDetail>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    const courseId = +id;
    getCourseById(courseId).then((resp) => {
      setCourseDetail(resp);

      if (resp) {
        setActiveChapterIndex(
          resp.schedule.chapters.findIndex(
            (item) => item.id === resp.schedule.current
          )
        );
      }
    });
  }, [id]);

  return (
    <DashBoardLayout>
      <Row gutter={16}>
        <Col span={8}>
          <CourseOverview {...courseDetail}></CourseOverview>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <h2 style={{ color: "#7356f1" }}>Course Detail</h2>

            <h3 style={{ margin: "1em 0" }}>Create Time</h3>
            <Row>{courseDetail?.ctime}</Row>
            <h3 style={{ margin: "1em 0" }}>Start Time</h3>
            <Row>{courseDetail?.startTime}</Row>
            <Badge
              status={CourseStatusBadge[courseDetail?.status] as any}
              offset={[5, 24]}
            >
              <h3 style={{ margin: "1em 0" }}> status</h3>
            </Badge>
            <Row className={styles.stepRow}>
              <Steps
                size="small"
                current={activeChapterIndex}
                style={{ width: "auto" }}
              >
                {courseDetail?.schedule.chapters.map((item) => (
                  <Steps.Step title={item.name} key={item.id}></Steps.Step>
                ))}
              </Steps>
            </Row>
            <h3 style={{ margin: "1em 0" }}>Course Code</h3>
            <Row>{courseDetail?.uid}</Row>
            <h3 style={{ margin: "1em 0" }}>Class Time</h3>
            {courseDetail && (
              <WeeklyClassTimetable data={courseDetail.schedule.classTime} />
            )}

            <h3 style={{ margin: "1em 0" }}>Category</h3>
            <Row>
              {courseDetail?.type.map((item) => (
                <Tag color={"geekblue"} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </Row>
            <h3 style={{ margin: "1em 0" }}>Description</h3>

            <Row>{courseDetail?.detail}</Row>

            <h3 style={{ margin: "1em 0" }}>Chapter</h3>
            {courseDetail && (
              <Collapse defaultActiveKey={courseDetail.schedule.current}>
                {courseDetail?.schedule.chapters.map((item, index) => (
                  <Collapse.Panel
                    key={item.id}
                    header={item.name}
                    extra={getChapterExtra(courseDetail.schedule, index)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </DashBoardLayout>
  );
};

export default Page;
