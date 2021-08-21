import React from "react";
import { Card, Col, Progress, Row } from "antd";

import { BasicStatistics } from "../../lib/model/statistics";

export interface OverviewCardProps<T = BasicStatistics> {
  data: T;
  title: string;
  icon: JSX.Element;
  style: React.CSSProperties;
}

const OverviewCard = ({ data, title, icon, style }: OverviewCardProps) => {
  const lastMonthAddedPercent = +(
    (data.lastMonthAdded / data.total) *
    100
  ).toFixed(1);

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
            {data.total}
          </h2>
          <Progress
            percent={100 - lastMonthAddedPercent}
            size="small"
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          />
          <p style={{ color: "#fff" }}>{`${
            lastMonthAddedPercent + "%"
          } Increase in 30 Days`}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default OverviewCard;
