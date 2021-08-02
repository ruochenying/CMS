import { useEffect, useState } from "react";
import { List, Spin, BackTop } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import DashBoardLayout from "../../../../components/DashboardLayout";
import { getCourses } from "../../../../lib/services/api-service";
import { Course } from "../../../../lib/model";
import CourseOverview from "../../../../components/course/CourseOverview";

const Pagination = { page: 1, limit: 20 };

const Dashboard = () => {
  const [pagination, setPagination] = useState(Pagination);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    getCourses({ ...pagination }).then((resp) => {
      setCourseList((preCourseList) => [...preCourseList, ...resp.courses]);
      setTotal(resp.total);
    });
  }, [pagination]);

  return (
    <DashBoardLayout>
      <InfiniteScroll
        next={() => {
          setPagination({ ...pagination, page: pagination.page + 1 });
          setHasMore(
            hasMore ? total > courseList.length : total <= courseList.length
          );
        }}
        hasMore={hasMore}
        loader={
          <div
            style={{
              position: "relative",
              left: "50%",
            }}
          >
            <Spin size="large" />
          </div>
        }
        dataLength={courseList.length}
        endMessage={<div style={{ textAlign: "center" }}>No More Course!</div>}
        style={{ overflow: "hidden" }}
      >
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={courseList}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}></CourseOverview>
            </List.Item>
          )}
        ></List>
        <BackTop duration={1000} visibilityHeight={600} />
      </InfiniteScroll>
    </DashBoardLayout>
  );
};

export default Dashboard;
