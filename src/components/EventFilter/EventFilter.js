import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  eventFilterList  } from '../../api/eventApi';
import { filterClose, filterOpen } from '../../redux/actions/filter';
import { setStorage } from '../../utils/storage';
import { endLoading, startLoading } from '../../redux/actions/loading';
import ReactTooltip from 'react-tooltip';
// Components
import CheckBox from '../CheckBox/CheckBox';

// Styles
import './EventFilter.scss';

// Images
import FilterOnImage from '../../assets/images/img_filter_on.png';
import FilterOffImage from '../../assets/images/img_filter_off.png';

const EventFilter = React.memo(({ uncheckedFilterData, setUncheckedFilterData, checkedFilterData, setCheckedFilterData, setEventFilterState, startDate, isPeriod}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email } = useSelector(({user}) => user.value);

    const filterState = useSelector(({filter}) => {
        return filter.value.isOpen;
    });

    // Filter 항목 데이터 State
    const[filterData, setFilterData] = useState({});
    // 필터에 선택된 항목 chart api에 적용하기위한 state

    // Filter 접기/펼치기 State
    const[isFilterOpen, setIsFilterOpen] = useState(filterState);

    const side = useRef(); 

    const handleCloseSide = (e) => {
        if(!side.current?.contains(e.target)){
            setIsFilterOpen(false);
            setEventFilterState(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleCloseSide);
        return () => {
            document.removeEventListener("mousedown", handleCloseSide);
            };
        }, []);
      
    /**
    * uncheckedFilterData 가 없는 경우(필터를 모두 선택한 경우) 필터를 갱신한다.
    */
    const checkFilter = () => {
        let result = true;
        for (const item of Object.values(uncheckedFilterData)) {
            if (Object.values(item).length !== 0) {
                result = false;
            }
        }
        return result;
    }

    // 최초 Filter 데이터 세팅, 날짜 변경 시 선택된 데이터 초기화
    // | serviceName: 서비스 | crashType: 이벤트타입 | device: 디바이스 | os: OS | eventType: 개발언어
    useEffect(() => {

        if(startDate === 0) return;

        dispatch(startLoading());
        const start = startDate;
        const end = new Date().getTime();

        eventFilterList(start, end).then((result)=>{
            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                return;
            }
            // API 요청 성공
            let eventData = result.data;
            // 필터 api 결과값에 빈배열이 있다면(잘못된 데이터로 판단)
            let trg = false;
            Object.values(eventData).forEach(item=>{
                if(trg) return;
                if(item.length == 0 ) trg = true; 
            });
            if(trg) eventData = {eventType:[], crashType:[], serviceName: [], os: [], device:[]};
            
            setFilterData(eventData);
            /** storage에 저장된 데이터가 없거나 필터를 모두 선택한 경우 초기화 */
            if(Object.values(checkedFilterData).length === 0 || checkFilter()){
                setCheckedFilterData(eventData);
                setStorage(email+"check", JSON.stringify(eventData));
            }

            /** 조회 기간 클릭 시 필터 정보 초기화 */
            if(isPeriod){
                setCheckedFilterData(eventData);
                setUncheckedFilterData({});
                setStorage(email + "check", JSON.stringify(eventData));
                setStorage(email + "uncheck", JSON.stringify({"eventType":[]}));
            }
        })
        dispatch(endLoading());

    }, [dispatch, navigate, startDate]);

    useEffect(() => {
        if(Object.keys(uncheckedFilterData).length === 0 || uncheckedFilterData === undefined) return;
        // 브라우저에 필터 정보 저장
        setStorage(email+"check", JSON.stringify(checkedFilterData));
        setStorage(email+"uncheck", JSON.stringify(uncheckedFilterData));
    }, [uncheckedFilterData, email]);

    // Filter 접기, 펼치기 이벤트
    const handleFilterHide = () => {
        // 필터 접기/펼치기
        dispatch(!isFilterOpen ? filterOpen() : filterClose());
        setIsFilterOpen(!isFilterOpen);
        setEventFilterState(!isFilterOpen);
    }

    // 체크박스 클릭 이벤트
    const handleChecked = (key, value) => {
        // checkedData 가 비어있을 시 []로 초기 설정
        if(uncheckedFilterData[key] === undefined) uncheckedFilterData[key] = [];

        let array = uncheckedFilterData[key];
        if(array?.includes(value)) 
            array = array.filter(item => item !== value);
        else
            array.push(value);

        setUncheckedFilterData({...uncheckedFilterData, [key] : array});

        let uArray = checkedFilterData[key];
        if(uArray?.includes(value))
            uArray = uArray.filter(item => item !== value);
        else
            uArray.push(value);

        setCheckedFilterData({...checkedFilterData, [key] : uArray});
    }

    const checkSelected = () => {
        for(const key of Object.keys(uncheckedFilterData)){
            if(Object.keys(uncheckedFilterData[key]).length !== 0) return true;
        }
        return false;
    }

    /** 
     * 체크박스 Title 클릭 이벤트 
     * @param {string} key Filter 항목
     */
    const handleAllChecked = (key) => {
        // checkedData 가 비어있을 시 []로 초기 설정
        if(uncheckedFilterData[key] === undefined) uncheckedFilterData[key] = [];

        let array = uncheckedFilterData[key];
        let uArray = checkedFilterData[key];

        if(array?.length === 0){
            array = filterData[key];
            uArray = [];
        }
        else{
            array = [];
            uArray = filterData[key];
        }

        setUncheckedFilterData({...uncheckedFilterData, [key] : array});
        setCheckedFilterData({...checkedFilterData, [key] : uArray});

    }


    return (
        <div className={isFilterOpen ? 'eventFilter' : 'eventFilter-hide'} ref={side}>
        {Object.values(filterData).length !== 0 ?
            <div className='contents'>
                <div className='area'>
                    <CheckBox text='서비스' textSize={20} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={uncheckedFilterData?.serviceName === undefined || uncheckedFilterData?.serviceName?.length === 0} onClick={() => handleAllChecked('serviceName')} />
                    <div className='sub'>
                        {filterData?.serviceName?.map((value) => {
                            return(
                                <span key={value} data-tip={value}>
                                    <CheckBox text={value} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={!uncheckedFilterData?.serviceName?.includes(value)} onClick={() => handleChecked('serviceName', value)} />
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div className='area'>
                    <CheckBox text='이벤트종류' textSize={20} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={uncheckedFilterData?.crashType === undefined || uncheckedFilterData?.crashType?.length === 0} onClick={() => handleAllChecked('crashType')} />
                    <div className='sub'>
                        {filterData?.crashType?.map((value) => {
                            return(
                                <span key={value} data-tip={value}>
                                    <CheckBox text={value === "undefined" ? '(없음)' : value} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={!uncheckedFilterData?.crashType?.includes(value)} onClick={() => handleChecked('crashType', value)} />
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div className='area'>
                    <CheckBox text='OS' textSize={20} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={uncheckedFilterData?.os === undefined || uncheckedFilterData?.os?.length === 0} onClick={() => handleAllChecked('os')} />
                    <div className='sub'>
                        {filterData?.os?.map((value) => {
                            return(
                                <CheckBox key={value} text={value} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={!uncheckedFilterData?.os?.includes(value)} onClick={() => handleChecked('os', value)} />
                            )
                        })}
                    </div>
                </div>
                <div className='area'>
                    <CheckBox text='개발언어' textSize={20} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={uncheckedFilterData?.eventType === undefined || uncheckedFilterData?.eventType?.length === 0} onClick={() => handleAllChecked('eventType')} />
                    <div className='sub'>
                        {filterData?.eventType?.map((value) => {
                            return(
                                <span key={value} data-tip={value}>
                                    <CheckBox text={value === "" ? '(없음)' : value} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={!uncheckedFilterData?.eventType?.includes(value)} onClick={() => handleChecked('eventType', value)} />
                                </span>
                            )
                        })}
                    </div>
                </div>
                <div className='area'>
                    <CheckBox text='디바이스' textSize={20} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={uncheckedFilterData?.device === undefined || uncheckedFilterData?.device?.length === 0} onClick={() => handleAllChecked('device')} />
                    <div className='sub'>
                        {filterData?.device?.map((value) => {
                            return(
                                <span key={value} data-tip={value}>
                                    <CheckBox text={value} textColor='#B7D2FF' checkboxColor='#B7D2FF' checked={!uncheckedFilterData?.device?.includes(value)} onClick={() => handleChecked('device', value)} />
                                </span>
                            )
                        })}
                    </div>
                </div>
                <ReactTooltip effect='solid' padding='15px' />
            </div>
            : null }
            <div className="sidebar-button-frame">
                <img className='filter-button' src={isFilterOpen ? FilterOnImage : FilterOffImage} alt="Filter 버튼" onClick={handleFilterHide} />
            </div>
            { (!isFilterOpen && checkSelected()) ? <div className='selectedFilter'></div> : null }
        </div>
    );
});

export default EventFilter;