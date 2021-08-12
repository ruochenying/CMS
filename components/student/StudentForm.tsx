import { Form, Input, Select, Button } from "antd";
import React from "react";
import { AddStudentRequest, Student } from "../../lib/model";
import { addStudent, updateStudent } from "../../lib/services/api-service";

interface StudentFormData extends AddStudentRequest {}

const businessAreas = ["China", "New Zealand", "Canada", "Australia"];

const StudentForm = (props: React.PropsWithChildren<any>) => {
  const [form] = Form.useForm();
  const { student, onFinish } = props;

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      onFinish={(values: StudentFormData) => {
        const response = !student
          ? addStudent(values)
          : updateStudent({ ...values, id: student.id });
        response.then((student) => onFinish(student));
      }}
      initialValues={{
        name: student?.name,
        email: student?.email,
        country: student?.country,
        typeId: student?.type.id,
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="student name" />
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

      <Form.Item label="Student Type" name="type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>Tester</Select.Option>
          <Select.Option value={2}>Developer</Select.Option>
        </Select>
      </Form.Item>

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
            {!!student ? "Update" : "Add"}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
