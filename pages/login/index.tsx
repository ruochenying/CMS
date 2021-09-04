import { Row, Col, Typography } from "antd";
import React from "react";
import Header from "../../components/home/header";
import LoginForm from "../../components/LoginForm";

const Login = () => {
  const { Title } = Typography;

  return (
    <>
      <Header />

      <Row gutter={24}>
        <Col span={8}></Col>
        <Col span={8}>
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <h3 style={{ fontWeight: 600 }}>COURSE MANAGEMENT ASSISTANT</h3>
          </div>

          <LoginForm />
        </Col>
        <Col span={8}></Col>
      </Row>
    </>
  );
};

export default Login;
