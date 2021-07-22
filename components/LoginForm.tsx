import { useState, Fragment } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Radio,
  RadioChangeEvent,
  Alert,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { LoginFormValue, Role } from "../lib/model";
import storage from "../lib/services/storage";
import { login } from "../lib/services/api-service";

const LoginForm = () => {
  const [role, setRole] = useState<Role>("student");
  const router = useRouter();
  const [authError, setAuthError] = useState(false);

  const onFinish = async (values: LoginFormValue) => {
    const { remember, ...rest } = values;
    const userInfo = await login(rest);
    if (!!userInfo) {
      storage.setUserInfo(userInfo);
      router.push("dashboard");
    }
  };

  const onChangeRoleHandler = (e: RadioChangeEvent) => {
    setRole(e.target.value);
  };

  return (
    <Fragment>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true, role: "student" }}
        onFinish={(values: LoginFormValue) => onFinish(values)}
      >
        <Form.Item name="role">
          <Radio.Group onChange={(e) => onChangeRoleHandler(e)}>
            <Radio.Button value="student">Student</Radio.Button>
            <Radio.Button value="teacher">Teacher</Radio.Button>
            <Radio.Button value="manager">Manager</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Please input email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your Password!" },
            { min: 4, max: 16 },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Please input password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign in
          </Button>
        </Form.Item>
        <Form.Item>
          No account?{" "}
          <a href="" style={{ color: "#1890ff" }}>
            Sign up
          </a>
        </Form.Item>
      </Form>
      {authError && (
        <Alert message="Please check your email and password" type="error" />
      )}
    </Fragment>
  );
};

export default LoginForm;
