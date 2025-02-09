import React, { useContext, useEffect, useState } from "react";
import { Alert, Typography } from "antd";
import { StoreContext } from "../../context/StoreContext";
import './EmailVerification.css'

const { Link, Text } = Typography;

const EmailVerificationAlert = ({ user }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { sendOTP } = useContext(StoreContext);

  useEffect(() => {
    if (user && !user.isAccountVerified) {
      setVisible(true);
    }
  }, [user]);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await sendOTP();
    } catch (error) {
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Alert
      className="email-verification-alert" 
      message="🍕 Order Pending: Verify Your Email!"
      description={
        <>
          <Text>
            Hi <strong>{user.name}</strong>, your food is almost ready! But
            before we serve you the best flavors, you need to verify your email.
          </Text>
          <br />
          <Text type="secondary">
            Didn’t get the email?{" "}
            <Link onClick={handleResendEmail} disabled={loading}>
              {loading
                ? "Sending fresh email..."
                : "Click here to get a fresh one 🍽️"}
            </Link>
          </Text>
        </>
      }
      type="warning"
      showIcon
      closable
      onClose={() => setVisible(false)}
      style={{ marginBottom: 30 }}
    />
  );
};

export default EmailVerificationAlert;
