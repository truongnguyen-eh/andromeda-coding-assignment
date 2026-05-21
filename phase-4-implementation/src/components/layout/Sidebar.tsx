import { NavLink } from "react-router-dom";
import { Typography } from "@hero-design/react";
import styled from "styled-components";

const Nav = styled.nav`
  width: 220px;
  min-height: 100vh;
  background: #1e293b;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
`;

const Brand = styled.div`
  padding: 0 20px 24px;
  border-bottom: 1px solid #334155;
  margin-bottom: 8px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  text-decoration: none;
  color: #94a3b8;
  border-radius: 0;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: #334155;
    color: #f1f5f9;
  }

  &.active {
    background: #0ea5e9;
    color: #ffffff;
  }
`;

const navItems = [{ to: "/", label: "Transactions", emoji: "💳" }];

export function Sidebar() {
  return (
    <Nav>
      <Brand>
        <Typography.Text fontWeight="bold" intent="white">
          Finance Tracker
        </Typography.Text>
      </Brand>
      {navItems.map(({ to, label, emoji }) => (
        <StyledNavLink key={to} to={to} end={to === "/"}>
          <span>{emoji}</span>
          <Typography.Text tagName="span" fontWeight="regular">
            {label}
          </Typography.Text>
        </StyledNavLink>
      ))}
    </Nav>
  );
}
