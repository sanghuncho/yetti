import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from '../../utils/isLogin';
import routes from '../../libs/routes';

const PublicRoute = ({restricted, children}) => {
    return !isLogin() && restricted ? children : <Navigate replace to={routes.event}/>
};

export default PublicRoute;