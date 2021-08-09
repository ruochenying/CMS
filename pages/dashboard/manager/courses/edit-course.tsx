import { Row, Col, Input, Select, Spin, Tabs } from "antd";
import { useState } from "react";
import { debounce } from "lodash";

import DashBoardLayout from "../../../../components/DashboardLayout";
import { getCourses } from "../../../../lib/services/api-service";
import { Course } from "../../../../lib/model";
import AddCourse from "../../../../components/course/AddCourse";
import UpdateChapter from "../../../../components/course/UpdateChapter";

const Dashboard = () => {
  const [searchBy, setSearchBy] = useState<"uid" | "name" | "type">("uid");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(null);

  const debounceSearchOnSearch = debounce((value) => {
    setIsSearching(true);
    getCourses({ [searchBy]: value }).then((resp) => {
      if (resp.courses) {
        setSearchResult(resp.courses);
      }
    });
    setIsSearching(false);
  }, 1000);

  //console.log(course);
  return (
    <DashBoardLayout>
      <Row gutter={[16, 6]}>
        <Col span={12} style={{ marginLeft: "1%" }}>
          <Input.Group compact style={{ display: "flex" }}>
            <Select defaultValue="uid" onChange={(value) => setSearchBy(value)}>
              <Select.Option value="uid">Code</Select.Option>
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="type">Category</Select.Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchBy}`}
              showSearch
              style={{ width: "100%" }}
              filterOption={false}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              onSearch={(value) => debounceSearchOnSearch(value)}
              onSelect={(id) => {
                const course = searchResult.find((item) => item.id === id);
                setCourse(course);
              }}
            >
              {searchResult?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name} - {item.teacherName} - {item.uid}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="course"
        type="card"
        size="large"
        style={{ marginLeft: "1%", marginTop: "20px" }}
        animated
      >
        <Tabs.TabPane
          key="course"
          tab="Course Detail"
          style={{ position: "relative", right: "20px" }}
        >
          <AddCourse course={course} />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="chapter"
          tab="Course Schedule"
          style={{ position: "relative", right: "20px" }}
        >
          <UpdateChapter {...course} />
        </Tabs.TabPane>
      </Tabs>
    </DashBoardLayout>
  );
};

export default Dashboard;
