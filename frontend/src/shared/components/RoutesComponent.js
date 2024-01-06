// RoutesComponent.js
import React, { useContext, Fragment, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthContext } from "../../shared/components/AuthContext";

const LoggedInComponent = lazy(() => import("../../logged_in/components/Main"));
const LoggedOutComponent = lazy(() => import("../../logged_out/components/Main"));

const RoutesComponent = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <Suspense fallback={<Fragment />}>
            <Switch>
                {isLoggedIn ? (
                    <Route path="/c">
                        <LoggedInComponent />
                    </Route>
                ) : (
                    <Route>
                        <LoggedOutComponent />
                    </Route>
                )}
            </Switch>
        </Suspense>
    );
};

export default RoutesComponent;