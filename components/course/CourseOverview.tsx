/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import React, { Props } from "react";
import Link from "next/link";
import { HeartFilled, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Divider, Button } from "antd";
import { Course, CourseDetail } from "../../lib/model";
import { DurationUnit } from "../../lib/constant";
import { useUserRole } from "../custom-hooks/Login-state";
import styles from "./CourseOverview.module.css";

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, undefined>>
  : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;
type State = StrictUnion<Course | CourseDetail>;

const getDuration = (data: Partial<CourseDetail>): string => {
  const { duration, durationUnit } = data;
  const text = `${duration} ${DurationUnit[durationUnit]}`;

  return duration > 1 ? text + "s" : text;
};

const CourseOverview = (
  props: React.PropsWithChildren<Partial<CourseDetail>>
) => {
  const role = useUserRole();
  const cardStyle = {
    paddingBottom: !!props.sales ? 0 : 24,
  };
  return (
    <Card
      cover={<img src={props.cover} style={{ height: 260 }} />}
      bodyStyle={{ ...cardStyle }}
    >
      <Row
        gutter={16}
        justify="space-between"
        align="middle"
        style={{ marginBottom: 10 }}
      >
        <h3>{props.name}</h3>
      </Row>

      <Row gutter={16} justify="space-between" align="middle">
        <Col>{props.startTime}</Col>
        <Col style={{ display: "flex", alignItems: "center" }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: "red" }} />
          <b>{props.star}</b>
        </Col>
      </Row>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <Row gutter={16} justify="space-between">
        <Col>Duration:</Col>
        <Col>
          <b>{getDuration(props)}</b>
        </Col>
      </Row>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <Row gutter={16} justify="space-between">
        <Col>Teacher:</Col>
        <Col>
          <b>{props.teacherName}</b>
        </Col>
      </Row>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <Row style={{ marginBottom: 15 }} gutter={16} justify="space-between">
        <Col>
          <UserOutlined
            style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
          />
          <span>Student Limit:</span>
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>
      {}
      {props.sales ? (
        <Row className={styles.row} gutter={[6, 16]} justify="space-between">
          <Col className={styles.col} flex={1}>
            <b>{props.sales.price}</b>
            <p>Price</p>
          </Col>
          <Col className={styles.col} flex={1}>
            <b>{props.sales.batches}</b>
            <p>Batches</p>
          </Col>
          <Col className={styles.col} flex={1}>
            <b>{props.sales.studentAmount}</b>
            <p>Students</p>
          </Col>
          <Col className={styles.col} flex={1}>
            <b>{props.sales.earnings}</b>
            <p>Earings</p>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: 15 }}>
          <Link href={`/dashboard/${role}/courses/${props.id}`} passHref>
            <Button type="primary">Read More</Button>
          </Link>
        </Row>
      )}
    </Card>
  );
};

export default CourseOverview;
