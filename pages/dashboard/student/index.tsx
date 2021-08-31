/* eslint-disable jsx-a11y/alt-text */
import {
  CalendarFilled,
  HeartFilled,
  ReloadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, List, message, Space, Tooltip } from "antd";

import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import CountDown from "../../../components/CountDown";

import DashBoardLayout from "../../../components/DashboardLayout";

import UserOverview from "../../../components/overview/UserOverview";
import { DurationUnit } from "../../../lib/constant";
import {
  Course,
  Statistic,
  StudentOwnStatisticsResponse,
} from "../../../lib/model";
import {
  getCourses,
  getStudentOwnStatistics,
} from "../../../lib/services/api-service";
import storage from "../../../lib/services/storage";

const StyledList = styled(List)`
  .ant-list-item {
    position: relative;
  }
  .ant-list-item-action {
    position: absolute;
    left: 240px;
    bottom: 30px;
  }
  .ant-list-item-extra {
    padding-top: 40px;
  }
  .ant-list-item-meta-description {
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export interface OverviewStatistics {
  total: number;
  amount: number;
  status: number;
}

interface StoreState {
  page: number;
  max: number;
  recommend: Course[];
}

type ActionType = "increment" | "reset" | "setMax" | "setRecommend";

type Action = {
  type: ActionType;
  payload?: number | Course[];
};

const initialState: StoreState = { page: 1, max: 0, recommend: [] };

const limit = 5;

const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case "increment":
      return { ...state, page: state.page + 1 };
    case "reset":
      return { ...state, page: 1 };
    case "setMax":
      return { ...state, max: action.payload as number };
    case "setRecommend":
      return { ...state, recommend: action.payload as Course[] };
    default:
      throw new Error();
  }
};

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Dashboard = () => {
  const [data, setData] = useState<StudentOwnStatisticsResponse>(null);
  const [overview, setOverview] = useState<OverviewStatistics[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getStudentOwnStatistics(storage.userId).then((resp) => {
      if (resp) {
        const ownCourses: Course[] = (resp.own as Statistic).courses.map(
          (item) => item.course
        );
        let targetOverview = {};
        Object.values(ownCourses).map((item) => {
          targetOverview[item.status] = targetOverview[item.status]
            ? (targetOverview[item.status] += 1)
            : 1;
          return targetOverview;
        });
        const overviewSource = Object.entries(targetOverview).map(
          ([status, amount]) => {
            return {
              total: ownCourses.length,
              status: +status,
              amount: +amount,
            };
          }
        );

        setOverview(overviewSource);
        dispatch({
          type: "setRecommend",
          payload: (resp.recommend as Statistic).courses,
        });
        setData(resp);
      }
    });
  }, []);

  const changeBatch = async () => {
    try {
      const { page } = state;
      const current = page * limit > state.max ? 1 : page;
      const { courses, total } = await getCourses({ page: current, limit });
      dispatch({ type: page * limit > total ? "reset" : "increment" });
      if (total !== state.max) {
        dispatch({ type: "setMax", payload: total });
      }
      dispatch({ type: "setRecommend", payload: courses });
    } catch (err) {
      message.error("Server is busy, please try again later!");
    }
  };

  return (
    <DashBoardLayout>
      {data && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <UserOverview overview={overview} total={overview.length} />
          </div>

          <Card
            title={<h3> Courses you might be interested in </h3>}
            extra={
              <Tooltip title="Change batch">
                <ReloadOutlined
                  onClick={changeBatch}
                  style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
                />
              </Tooltip>
            }
          >
            <StyledList
              itemLayout="vertical"
              size="large"
              dataSource={state.recommend}
              renderItem={(item: Course) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText
                      icon={TeamOutlined}
                      text={item.maxStudents}
                      key="list-vertical-limit-o"
                    />,
                    <IconText
                      icon={HeartFilled}
                      text={item.star}
                      key="list-vertical-star-o"
                    />,
                    <IconText
                      icon={CalendarFilled}
                      text={
                        item.duration + " " + DurationUnit[item.durationUnit]
                      }
                      key="list-vertical-calendar-o"
                    />,
                  ]}
                  extra={<CountDown time={item.startTime}></CountDown>}
                >
                  <List.Item.Meta
                    // eslint-disable-next-line @next/next/no-img-element
                    avatar={<img src={item.cover} width="200px" />}
                    title={
                      <Link
                        href={`/dashboard/${storage.role}/courses/${item.id}`}
                        passHref
                      >
                        {item.name}
                      </Link>
                    }
                    description={item.detail}
                  />
                </List.Item>
              )}
            ></StyledList>
          </Card>
        </>
      )}
    </DashBoardLayout>
  );
};

export default Dashboard;
