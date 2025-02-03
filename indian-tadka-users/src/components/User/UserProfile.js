import React from "react";
import { Dropdown, Menu, Avatar } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./UserProfile.css"; // Import the CSS file

const UserProfileMenu = ({ userData, logoutUser }) => {
  if (!userData) {
    return null; // Return nothing if user is not logged in
  }

  // Extract first and last initials from user's name (e.g., "Abhit Yadav" => "AY")
  const userName = userData.name.split(" ");
  const initials = `${userName[0][0]}${userName[1][0]}`.toUpperCase();

  // Menu items
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        Your Orders
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          logoutUser();
          // Handle logout (e.g., clear localStorage and redirect)
          //   localStorage.removeItem("userDetails");
          //   window.location.href = "/login"; // Redirect to login
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
