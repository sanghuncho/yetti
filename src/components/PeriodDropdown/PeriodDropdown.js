import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { eventChartInfo, eventSearch} from '../../api/eventApi';
import { checkLogin } from '../../utils/isLogin';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { errorMsg, alertMessage, iconLevel } from '../../utils/message';
import routes from '../../libs/routes';

import {getToday, getDaySeconds, getWeekSeconds, getMonthSeconds} from '../../utils/time';

// Styles
import './PeriodDropdown.scss';
import './PeriodDropDownBack.scss'
import '../../styles/sweetalert2.scss';
import { useRef } from 'react';
import { useEffect } from 'react';

const PeriodDropdown = React.memo((props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { onClose, setData, setStartDate, setChart, setResetTable, setIsPeriod } = props;

    /** 조회기간 검색 이벤트 */
    const handleSearchPeriod = async(period) => {
        // start: 시작기간 | end: 끝 기간
        let start;
        let end = getToday();

        // 1시간 검색
        if (period === 'hour') { start = new Date().getTime() - (60 * 60 - 1) * 1000; }

        // 6시간 검색
        else if (period === '6hours') { start = new Date().getTime() - (60 * 60 * 6 - 1) * 1000; }

        // 1일 검색
        else if (period === 'day') { start = end - (getDaySeconds() - 1 * 1000); }

        // 30일 검색
        else if (period === 'month') { start = end - (getMonthSeconds() - 1 * 1000); }

        // 자동 검색 7일 (기본값)
        else if (period === 'auto') { start = end - (getWeekSeconds() - 1 * 1000); }

        else {
            alertMessage(iconLevel.ERROR, "오류가 발생했습니다. 새로고침 후 다시 진행해주세요.");
            return;
        }

        try {
            dispatch(startLoading);
            let result = await eventSearch(
                [], [], [], [],[],
                start, end, 0
            );

            let chartRes = await eventChartInfo(start, end);

            if (!checkLogin(dispatch, result.code) || !checkLogin(dispatch, chartRes.code)) {
                navigate(routes.login);
                dispatch(endLoading);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                dispatch(endLoading);
                return; 
            }else if(chartRes.code !== 0){
                errorMsg(chartRes.message);
                dispatch(endLoading);
                return;
            }
    
            // API 요청 성공
            setChart(chartRes.data);
            setData(result.data.reverse());
            setStartDate(start);
            setResetTable(true);

            if (result.data.length === 0) {
                // 조회된 내용이 없음 알림
                alertMessage(iconLevel.INFO, "조회된 내용이 없습니다.");
            }else{
                /** 데이터가 있을 경우 period 초기화, 없으면 초기화하지 않는다. */
                setIsPeriod(true);
            }

        } catch (error) {
            console.log(error);
        }
        dispatch(endLoading);
    }

    const periodRef = useRef();
    useEffect(()=>{
      document.addEventListener('mousedown', handleClickOutside);
  
      return()=>{
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
    })
    const handleClickOutside=(event)=>{
      if (periodRef && !periodRef.current.contains(event.target)) {
        onClose(false);
      }
      else {
        onClose(true);
      }
    }

    return (
        <div className='periodDropDownBack' ref={periodRef}>
            <div className='periodDropdown'>
                <li onClick={() => {handleSearchPeriod('hour'); onClose(false);}}>1시간</li>
                <li onClick={() => {handleSearchPeriod('6hours'); onClose(false);}}>6시간</li>
                <li onClick={() => {handleSearchPeriod('day'); onClose(false);}}>1일</li>
                <li onClick={() => {handleSearchPeriod('auto'); onClose(false);}}>자동(7일)</li>
                <li onClick={() => {handleSearchPeriod('month'); onClose(false);}}>30일</li>
            </div>
        </div>
    );
});

export default PeriodDropdown;