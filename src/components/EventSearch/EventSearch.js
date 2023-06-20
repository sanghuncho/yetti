import React, { useEffect, useState } from 'react';
import { eventChartInfo, eventSearch, eventSearchConditions } from '../../api/eventApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { dateTime } from '../../utils/time';
import { errorMsg, alertMessage, iconLevel } from '../../utils/message';
import routes from '../../libs/routes';
import {checkLogin} from '../../utils/isLogin';

// Components
import DatePicker from '../DatePicker/DatePicker';
import CheckBox from '../CheckBox/CheckBox';

// Images & Icons
import { ReactComponent as SearchIcon } from '../../assets/icons/ic_search.svg';
import { ReactComponent as CancelIcon } from '../../assets/icons/ic_cancel.svg';
 
// Styles
import './EventSearch.scss';
import '../../styles/sweetalert2.scss';
import "react-datepicker/dist/react-datepicker.css";

const EventSearch = ({setStartDate, setEndDate, setData, setChart, setResetTable, setCheckedSearchKey}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 조회 기간 State
    const [startDatePicker, setStartDatePicker] = useState(new Date());
    const [endDatePicker, setEndDatePicker] = useState(new Date());

    // 검색조건 전체 데이터 및 체크한 데이터 State
    const[searchData, setSearchData] = useState({});
    const[checkedData, setCheckedData] = useState({});

    // 출력 데이터 및 검색어 저장 State
    const[outputData, setOutputData] = useState([]);
    const[search, setSearch] = useState("");

    // | 기간 : period | 서비스 : serviceName | 개발언어 : eventType | 디바이스 : device | OS : os | 이벤트종류 : crashType |
    const[menu, setMenu] = useState('period');

    useEffect(() => {
        dispatch(startLoading());
        eventSearchConditions().then((result) => {
            if (!checkLogin(dispatch, result.code)){
                navigate(routes.login);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if (result.code !== 0) {
                errorMsg(result.message);
                return;
            }
           
            // API 요청 성공
            setSearchData(result.data);
            dispatch(endLoading());
        }).catch(error => {
            errorMsg(JSON.stringify(error));
            dispatch(endLoading());
        });
    }, [dispatch, navigate]);

    // 실시간 검색창 입력 이벤트
    useEffect(() => {
        if(search === null || search === '') setOutputData(searchData[menu]);
        else {
            // 검색리스트에 null(개발언어) 이 포함되는 경우, null 제거
            const search_upper = search.toUpperCase();
            if(menu === 'device'){
                const searchResult = searchData[menu]
                .filter((item) => item != null && item.name.toUpperCase().includes(search_upper) || item.friendlyname.toUpperCase().includes(search_upper));
                setOutputData(searchResult);
            }else{
                const searchResult = searchData[menu].filter((item) => item != null && item.toUpperCase().includes(search_upper));
                setOutputData(searchResult);
            }
        }
    }, [search, searchData]);

    useEffect(() => {
        setSearch("");
    }, [menu]);

    /** 검색어 입력 이벤트 */
    const onChangeSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    /** 메뉴 클릭 이벤트 */
    const handleMenu = (menuKey) => {
        setMenu(menuKey);
        if(menuKey === 'period') setOutputData([]);
        else setOutputData(searchData[menuKey].filter((item) => item != null)); // 검색 리스트가 null 인 값 제거
    }

    /** 전체 선택 체크 이벤트 */
    const handleCheckedAll = () => {
        if(checkedData[menu] === undefined) setCheckedData(pre => ({...pre, [menu]: []}));

        // 전체 선택에 체크 되어 있을 땐 현재 출력중인 아이템들만 checkedData에서 삭제
        if(outputData?.length === checkedData[menu]?.filter(item => outputData?.includes(item)).length){
            setCheckedData(pre => ({...pre, [menu] : checkedData[menu]?.filter(item => !outputData?.includes(item))}));
        }

        // 전체 선택에 체크가 되어 있지 않을 때
        else {
            let array = [];

            // checkedData의 해당 메뉴 값이 있을 땐 배열 합친 후 중복 제거
            if(checkedData[menu]) {
                let array2 = [...checkedData[menu], ...outputData];
                const set = new Set(array2);
                array = [...set];
            }
            else array = outputData;
            setCheckedData(pre => ({...pre, [menu] : [...array]}));
        }
    }

    /** 검색 아이템 체크 이벤트 */
    const handleChecked = (data) => {
        if(checkedData[menu] === undefined) checkedData[menu] = [];

        let array = [];
        if(checkedData[menu].includes(data)){
            array = checkedData[menu].filter((item) => item !== data)
            setCheckedData(pre => ({...pre, [menu] : array}));
        } else {
            array = checkedData[menu];
            array.push(data);
            setCheckedData(pre => ({...pre, [menu] : array}));
        }
    }

    /** 검색 버튼 클릭 이벤트 */
    const handleClickSearch = () => {
        if(search === null || search === '') setOutputData(searchData[menu]);
        else {
            const searchResult = searchData[menu].filter((item) => item.includes(search));
            setOutputData(searchResult);
        }
    }

    /** Checked 아이템 remove 이벤트 */
    const handleRemoveChecked = (key, data) => {
        let array = checkedData[key].filter((item) => item !== data);
        setCheckedData(pre => ({...pre, [key] : array}));
    }

    /** 검색 이벤트 */
    const handleSearch = async() => {

        if(checkedData === {}) {
            alertMessage(iconLevel.WARNING, "검색 조건을 입력해주세요.");
            return;
        }
        
        dispatch(startLoading());
        /** API 사용법에 맞게 */
        endDatePicker.setHours(23, 59, 59);
        startDatePicker.setHours(0, 0, 0);

        let checkedSearchKey = {
            start: startDatePicker,
            end: endDatePicker
        };

        for (let item in checkedData) {
            if (checkedData[item]) checkedSearchKey[item] = checkedData[item];
        }

        let result = await eventSearch(
            checkedSearchKey['serviceName'],
            checkedSearchKey['eventType'],
            checkedSearchKey['device'],
            checkedSearchKey['os'],
            checkedSearchKey['crashType'],
            checkedSearchKey['start'],
            checkedSearchKey['end']
        );

        let chartRes = await eventChartInfo(
            new Date(startDatePicker).getTime(),
            new Date(endDatePicker).getTime(),
            checkedSearchKey.serviceName,
            checkedSearchKey.eventType,
            checkedSearchKey.device,
            checkedSearchKey.os,
            checkedSearchKey.crashType
        );

        if (!checkLogin(dispatch, result.code) || !checkLogin(dispatch, chartRes.code)) {
            navigate(routes.login);
            dispatch(endLoading());
            return;
        }

        // code 0 이 아님 : API 요청 실패
        if(result.code !== 0) {
            errorMsg(result.message);
            dispatch(endLoading());
            return;
        }else if(chartRes.code !== 0){
            errorMsg(chartRes.message);
            dispatch(endLoading());
            return;
        }
            
        // API 요청 성공
        alertMessage(iconLevel.SUCCESS, "검색되었습니다.");

        setStartDate(startDatePicker.getTime());
        setEndDate(endDatePicker.getTime());

        setChart(chartRes.data); //검색 후 차트 데이터 입력
        setData(result.data.reverse()); //검색 후 테이블 데이터 입력
        setCheckedSearchKey(checkedSearchKey);
        setResetTable(true);
        dispatch(endLoading());
    }
    const makeDeviceName = (device) => {
        return device.friendlyname + " [ " + device.name +" ]";
    };

    return (
        <div className='eventSearch'>
            <div className='searchBtn'>
                <div className='colorBtn'>
                <button style={menu === 'period' ? {color: 'white', backgroundColor: '#6588CD'} : null} onClick={() => handleMenu('period')}>기간</button>
                <span className='period'></span>
                </div>
                <div className='colorBtn'>
                <button style={menu === 'serviceName' ? {color: 'white', backgroundColor: '#6588CD'} : null} onClick={() => handleMenu('serviceName')}>서비스</button>
                <span className='serviceName'></span>
                </div>
                <div className='colorBtn'>
                <button style={menu === 'eventType' ? {color: 'white', backgroundColor: '#6588CD'} : null} onClick={() => handleMenu('eventType')}>개발언어</button>
                <span className='eventType'></span>
                </div>
                <div className='colorBtn'>
                <button style={menu === 'device' ? {color: 'white', backgroundColor: '#6588CD'} : null} onClick={() => handleMenu('device')}>디바이스</button>
                <span className='device'></span>
                </div>
                <div className='colorBtn'>
                <button style={menu === 'os' ? {color: 'white', backgroundColor: '#6588CD'} : null} onClick={() => handleMenu('os')}>운영체제</button>
                <span className='os'></span>
                </div>
                <div className='colorBtn'>
                <button style={menu === 'crashType' ? {color: 'white', backgroundColor: '#6588CD'} : null} onClick={() => handleMenu('crashType')}>이벤트종류</button>
                <span className='crashType'></span>
                </div>
            </div>
            {menu === 'period' ?
                <div className='searchContents'>
                    <DatePicker startDate={startDatePicker} endDate={endDatePicker} setStartDate={setStartDatePicker} setEndDate={setEndDatePicker}/>
                </div>
                :
                <div className='searchContents'>
                    <div className='searchBar'>
                        <input type='text' value={search} onChange={onChangeSearch} placeholder='검색어를 입력하세요.' />
                        {/* <SearchIcon className='icon' onClick={handleClickSearch} /> */}
                    </div>
                    <div className='checkboxList'>
                        {
                            outputData?.length > 0 &&
                            <CheckBox text='전체선택' textColor='#4E4E4E' checkboxColor='#4E4E4E' onClick={handleCheckedAll} checked={outputData?.length === checkedData[menu]?.filter(item => outputData?.includes(item)).length ? true : false} />
                        }
                        {outputData?.map((item, index) => {
                            if(menu === 'device'){
                                return(
                                <CheckBox key={index} text={ makeDeviceName(item)} textColor='#808080' fontWeight={400} checkboxColor='#808080' onClick={() => handleChecked(item)} checked={checkedData[menu] && checkedData[menu]?.includes(item) ? true : false} />
                                )
                            }else{
                                return(
                                    <CheckBox key={index} text={`${item}`} textColor='#808080' fontWeight={400} checkboxColor='#808080' onClick={() => handleChecked(item)} checked={checkedData[menu] && checkedData[menu]?.includes(item) ? true : false} />
                                )
                            }
                        })}
                    </div>
                </div>}
            <div className='checkedItems'>
                <div className='buttons'>
                    <button className='init' onClick={() => {setCheckedData({}); setStartDatePicker(new Date()); setEndDatePicker(new Date());}}>초기화</button>
                    <button className='search' onClick={() => handleSearch()}>검색</button>
                </div>
                <div className='contents'>
                    {startDatePicker && endDatePicker ?
                        <span className='checkedItem' style={{maxWidth: 'none'}}>
                            <span className={`colorItem period`}/>
                            <CancelIcon className='icon' onClick={() => {setStartDatePicker(new Date()); setEndDatePicker(new Date());}} />
                            {dateTime(startDatePicker)} ~ {dateTime(endDatePicker)}
                        </span> : null
                    }
                    {checkedData && Object.keys(checkedData).map((item) => {
                        return(
                            checkedData[item].map((item2, index) => {
                                return(
                                    <span className='checkedItem' key={index}>
                                        <span className={`colorItem ${item}`}/>
                                        <CancelIcon className='icon' onClick={() => handleRemoveChecked(item, item2)}/>
                                        {item === 'device' ?
                                        <span>{item2.name}</span> :
                                        <span>{item2}</span>}
                                        </span>
                                )
                            })
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EventSearch;