import React from "react";
import { Outlet } from "react-router-dom";
import SubMain from "../layout/SubMain";

const PageHolder = () => {
  return (
    <SubMain>
      <Outlet />
    </SubMain>
  );
};

export default PageHolder;
