import { OverviewStatistics } from "../../pages/dashboard/student";
import { Card, Col, Progress, Row } from "antd";
import React from "react";
import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

interface UserOverviewProps {
  overview: OverviewStatistics[];
  total: number;
}

const IconStyle = {
  fontSize: 32,
  color: "#999",
  borderRadius: "50%",
  padding: "25px",
  background: "#fff",
};

const Overview = ({ data, title, icon, style }) => {
  return (
    <Card style={{ borderRadius: "5px", cursor: "pointer", ...style }}>
      <Row>
        <Col
          span={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </Col>
        <Col span={18}>
          <h3 style={{ color: "#fff" }}>{title}</h3>
          <h2 style={{ color: "#fff", fontSize: 32, marginBottom: 0 }}>
            {data.amount}
          </h2>
          <Progress
            percent={100 - +((data.amount / data.total) * 100).toFixed(0)}
            size="small"
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          />
          <p style={{ color: "#fff" }}>{`${
            ((data.amount / data.total) * 100).toFixed(0) + "%"
          } course in ${title}`}</p>
        </Col>
      </Row>
    </Card>
  );
};

const UserOverview = ({ overview, total }: UserOverviewProps) => {
  const getOverviewData = (status: number): OverviewStatistics => {
    const target = overview.find((item) => item.status === status);

    return target ? target : { status, amount: 0, total: total };
  };

  return (
    <Row align="middle" justify="space-between" gutter={[24, 16]}>
      <Col span={8}>
        <Overview
          title="Pending"
          data={getOverviewData(0)}
          icon={<SolutionOutlined style={IconStyle} />}
          style={{ background: "#1890ff" }}
        />
      </Col>

      <Col span={8}>
        <Overview
          title="Active"
          data={getOverviewData(1)}
          icon={<DeploymentUnitOutlined style={IconStyle} />}
          style={{ background: "#673bb7" }}
        />
      </Col>

      <Col span={8}>
        <Overview
          title="Done"
          data={getOverviewData(2)}
          icon={<ReadOutlined style={IconStyle} />}
          style={{ background: "#ffaa16" }}
        />
      </Col>
    </Row>
  );
};

export default UserOverview;
