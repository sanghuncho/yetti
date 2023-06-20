import React, { useEffect, useState } from 'react';
import { eventSummaryInfoData } from '../../temporary/eventList';
import Swal from 'sweetalert2';

// Components
import DataForm from '../DataForm/DataForm';

// Styles
import './EventTooltip.scss';

const EventTooltip = ({children, data}) => {

    // 이벤트 요약 정보 State
    const[summaryInfo, setSummaryInfo] = useState({});

    useEffect(() => {
        // 이벤트 요약 정보 API 연동
        // eventSummaryInfo(data.id).then((result) => {
        //     // code -1010 : 로그인 세션 만료 / 로그인 상태 X
        //     if(result.code === -1010) {
        //         // 로그인 정보 제거
        //         dispatch(logout);
        //         removeStorage('login');

        //         // 로그인 화면으로 이동
        //         Swal.fire({
        //             icon: 'warning',
        //             text: "세션이 만료되었습니다. 다시 로그인해 주시기 바랍니다.",
        //             allowOutsideClick: true,
        //             buttonsStyling:true
        //         });
        //         navigate(routes.login);
        //         return;
        //     }

        //     // code 0 이 아님 : API 요청 실패
        //     if(result.code !== 0) {
        //         errorMsg(result.message);
        //         return;
        //     }
    
        //     // API 요청 성공
        //     setSummaryInfo(result.data);
        // })

        setSummaryInfo(eventSummaryInfoData.data);
    }, [data]);

    return (
        <div className='container'>
            {children}
            <div className="eventTooltip">
                <div className='detail'>
                    <p>이벤트 상세</p>
                    <div className='summary'>
                        <DataForm title='이벤트 개요' width={540}>
                            <div className='info'>
                                <span className='infoTitle'>동일 오류 발생 건수</span>
                                {`${summaryInfo && summaryInfo?.errorCount} / ${summaryInfo && summaryInfo?.allErrorCount}(전체)`}
                            </div>
                        </DataForm>
                    </div>
                    <div className='eventName'>
                        {data.eventName}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventTooltip;