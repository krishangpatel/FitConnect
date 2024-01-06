import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Redirect, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import PropsRoute from "../shared/components/PropsRoute";
import Home from "./home/Home";
import useLocationBlocker from "../shared/functions/useLocationBlocker";
import LoginPage from "./home/LoginPage";

function Routing(props) {
  const { selectHome } = props;
  const location = useLocation();
  const authToken = Cookies.get('authToken');

  useLocationBlocker();

  useEffect(() => {
    if (authToken && location.pathname === '/login') {
      window.location.href = '/';
    }
  }, [location, authToken]);

  return (
    <Switch>
      <PropsRoute exact path="/" component={Home} selectHome={selectHome} />
      {authToken ? <Redirect from="/login" to="/" /> : <PropsRoute path="/login" component={LoginPage} />}
    </Switch>
  );
}

Routing.propTypes = {
  selectHome: PropTypes.func.isRequired,
};

export default memo(Routing);
