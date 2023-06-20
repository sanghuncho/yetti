import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from '../../utils/isLogin';
import routes from '../../libs/routes';

const PrivateRoute = ({children}) => {
    return isLogin() ? children : <Navigate replace to={routes.login}/>
};

export default PrivateRoute;