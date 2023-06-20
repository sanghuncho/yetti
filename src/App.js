import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, Suspense } from 'react';
import { getStorage, removeStorage } from './utils/storage';
import { login } from './redux/actions/user';
import { endLoading, startLoading } from './redux/actions/loading';
import { getUserInfo } from './api/userApi';
import routes from './libs/routes';
import './App.scss'

import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import Loading from './components/Loading/Loading';

const LazyLogin = React.lazy(()=> import('./pages/Login/Login'));
const LazyEvent = React.lazy(()=> import('./pages/Event/Event'));
const LazyJoin = React.lazy(()=> import('./pages/Join/Join'));
const LazyFindPassword = React.lazy(()=> import('./pages/FindPassword/FindPassword'));
const LazyStatistics = React.lazy(()=> import('./pages/Statistics/Statistics'));
const LazyManagement = React.lazy(()=> import('./pages/Management/Management'));
const LazyNotification = React.lazy(()=> import('./pages/Notification/Notification'));
const LazyFAQ = React.lazy(()=> import('./pages/Faq/Faq'));

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector(({user}) => {return user.isLogin;});
  const isLoading = useSelector(({loading}) => {return loading.isLoading});

  // 세션 정보 확인
  const checkSession = useCallback(async() => { 
    if(getStorage('login') && !isLogin) {
      try {
        dispatch(startLoading());
        const userInfo = await getUserInfo();
      
        // code -1010 : 로그인 세션 만료 / 로그인 상태 X
        if(userInfo.code === -1010) {
          // 로그인 정보 제거
          removeStorage('login');
          dispatch(endLoading());
          return;
        }
  
        // code 0 이 아님 : API 요청 실패
        if(userInfo.code !== 0) {
          console.log(userInfo.message);
          dispatch(endLoading());
          return;
        }
        
        // API 요청 성공
        dispatch(login(userInfo.data));

      } catch(error) {
        console.log(error);
      }
    } 
    dispatch(endLoading());
  }, [dispatch, isLogin]);

  useEffect(() => {
    checkSession();
  }, [checkSession])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      {isLoading && <Loading />}
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={routes.main} element={<PrivateRoute><Navigate replace to={routes.event}/></PrivateRoute>} />
        <Route path={routes.login} element={<PublicRoute restricted={true}><LazyLogin /></PublicRoute>} />
        <Route path='/join/*' element={<PublicRoute restricted={true}><LazyJoin /></PublicRoute>} />
        <Route path='/findPassword/*' element={<PublicRoute restricted={true}><LazyFindPassword /></PublicRoute>} />
        <Route path={routes.event} element={<PrivateRoute><LazyEvent /></PrivateRoute>} />
        <Route path={routes.statistics} element={<PrivateRoute><LazyStatistics /></PrivateRoute>} />
        <Route path={routes.management} element={<PrivateRoute><LazyManagement /></PrivateRoute>} />
        <Route path={routes.notification} element={<PrivateRoute><LazyNotification/></PrivateRoute>} />
        <Route path={routes.faq} element={<PrivateRoute><LazyFAQ/></PrivateRoute>} />
      </Routes>
        </Suspense>
    </Router>
  );
}

export default App;
