import React, { useEffect, useCallback,useState, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { detailDate, secondTime } from '../../utils/time';
import { eventDetailList, } from '../../api/eventApi';
import { errorMsg } from '../../utils/message';
import { checkLogin } from '../../utils/isLogin';
import routes from '../../libs/routes';

// Components
import CheckBox from '../CheckBox/CheckBox';
import EventDetailNewDesignModal from '../EventDetailModal/EventDetailNewDesignModal'
import EventDownload from '../EventDownload/EventDownload';
import EventTooltip from '../EventTooltip/EventTooltip';

// Styles
import './EventTable.scss';
import '../../styles/sweetalert2.scss';

const EventTable = React.memo(({ setTableIndex, startDate, eventData, isCollapseOpen, resetTable, setResetTable}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ref = useRef();

    const tableHead = [
        "종류",
        "발생일시",
        "서비스",
        "앱",
        // "버전",
        "개발언어",
        "내용",
        "디바이스",
        "운영체제",
        "기기식별",
    ];

    // 이벤트 데이터 값
    const[outputData, setOutPutData] = useState([]);    // 출력할 데이터
   
    // 체크 여부 State
    // const[checkedAll, setCheckedAll] = useState(false);     // 전체 항목 체크 여부
    // const[checkedEvents, setCheckedEvents] = useState([]);  // 체크된 이벤트 데이터
    // const[checkedEventsDump, setCheckedEventsDump] = useState([]);  // 체크된 이벤트 데이터

    // 모달 값 State
    const[modalEventId, setModalEventId] = useState(null);

    // eventData 변경 시 페이지, 체크 이벤트 초기화
    useEffect(() => {
        if (resetTable === true) { /** 테이블 초기화 */
            // 스크롤 맨 위로 이동
            reset();
            setOutPutData(eventData);
        } else {
            setOutPutData(pre => [...pre, ...eventData]);
        }
        setResetTable(false);
        // setCheckedAll(false);
    }, [eventData]);

    /** 날짜 변경 시 초기화 */
    useEffect(()=>{
        if(eventData.length === 0 ) return;
        reset();
    },[startDate]);

    const reset = ()=>{
        ref?.current?.scrollTo(0, 0);
        setTableIndex(0);
    };

    // 무한 스크롤 이벤트
    const handleScroll = useCallback(async() => {
        let scrollTop = ref.current.scrollTop;
        let scrollHeight = ref.current.scrollHeight;
        let clientHeight = ref.current.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            const item = outputData[outputData.length - 1];
            setTableIndex(item['id']);
        }
    }, [outputData]);
  


    // EventTable 스크롤 이벤트 리스너 적용
    useEffect(() => {
        let scrollRef = null;

        if(ref.current) {
            scrollRef = ref.current;
            scrollRef.addEventListener("scroll", handleScroll)
        }

        return () => {
            if(scrollRef) scrollRef.removeEventListener("scroll", handleScroll);
        }
    }, [ref, handleScroll]);

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    /** 
     * 체크박스 클릭 이벤트 
     * @param data 체크한 데이터
     */
    // const handleCheckBox = async(data) => {
    //     if(checkedEvents.includes(data)) {
    //         setCheckedEvents(pre => pre.filter((item) => item !== data))

    //         // 체크 해제된 덤프 파일 State 배열에서 제거    // 덤프 파일 == 이벤트 상세 전문 전체
    //         setCheckedEventsDump(pre => pre.filter((item) => item?.data[0].id !== data.id))
    //     }
    //     else {
    //         setCheckedEvents(pre => [...pre, data])

    //         // 체크된 덤프 파일 State 배열에 추가   // 덤프 파일 == 이벤트 상세 전문 전체
    //         let dumpData = await handleEventDetail(data);
    //         setCheckedEventsDump(pre => [...pre, dumpData]);
    //     }
    // }

    /** 체크박스 클릭(All) 이벤트 */
    // const handleCheckBoxAll = () => {
    //     if(checkedAll) {
    //         setCheckedEvents([]);
    //         setCheckedEventsDump([]);
    //     }
    //     else {
    //         setCheckedEvents(outputData);

    //         // 체크 데이터 모든 덤프 파일 State 저장     // 덤프 파일 == 이벤트 상세 전문 전체
    //         let array = [];
    //         outputData.forEach(async(item) => {
    //             let detail = await handleEventDetail(item);
    //             if(!detail) {
    //                 return false;
    //             }
    //             array.push(detail);
    //         });

    //         setCheckedEventsDump(array);
    //     }
    //     setCheckedAll(!checkedAll);
    // }


    /** Event Table row 클릭 이벤트 - 모달 이벤트 */
    const handleModal = (id) => {
        // 마지막 페이지 측정
        if(modalEventId === null) {
            setModalEventId(id);
        }
        else {
            setModalEventId(null);
        }
    }

    /** 크래시덤프 데이터(이벤트 상세 데이터) 세팅 */
    // const handleEventDetail = async(event) => {
    //     let object = {};
        
    //     try {
    //         let result = await eventDetailList(event.id, false);

    //         if (!checkLogin(dispatch, result.code)) {
    //             navigate(routes.login);
    //             return false;
    //         }

    //         // code 0 이 아님 : API 요청 실패
    //         if(result.code !== 0) {
    //             errorMsg(result.message);
    //             return false;
    //         }
            
    //         // API 요청 성공
    //         object = result;
    //     } catch(e) {
    //         console.log(e);
    //     }

    //     return object;
    // }
    return (
        <>
        {outputData && outputData.length !== 0 ? (
            <div className='eventTable'>
            {/* <div className='top'>
            <EventDownload disabled={checkedEvents.length === 0} downloadData={checkedEvents} dumpData={checkedEventsDump} />
            </div> */}
                <div>
                    <div className='eventTableArea' style={!isCollapseOpen ? {maxHeight: 860} : null} ref={ref}>
                        <table className='eventListTable'>
                            <thead>
                            <tr>
                            {tableHead.map((item, index) => {
                                return(
                                    <th key={index}>
                                        {item}
                                    </th>
                                )
                            })}
                            </tr>
                            </thead>
                            <tbody>
                                {outputData.map((item) => {
                                    // return <TableRow key={item.id} data={item} checkedEvents={checkedEvents} handleCheckBox={handleCheckBox} handleModal={handleModal} />
                                    return <TableRow key={item.id} data={item} handleModal={handleModal} />
                                })}
                            </tbody>

                        </table>
                        <ReactTooltip effect='solid' padding='15px' />
                    </div>
                </div>
                {/*modalEventId && <EventDetailModal eventId={modalEventId} handleModal={handleModal} />*/}
                {modalEventId && <EventDetailNewDesignModal eventId={modalEventId} handleModal={handleModal} />}
            </div>
            ) : (
                <div className='eventTable'>
                <div className='top'></div>
                <div>
                    <div className='noData'>조회된 데이터가 없습니다. </div>
                </div>
                </div>
            )
        }
        </>
    );
});

const TableRow = ({data, handleModal}) => {
    // 체크 시 배경색상 변경
    // const checkStyle = {backgroundColor: '#eefbfc'};
    return (
        <tr className='eventLine' key={data.id} onClick={() => handleModal(data.id)}>
            <td>
                {/* <CheckBox onClick={() => handleCheckBox(data)} /> */}
                <span data-tip={data.crashType} className={`type_${data.crashType}`}>{data.crashType.toUpperCase()}</span>
            </td>
            <td>
                <span data-tip={secondTime(data.time)}>{detailDate(data.time)}</span>
            </td>
            <td>
                <span data-tip={data.serviceName}>{data.serviceName}</span>
            </td>
            <td>
                <span data-tip={`${data.appName} ${data.appVersion}`}>{data.appName} {data.appVersion}</span>
            </td>
            {/* <td><span>{data.appVersion}</span></td> */}
            <td><span>{data.eventType}</span></td>
            <td>
                <span data-tip={data.eventName}>{data.eventName}</span>
            </td>
            {/*<td className='eventNameArea'>
                <EventTooltip data={data}>
                    <span>{data.eventName}</span>
                </EventTooltip>
            </td>*/}
            <td>
                <span data-tip={data.device}>{data.device}</span>
            </td>
            <td><span >{data.os} {data.osVersion.split(' ')[0]} </span></td>
            <td>
                <span data-tip={data.uid}>{data.uid}</span>
            </td>
        </tr>
    )
};

export default EventTable;