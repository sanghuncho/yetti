import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { eventDetailList, eventSummaryInfo } from '../../api/eventApi';
import { KbToGb, NumberWithComma } from '../../libs/regex';
import { secondTime } from '../../utils/time';
import { logout } from '../../redux/actions/user';
import { removeStorage } from '../../utils/storage';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { eventSummaryInfoData } from '../../temporary/eventList';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { errorMsg } from '../../utils/message';
import routes from '../../libs/routes';
import Swal from 'sweetalert2';

// Components
import DetailModal from '../Modal/DetailModal';
import EventDetailTable from '../EventInfoTable/EventInfoTable';
import Title from '../Title/Title';
import EventDownload from '../EventDownload/EventDownload';
import Appinfo from './AppInfo/AppInfo';
import Aside from './Aside/Aside';
import ErrorEventTable from './ErrorEventTable/ErrorEventTable';
import Threads from './Threads/Threads';

import SplitPane from '../SplitPane/SplitPane';

// Styles
import './EventDetailNewDesignModal.scss';

// icon
import { ReactComponent as DownloadIcon } from '../../assets/icons/ic_download.svg';
import { ReactComponent as ErrorInfoIcon } from '../../assets/icons/ic_errorInfo.svg';

const EventDetailNewDesignModal = ({eventId, handleModal}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const[eventDetail, setEventDetail] = useState({});
    const[eventDump, setEventDump] = useState({});

    // 기본정보 : basic | 오류정보 : event
    const[menu, setMenu] = useState('basic');

    // 선택된 오류 요약 정보 State
    const[summaryInfo, setSummaryInfo] = useState({});

    // 선택된 오류 요약 정보의 패키지 정보 State
    const[packageInfo, setPackageInfo] = useState({});

    // Thread 상세 정보 state
    const[threadInfo, setThreadInfo] = useState({});
    const[threadType, setThreadType] = useState('crash');

    //클릭 여부
    const[isCrash, setIsCrash] = useState(false);

    useEffect(() => {
        dispatch(startLoading());
        // 이벤트 상세 정보 API 연동
        eventDetailList(eventId, false).then((result) => {

            // code -1010 : 로그인 세션 만료 / 로그인 상태 X
            if(result.code === -1010) {
                // 로그인 정보 제거
                dispatch(logout);
                removeStorage('login');

                // 로그인 화면으로 이동
                Swal.fire({
                    icon: 'warning',
                    text: "세션이 만료되었습니다. 다시 로그인해 주시기 바랍니다.",
                    allowOutsideClick: true,
                    buttonsStyling:true
                });
                navigate(routes.login);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }
    
            // API 요청 성공
            setEventDetail(result.data[0]);
            setEventDump(result);
        })
        dispatch(endLoading());
    }, [eventId, dispatch, navigate]);

    // 오류 정보 클릭 시 이벤트 요약 정보 실행
    useEffect(() => {
        if(menu === 'basic') return;
        dispatch(startLoading());
        // 이벤트 요약 정보 API 연동
        // eventSummaryInfo(eventId).then((result) => {
        //     // code -1010 : 로그인 세션 만료 / 로그인 상태 X
        //     if(result.code === -1010) {
        //         // 로그인 정보 제거
        //         dispatch(logout);
        //         removeStorage('login');

        //         // 로그인 화면으로 이동
        //         Swal.fire({
        //             icon: 'warning',
        //             text: "세션이 만료되었습니다. 다시 로그인해 주시기 바랍니다.",
        //              allowOutsideClick: true,
        //              buttonsStyling:true
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
        dispatch(endLoading());
    }, [menu])


    const threadInfoCallback = (data, type) => {
        setThreadInfo(data);
        setThreadType(type);
        if(type === 'crash')
            setIsCrash(true);
        else{
            setIsCrash(false);
        }
    }

/** Json 저장 클릭 이벤트 */
const handleJsonDownload = () => {
    const blob = new Blob([JSON.stringify(eventDetail)], { type: 'application/json' });

    const link = document.createElement('a');
    link.download = "appcatch-data-json.json";
    link.href = URL.createObjectURL(blob);

    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(clickEvt);
    link.remove();
}

/** 크래시덤프 저장 클릭 이벤트 */
const handleDumpDownload = () => {
    debugger;
    const blob = new Blob([JSON.stringify(eventDump)], { type: 'application/json' });

    const link = document.createElement('a');
    link.download = "appcatch-data-dump.json";
    link.href = URL.createObjectURL(blob);

    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(clickEvt);
    link.remove();
}

const modalWidth = 900;
const modalLeftWidth = 140;
const modalRightWidth = modalWidth - modalLeftWidth;

    return (
        <DetailModal isOpen={eventId !== null} setIsOpen={handleModal} headerTitle='이벤트 상세정보' width={modalWidth} height={600}>
            { Object.entries(eventDetail).length !== 0 ?
            <>
            { menu === 'basic' ?
            <SplitPane split="vertical" defaultSize={modalLeftWidth} allowResize={false}>
                <div className='children3' >
                    <div className="aside">
                        <div className="asideMenu">
                            <button className='menuSelect' onClick={() => setMenu('basic')}>기본정보</button>
                            <button onClick={() => setMenu('event')}>오류정보</button>
                        </div>
                        <div className='asideDownBtn'>
                            <button onClick={handleJsonDownload}><DownloadIcon className='icon' />JSON 저장</button>
                            <button onClick={handleDumpDownload}><DownloadIcon className='icon' />크래시덤프 저장</button>
                        </div>
                    </div>
                </div>
                <Appinfo eventDetail={eventDetail}/>
            </SplitPane>
            :
            // menu === 'event'
            <>
            {Object.entries(summaryInfo).length !== 0 ?
            <div className="chldrnWrap">
                <SplitPane split='horizontal' defaultSize={250} primary='second' minSize={250} maxSize={800} pane1Style={{height: '100px'}} style={{}}>
                    <SplitPane split="vertical" defaultSize={modalLeftWidth} pane2Style={{width: modalRightWidth}} allowResize={false}>
                        <div className='children2'>
                            <div className="aside">
                                <div className="asideMenu">
                                    <button onClick={() => setMenu('basic')}>기본정보</button>
                                    <button className='menuSelect' onClick={() => setMenu('event')}>오류정보</button>
                                </div>
                                <div className='asideDownBtn'>
                                    <button onClick={handleJsonDownload}><DownloadIcon className='icon' />JSON 저장</button>
                                    <button onClick={handleDumpDownload}><DownloadIcon className='icon' />크래시덤프 저장</button>
                                </div>
                            </div>
                        </div>
                        <ErrorEventTable eventDetail={eventDetail} threadInfoCallback={threadInfoCallback} />
                    </SplitPane>
                    <Threads osName={eventDetail.os.name} threadInfo={threadInfo} threadType={threadType} isCrash={isCrash} />
                </SplitPane>
            </div>
            : null}
            </>
            }
            </>
            : null}
        </DetailModal>
    )
}
export default EventDetailNewDesignModal;