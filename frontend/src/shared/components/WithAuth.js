import React from 'react';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const authToken = Cookies.get('authToken');
        const isAuthenticated = authToken !== undefined;

        if (!isAuthenticated) {
            return <Redirect to="/login" />; // Redirect to login page
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;