import { Card, Col, Progress, Row, Select } from "antd";
import { useEffect, useState } from "react";
import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import DashBoardLayout from "../../../components/DashboardLayout";
import OverviewCard from "../../../components/overview/OverviewCard";
import {
  CourseClassTimeStatistic,
  CourseStatisticsResponse,
  Statistic,
  StatisticsOverviewResponse,
  StudentStatisticsResponse,
  TeacherStatisticsResponse,
} from "../../../lib/model/";
import {
  getCourseStatistics,
  getStatisticsOverview,
  getStudentStatistics,
  getTeacherStatistics,
} from "../../../lib/services/api-service";
import { Role } from "../../../lib/constant";
import PieChart from "../../../components/manager/PieChart";
import LineChart from "../../../components/manager/LineChart";
import BarChart from "../../../components/manager/BarChart";
import HeatMap from "../../../components/manager/HeatMap";
import Distribution from "../../../components/manager/Distribution";

const IconStyle = {
  fontSize: 32,
  color: "#999",
  borderRadius: "50%",
  padding: "25px",
  background: "#fff",
};

const Page = () => {
  const [overview, setOverview] = useState<StatisticsOverviewResponse>(null);
  const [distributionRole, setDistributionRole] = useState<string>(
    Role.student
  );
  const [selectedType, setSelectedType] = useState<string>("studentType");
  const [studentStatistics, setStudentStatistics] =
    useState<StudentStatisticsResponse>(null);
  const [teacherStatistics, setTeacherStatistics] =
    useState<TeacherStatisticsResponse>(null);
  const [courseStatistics, setCourseStatistics] =
    useState<CourseStatisticsResponse>(null);

  useEffect(() => {
    getStatisticsOverview().then((resp) => {
      setOverview(resp);
    });
    getStudentStatistics().then((resp) => {
      setStudentStatistics(resp);
    });
    getTeacherStatistics().then((resp) => {
      setTeacherStatistics(resp);
    });
    getCourseStatistics().then((resp) => {
      setCourseStatistics(resp);
    });
  }, []);

  return (
    <DashBoardLayout>
      {overview && (
        <Row align="middle" gutter={[24, 16]}>
          <Col span={8}>
            <OverviewCard
              title="TOTAL STUDENTS"
              data={overview.student}
              icon={<SolutionOutlined style={IconStyle} />}
              style={{ background: "#1890ff" }}
            />
          </Col>

          <Col span={8}>
            <OverviewCard
              title="TOTAL TEACHERS"
              data={overview.teacher}
              icon={<DeploymentUnitOutlined style={IconStyle} />}
              style={{ background: "#673bb7" }}
            />
          </Col>

          <Col span={8}>
            <OverviewCard
              title="TOTAL COURSES"
              data={overview.course}
              icon={<ReadOutlined style={IconStyle} />}
              style={{ background: "#ffaa16" }}
            />
          </Col>
        </Row>
      )}
      <Row gutter={6} style={{ margin: "16px 0px" }}>
        <Col span={12}>
          <Card
            title="Distribution"
            extra={
              <Select
                defaultValue="student"
                onSelect={setDistributionRole}
                bordered={false}
              >
                <Select.Option value={Role.student}>Student</Select.Option>
                <Select.Option value={Role.teacher}>Teacher</Select.Option>
              </Select>
            }
          >
            <Distribution
              data={
                (distributionRole === Role.student
                  ? studentStatistics?.country
                  : teacherStatistics?.country) as unknown as Statistic[]
              }
              title={distributionRole}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Types"
            extra={
              <Select
                defaultValue={selectedType}
                bordered={false}
                onSelect={setSelectedType}
              >
                <Select.Option value="studentType">Student Type</Select.Option>
                <Select.Option value="courseType">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {selectedType === "studentType" ? (
              <PieChart
                data={studentStatistics?.type as unknown as Statistic[]}
                title="Student Type"
              />
            ) : selectedType === "courseType" ? (
              <PieChart
                data={courseStatistics?.type as unknown as Statistic[]}
                title="Teacher Type"
              />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview?.student.gender).map(
                      (item) => {
                        return { name: item[0], amount: item[1] };
                      }
                    )}
                    title="Student Gender"
                  />
                </Col>

                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview?.teacher.gender).map(
                      (item) => {
                        return { name: item[0], amount: item[1] };
                      }
                    )}
                    title="Teacher Gender"
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={6} style={{ margin: "16px 0px" }}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart
              data={{
                student: studentStatistics?.createdAt as unknown as Statistic[],
                teacher: teacherStatistics?.createdAt as unknown as Statistic[],
                course: courseStatistics?.createdAt as unknown as Statistic[],
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Languages">
            <BarChart
              data={{
                studentInterest:
                  studentStatistics?.interest as unknown as Statistic[],
                teacherSkills:
                  teacherStatistics?.skills as unknown as Statistic[],
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={6} style={{ margin: "16px 0px" }}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatMap
              data={
                courseStatistics?.classTime as unknown as CourseClassTimeStatistic[]
              }
            />
          </Card>
        </Col>
      </Row>
    </DashBoardLayout>
  );
};

export default Page;
