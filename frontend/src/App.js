import React, { Fragment, Suspense, lazy, useContext } from "react";
import { ThemeProvider, StyledEngineProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import Pace from "./shared/components/Pace";
import withAuth from "./shared/components/WithAuth";
import AuthContext from './shared/components/AuthContext';

const LoggedInComponent = withAuth(lazy(() => import("./logged_in/Main")));

const LoggedOutComponent = lazy(() => import("./logged_out/Main"));

const LoggedInCoachComponent = withAuth(lazy(() => import("./logged_in_coach/Main")));

const LoggedInAdminComponent = withAuth(lazy(() => import("./logged_in_admin/Main")));

function App() {
  const { userType } = useContext(AuthContext);

  let ComponentToRender;
  switch(userType) {
    case 'coach':
      ComponentToRender = LoggedInCoachComponent;
      break;
    case 'admin':
      console.log("Switching to Admin Component");
      ComponentToRender = LoggedInAdminComponent;
      break;
    case 'logged_out':
      ComponentToRender = LoggedOutComponent;
      break;
    default:
      ComponentToRender = LoggedInComponent;
  }

  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <Pace color={theme.palette.primary.light} />
          <Suspense fallback={<Fragment />}>
            <Switch>
              <Route path="/c">
                {ComponentToRender && <ComponentToRender />}
              </Route>
              <Route path="/" exact>
                <LoggedOutComponent />
              </Route>
            </Switch>
          </Suspense>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;