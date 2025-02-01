import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Divider,
  Modal,
  Typography,
  Row,
  Col,
} from "antd";
import { GoogleLogin } from "@react-oauth/google";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import styles for the phone input
import "./AuthForm.css";

const { Title } = Typography;

const AuthForm = ({ visible, onCancel, onOk }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (values) => {
    // Handle submit for login/signup
    console.log(isLogin ? "Login credentials" : "Signup credentials", values);
    onOk(); // Optionally call this when form is submitted successfully
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log("Google login response:", response);
    // Handle Google login success
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failed:", error);
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      bodyStyle={{ padding: "24px" }}
    >
      <Title level={3}>{isLogin ? "Login" : "Sign Up"}</Title>
      <Form
        name={isLogin ? "login" : "signup"}
        onFinish={handleSubmit}
        initialValues={{ email, password, phoneNumber, confirmPassword }}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        {!isLogin && (
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <PhoneInput
              defaultCountry="US"
              value={phoneNumber}
              onChange={setPhoneNumber}
              international
              placeholder="Enter phone number"
              className="phone-input"
            />
          </Form.Item>
        )}

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        {!isLogin && (
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </Form.Item>

        <Divider>OR</Divider>

        <Row justify="center">
          <Col span={24}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              type="icon"
              shape="circle"
              size="large"
            />
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Button
              type="link"
              onClick={isLogin ? switchToSignup : switchToLogin}
              style={{ padding: 0 }}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AuthForm;
