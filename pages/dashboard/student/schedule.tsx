import { Calendar, Col, Descriptions, Modal, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { cloneDeep, omit, orderBy } from "lodash";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  getDay,
  getMonth,
  getYear,
  isSameDay,
} from "date-fns";
import { ClockCircleOutlined, NotificationFilled } from "@ant-design/icons";

import DashBoardLayout from "../../../components/DashboardLayout";
import { Chapter, ClassSchedule } from "../../../lib/model";
import { getClassSchedule } from "../../../lib/services/api-service";
import storage from "../../../lib/services/storage";
import { weekDays } from "../../../lib/constant";
import moment from "moment";

export interface WeekdayTime {
  weekday: number;
  time: string;
}

export interface ClassCalendar extends WeekdayTime {
  date: Date;
  chapter: Chapter;
}

const courseTypeColors: string[] = [
  "magenta",
  "volcano",
  "orange",
  "gold",
  "green",
  "cyan",
  "crimson",
  "purple",
  "red",
  "lime",
];

function sortWeekdaysBy(weekDays: WeekdayTime[], start: Date): WeekdayTime[] {
  const startWeekDay = getDay(start);
  weekDays = orderBy(weekDays, ["weekday", "time"], ["asc", "asc"]);
  const firstIndex = weekDays.findIndex(
    (item) => item.weekday === startWeekDay
  );

  const head = weekDays.slice(firstIndex);

  const rest = weekDays.slice(0, firstIndex);

  return [...head, ...rest];
}

function generateClassCalendar(course: ClassSchedule): ClassCalendar[] {
  const {
    startTime,
    durationUnit,
    duration,
    schedule: { classTime, chapters },
  } = course;

  if (!classTime) {
    return [];
  }

  const chaptersCopy = cloneDeep(chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks, addHours];
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start);
  const transformWeekday = (day: string) =>
    weekDays.findIndex((item) => item === day);
  const classTimes = classTime.map((item) => {
    const [day, time] = item.split(" ");
    const weekday = transformWeekday(day);

    return { weekday, time };
  });
  const sortedClassTimes = sortWeekdaysBy(classTimes, start);
  const getClassInfo = (day: number) =>
    sortedClassTimes.find((item) => item.weekday === day);
  const result: ClassCalendar[] = [
    {
      date: start,
      chapter: chaptersCopy.shift(),
      weekday: getDay(start),
      time: "",
    },
  ];

  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassInfo(day);

    if (classInfo) {
      const chapter = chaptersCopy.shift();

      result.push({ date, chapter, ...classInfo });
    }
  }

  return result;
}

const Dashboard = () => {
  const [data, setData] = useState<
    (ClassSchedule & { calendar: ClassCalendar[] })[]
  >([]);
  const [notifyInfo, setNotifyInfo] = useState<
    ClassSchedule & { class: ClassCalendar }
  >(null);

  useEffect(() => {
    getClassSchedule(storage.userId).then((resp) => {
      if (resp) {
        const result = resp.map((course) => ({
          ...course,
          calendar: generateClassCalendar(course),
        }));

        setData(result);
      }
    });
  }, []);

  function dateCellRender(value: moment.Moment) {
    const current = value.toDate();

    const listData = data
      .map((course) => {
        const { calendar } = course;
        const target = calendar.find((item) => isSameDay(current, item.date));

        return !!target ? { class: target, ...omit(course, "calendar") } : null;
      })
      .filter((item) => !!item);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <Row
            gutter={[6, 6]}
            key={index}
            style={{ fontSize: 12 }}
            onClick={() => setNotifyInfo(item)}
          >
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>

            <Col span={8} offset={1}>
              {item.class.time}
            </Col>

            <Col
              offset={1}
              style={{ color: courseTypeColors[item.type[0]?.id % 9] }}
            >
              {item.name}
            </Col>
          </Row>
        ))}
      </ul>
    );
  }

  const monthCellRender = (value: moment.Moment) => {
    const current = value.toDate();
    const month = getMonth(current);
    const year = getYear(current);
    const result = data
      .map((course) => {
        const result = course.calendar.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);

          return classYear === year && classMonth === month;
        });
        const total = result.length;

        return !!total ? { ...course, statistics: { total } } : null;
      })
      .filter((item) => !!item);

    return result.length ? (
      <>
        {result.map((course) => (
          <Row gutter={[6, 6]} key={course.id}>
            <Col>
              <b>{course.name}</b>
            </Col>
            <Col offset={1}>{course.statistics.total} lessons</Col>
          </Row>
        ))}
      </>
    ) : null;
  };
  return (
    <DashBoardLayout>
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
      />
      <Modal
        title="Class Info"
        visible={!!notifyInfo}
        footer={null}
        onCancel={() => setNotifyInfo(null)}
      >
        <Descriptions>
          <Descriptions.Item span={8} label="Course Name">
            {notifyInfo?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter N.O">
            {notifyInfo?.schedule.chapters.findIndex(
              (item) => item.id === notifyInfo?.class.chapter?.id
            ) + 1}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Course Type">
            {notifyInfo?.type[0]?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Teacher Name">
            {notifyInfo?.teacherName}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Class Time">
            {notifyInfo?.class.time}

            <Tooltip title="Remend me">
              <NotificationFilled
                style={{ color: "#1890ff", marginLeft: 10, cursor: "pointer" }}
                onClick={() => {
                  setNotifyInfo(null);
                }}
              />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter Name">
            {notifyInfo?.class.chapter?.name}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Chapter Content">
            {notifyInfo?.class.chapter?.content}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </DashBoardLayout>
  );
};

export default Dashboard;
