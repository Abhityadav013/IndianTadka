import React, { useContext, useEffect, useState } from "react";
import "./OTPComponent.css"; 
import { StoreContext } from "../../context/StoreContext";

const OTPComponent = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const { otpExpiresAt, verifyOTP, resendOTP } = useContext(StoreContext);  

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const timeLeft = otpExpiresAt - Date.now();  

      if (timeLeft <= 0) {
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const remainingMinutes = Math.floor(timeLeft / 60000);
      const remainingSeconds = Math.floor((timeLeft % 60000) / 1000);

      setMinutes(remainingMinutes);
      setSeconds(remainingSeconds);
    };

    calculateTimeRemaining();

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval); 
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt, seconds, minutes]);

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(0, 1); // Ensure only one character
    setOtp(newOtp);

    if (e.target.value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus(); // Auto-focus the next input
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus(); // Focus previous input if backspace is pressed
    }
  };

  return (
    <div className="card">
      <h4>Verify OTP</h4>
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="otp-input"
            autoFocus={index === 0} // Focus on the first input
          />
        ))}
      </div>
      <div className="countdown-text">
        <p>
          Time Remaining:{" "}
          <span style={{ fontWeight: 600 }}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </p>
        <button
          disabled={seconds > 0 || minutes > 0}
          className={seconds > 0 || minutes > 0 ? "disabled-btn" : "active-btn"}
          onClick={resendOTP}
        >
          Resend OTP
        </button>
      </div>
      <button className="submit-btn" onClick={() => verifyOTP(otp.join(""))}>
        Submit
      </button>
    </div>
  );
};

export default OTPComponent;
