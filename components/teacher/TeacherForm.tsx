import { Button, Col, Input, Row, Select, Slider, Space } from "antd";
import Form from "antd/lib/form";
import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { businessAreas } from "../../lib/constant";
import { AddTeacherRequest, Teacher } from "../../lib/model";
import { SkillDes } from "../../lib/constant/config";
import { addTeacher, updateTeacher } from "../../lib/services/api-service";

export interface TeacherFormProps {
  onFinish?: (value: Teacher) => void;
  teacher?: Teacher;
}

type TeacherFormData = AddTeacherRequest;

const prefixSelector = (
  <Form.Item name="prefix" initialValue="86" noStyle>
    <Select style={{ width: 70 }}>
      <Select.Option value="86">+86</Select.Option>
      <Select.Option value="87">+87</Select.Option>
    </Select>
  </Form.Item>
);

const TeacherForm = (props: TeacherFormProps) => {
  const [form] = Form.useForm();
  const { teacher, onFinish } = props;

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      onFinish={(values: TeacherFormData) => {
        const response = !teacher
          ? addTeacher(values)
          : updateTeacher({ ...values, id: teacher.id });
        response.then((teacher) => onFinish(teacher));
      }}
      initialValues={{
        name: teacher?.name,
        email: teacher?.email,
        country: teacher?.country,
        phone: teacher?.phone,
        skills: teacher?.skills,
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="Teacher name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email" }, { required: true }]}
      >
        <Input type="email" placeholder="email" />
      </Form.Item>

      <Form.Item label="Area" name="country" rules={[{ required: true }]}>
        <Select>
          {businessAreas.map((item, index) => (
            <Select.Option value={item} key={index}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true }, { pattern: /^1[3-9]\d{9}$/ }]}
      >
        <Input addonBefore={prefixSelector} placeholder="mobile phone" />
      </Form.Item>
      <Form.Item label={<b>skills</b>}></Form.Item>
      <Form.List name="skills" initialValue={[{ name: "", level: 2 }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row align="middle" justify="space-between" key={name}>
                <Col span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    fieldKey={[fieldKey, "name"]}
                    rules={[{ required: true }]}
                  >
                    <Input style={{ textAlign: "right" }} />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    {...restField}
                    name={[name, "level"]}
                    fieldKey={[fieldKey, "level"]}
                    rules={[{ required: true, message: "Missing last name" }]}
                  >
                    <Slider
                      step={1}
                      min={1}
                      max={5}
                      tipFormatter={(value) => SkillDes[value]}
                    />
                  </Form.Item>
                </Col>
                <Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ margin: "10px 0 0 10px", color: "red" }}
                    />
                  )}
                </Form.Item>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Skill
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item
        style={{
          position: "absolute",
          bottom: 0,
          right: "8em",
          marginBottom: 10,
        }}
        shouldUpdate={true}
      >
        {() => (
          <Button type="primary" htmlType="submit">
            {!!teacher ? "Update" : "Add"}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default TeacherForm;
