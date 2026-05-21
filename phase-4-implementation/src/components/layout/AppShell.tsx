import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const Main = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

export function AppShell() {
  return (
    <Shell>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
}
