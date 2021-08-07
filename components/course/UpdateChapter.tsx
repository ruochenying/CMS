import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Row, Select, TimePicker } from "antd";
import Form from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";

import React, { useEffect, useState } from "react";
import { validateMessages, weekDays } from "../../lib/constant/config";

import { Course, ScheduleRequest } from "../../lib/model";
import { updateSchedule } from "../../lib/services/api-service";

type ChapterFormValue = {
  chapters: {
    name: string;
    content: string;
  }[];
  classTime: {
    weekday: string;
    time: moment.Moment;
  }[];
};

const UpdateChapter = (
  props: React.PropsWithChildren<Course> & { next: any }
) => {
  const [form] = useForm<ChapterFormValue>();
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  const updateWeekdayOptions = (namePath?: (string | number)[]) => {
    const data = form.getFieldValue("classTime");
    let result = data.map((item) => item?.weekday);

    if (namePath) {
      const value = form.getFieldValue(namePath);
      result = result.filter((item) => item !== value);
    }

    setSelectedWeekdays(result);
  };

  const onFinish = (values: ChapterFormValue) => {
    const { classTime, chapters } = values;
    const newClassTime = classTime.map(({ weekday, time }) => {
      return `${weekday} ${time.format("hh:mm:ss")}`;
    });
    const newChapters = chapters.map((item, index) => {
      return { ...item, order: index + 1 };
    });
    const req: ScheduleRequest = {
      chapters: newChapters,
      classTime: newClassTime,
      scheduleId: props.scheduleId,
      courseId: props.id,
    };

    updateSchedule(req).then((resp) => {
      if (resp) {
        props.next(true);
      }
    });
  };

  return (
    <Form
      form={form}
      name="schedule"
      onFinish={onFinish}
      autoComplete="off"
      validateMessages={validateMessages}
      style={{ padding: "0 1.6%" }}
    >
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <h2>Chapters</h2>
          <Form.List name="chapters" initialValue={[""]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={fieldKey} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        fieldKey={[fieldKey, "name"]}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "content"]}
                        fieldKey={[fieldKey, "content"]}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(name);
                            } else {
                              message.warn(
                                "You must set at least one chapter."
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
        <Col span={12}>
          <h2>Class times</h2>
          <Form.List name="classTime" initialValue={[""]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={fieldKey} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "weekday"]}
                        fieldKey={[fieldKey, "weekday"]}
                        rules={[{ required: true }]}
                      >
                        <Select
                          size="large"
                          onChange={(value) => {
                            setSelectedWeekdays([
                              ...selectedWeekdays,
                              value.toString(),
                            ]);
                          }}
                        >
                          {weekDays.map((day) => {
                            return (
                              <Select.Option
                                key={day}
                                value={day}
                                disabled={selectedWeekdays.includes(day)}
                              >
                                {day}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "time"]}
                        fieldKey={[fieldKey, "time"]}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              updateWeekdayOptions([
                                "classTime",
                                name,
                                "weekday",
                              ]);
                              remove(name);
                            } else {
                              message.warn(
                                "You must set at least one class time."
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        disabled={fields.length >= 7}
                        onClick={() => {
                          updateWeekdayOptions();

                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateChapter;
