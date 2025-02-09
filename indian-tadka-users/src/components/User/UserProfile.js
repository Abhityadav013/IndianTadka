import React, { useContext } from "react";
import { Dropdown, Menu, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./UserProfile.css";
import { StoreContext } from "../../context/StoreContext";

const UserProfileMenu = ({ userData, logoutUser }) => {
  const { sendOTP, isAccountVerified } = useContext(StoreContext);
  if (!userData) {
    return null; // Return nothing if user is not logged in
  }

  const userName = userData.name.split(" ");
  const initials = `${userName[0][0]}${userName[1][0]}`.toUpperCase();

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      {!isAccountVerified && (
        <Menu.Item
          key="account-verify"
          icon={<SafetyCertificateOutlined />}
          onClick={() => sendOTP()}
        >
          Verify Account
        </Menu.Item>
      )}

      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        Your Orders
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          logoutUser();
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Avatar className="avatar-circle" size="large">
        {initials}
      </Avatar>
    </Dropdown>
  );
};

export default UserProfileMenu;
