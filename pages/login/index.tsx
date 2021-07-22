import { Row, Col, Typography } from "antd";
import LoginForm from "../../components/LoginForm";

const Login = () => {
  const { Title } = Typography;

  return (
    <Row gutter={24}>
      <Col span={8}></Col>
      <Col span={8}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontWeight: 600 }}>COURSE MANAGEMENT ASSISTANT</h1>
        </div>

        <LoginForm />
      </Col>
      <Col span={8}></Col>
    </Row>
  );
};

export default Login;
