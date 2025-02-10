import React, { useContext, useState } from "react";
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
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { isValidPhoneNumber } from "libphonenumber-js";

const { Title } = Typography;

const AuthForm = ({ visible, onCancel, onOk }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, register } = useContext(StoreContext);

  const handleSubmit = async (values) => {
    if (isLogin) {
      await login(email, password);
    } else {
      await register(values);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    const { credential } = response; // This is the id_token from Google

    try {
      // Send the Google id_token to the backend
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/google", // Use POST here for the Google authentication endpoint
        { code: credential }, // Send the credential (id_token) to backend
        { withCredentials: true } // This ensures cookies are set in the browser (if using cookies for JWT)
      );

      // Optionally, save JWT tokens (access_token and refresh_token) in localStorage (for testing or other use cases)
      localStorage.setItem("access_token", res.data.access_token); // Optional, depending on how you handle tokens
      localStorage.setItem("refresh_token", res.data.refresh_token); // Optional

      // Save user details in localStorage or context (for persistent user data)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");

      // Redirect or update UI after successful login (optional)
      // window.location.href = '/home';  // Example: Redirect to home page
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Google login failed. Please try again.");
    }
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
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      style={{ padding: "24px" }}
    >
      <Title level={3}>{isLogin ? "Login" : "Sign Up"}</Title>
      <Form
        name={isLogin ? "login" : "signup"}
        onFinish={handleSubmit}
        initialValues={{ name, email, password, phoneNumber, confirmPassword }}
        layout="vertical"
      >
         {!isLogin &&(
          <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              type: "name",
              message: "Please enter your full name!",
            },
          ]}
        >
          <Input
            type="name"
            placeholder="Please enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
         )}

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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Phone number is required.");
                  }
                  if (!isValidPhoneNumber(value)) {
                    return Promise.reject("Invalid phone number.");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <PhoneInput
              defaultCountry="DE"
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
          rules={[
            { required: true, message: "Please enter your password!" },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
              message:
                "Password must be at least 6 characters long and include an uppercase letter, a number, and a special character.",
            },
          ]}
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                type="icon"
                shape="circle"
                size="large"
              />
            </div>
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
