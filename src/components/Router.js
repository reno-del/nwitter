import React, { useState } from "react";

import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routeset/Auth";
import Home from "../routeset/Home";

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
