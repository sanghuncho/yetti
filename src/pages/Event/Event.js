import React, { useEffect, useState} from 'react';
import { dateTime, getToday, getWeekSeconds } from '../../utils/time';
import { eventChartInfo, eventSearch } from '../../api/eventApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage } from '../../utils/storage';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { errorMsg, alertMessage, iconLevel } from '../../utils/message';
import { checkLogin } from '../../utils/isLogin';
import routes from '../../libs/routes';

// Components
import Layout from '../../layout/MainLayout/MainLayout';
import EventTable from '../../components/EventTable/EventTable';
import Navbar from '../../components/Navbar/Navbar';
import MainCollapse from '../../components/MainCollapse/MainCollapse';
import EventChart from '../../components/EventChart/EventChart';
import EventSearch from '../../components/EventSearch/EventSearch';
import EventFilter from '../../components/EventFilter/EventFilter';
import NavButton from '../../components/NavButton/NavButton';
import PeriodDropdown from '../../components/PeriodDropdown/PeriodDropdown';

// Styles
import '../../styles/Event.scss';
import '../../styles/sweetalert2.scss';

const Event = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email } = useSelector(({user}) => user.value);

    // 이벤트 리스트 데이터(전체)
    const [data, setData] = useState([]);

    // Filter가 적용되어 출력되는 이벤트 리스트 데이터
    const [outputData, setOutputData] = useState([]);
    const [tableIndex, setTableIndex] = useState(0);

    // Filter가 열려있는지 확인하는 데이터
    const [eventFilterState, setEventFilterState] = useState(false);

    // api에서 받아오는 차트 데이터
    const [chart, setChart] = useState([]);
    // Chart 출력 데이터 State.
    const [chartData, setChartData] = useState({});

    // Main Slide 현재 출력되는 화면 State
    const [mainCollapse, setMainCollapse] = useState('chart');

    // Check된 항목 State
    const [uncheckedFilterData, setUncheckedFilterData] = useState({}); // 필터에서 사용하는 uncheck값 
    const [checkedFilterData, setCheckedFilterData] = useState({}); // api 호출시 파라미터로 넣는값

    // PeriodDropdown 닫기
    const [ popup, setPopup ] = useState(false); 

    //period 선택
    const [isPeriod, setIsPeriod] = useState(false);

    // 날짜
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);

    // 테이블 갱신
    const [resetTable, setResetTable] = useState(false);

    // 검색 필터 check 항목
    const [checkedSearchKey, setCheckedSearchKey] = useState({});

    // 화면 초기 데이터 가공 로직
    useEffect(() => {
        const end = getToday();
        const start = end - (getWeekSeconds() - 1000) ;
        
        setStartDate(start);
        setEndDate(end);

        dispatch(endLoading());
    }, [dispatch, navigate]);

    const makeDeviceList = (deviceArray) =>{
        let device = [];
        const deviceList = deviceArray;
        if (deviceList?.length ?? 0) {
            for (const item of deviceArray) {
                let deviceName = {};
                deviceName.friendlyname = item;
                device.push(deviceName);
            }
        }

        return device;
    };

    //스크롤 갱신시 사용
    const updateTable = (startIndex, start, end)=>{
        // 이벤트 리스트 api
        let searchData = checkedFilterData;
        let device = makeDeviceList(checkedFilterData['device']);

        // 검색한 필터가 있을 경우 해당 필터로 추가 데이터 갱신
        if (Object.keys(checkedSearchKey).length !== 0) {
            searchData = checkedSearchKey;
            device = checkedSearchKey['device'];
        }

        eventSearch(
            searchData['serviceName'],
            searchData['eventType'],
            // searchData['device'],
            device,
            searchData['os'],
            searchData['crashType'],
            start, end, startIndex
        )
        .then((result) => {

            if (!checkLogin(dispatch, result.code)) {
                navigate(routes.login);
                return;
            }
            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }
            
            // API 요청 성공
            const origin = result.data.reverse();
            setData(origin);
        }).catch((error) => {
            errorMsg(`${error?.message}`);
            return;
        });
    };

    useEffect(()=>{
        // 이벤트 리스트 limit이 50이기 때문에 그보다 작으면 데이터가 없다는 의미로 스크롤 막아둠
        if ( tableIndex !== 0) {
            if (data.length < 50) {
                alertMessage(iconLevel.WARNING, `더 이상 불러올 데이터가 없습니다.`);
                return;
            }
            updateTable(tableIndex, startDate, endDate);
        }
    }, [tableIndex]);

    useEffect(()=>{
        if(getStorage(email+"check")) {
            setCheckedFilterData(JSON.parse(getStorage(email+"check")));
            setUncheckedFilterData(JSON.parse(getStorage(email+"uncheck")));
        }else{
            /** 처음을 위해 빈값을 넣음 */
            setUncheckedFilterData({"eventType":[]});
        }
    }, [email]);

    // 표(테이블) 출력 데이터 세팅
    // serviceName: 앱 | crashType: 개발언어 | eventName: 오류내용 | device: 디바이스 | os: OS
    useEffect(() => {
        if (eventFilterState) return;
        if (Object.keys(uncheckedFilterData).length === 0) return;
        handleFilter();

        setIsPeriod(false);
    }, [uncheckedFilterData, eventFilterState]);

    useEffect(() => {
        if (data === undefined) return;
        // 데이터 출력이 끝나면. PeriodDropdown 을 초기화 한다.
        setOutputData(data);
        setPopup(false);
    }, [data]);

    /** 필터 목록이 비어있는 경우 서버로 요청을 보내지 않는다. 빈값으로 갱신한다. */
    const checkFilter = () => {
        let result = true;
        for (const item of Object.values(checkedFilterData)) {
            if (Object.values(item).length === 0) {
                result = false;
            }
        }
        return result;
    }

    const handleFilter = async() => {
        try {
            dispatch(startLoading());

            const start = startDate;
            const end = endDate;
            if (!checkFilter()) {
                const object = {
                    series: [{
                        data: [],
                        name: ''
                    }],
                    xaxis: []
                };

                const today = getToday();
                let start = startDate === 0 ? (today - (getWeekSeconds() - 1000)) : startDate;
                while(start <= today){
                    object.xaxis.push(dateTime(start));
                    start += 1000*60*60*24;
                }
                
                setChartData(object);
                setOutputData([]);
                setResetTable(true);
                // if문이 아닌 handleFilter 함수 return이 되기 때문에 주석처리
                // return;
            }

            // IF: check 필드에 빈배열이라면 api호출x, table, chart에 빈값을 넣어주는것이 맞음
            let trg = false;
            Object.values(checkedFilterData).forEach(item=>{
                if(item.length == 0 ){
                    setData([]);
                    setChart([]);
                    trg = true;
                }
            })
            if(trg) return;
            
            // ESLE : check에 빈배열이 없을 경우 api 호출
            /** 필터. 이벤트 차트 정보 */
            let device = makeDeviceList(checkedFilterData['device']);
            let chartRes = await eventChartInfo(
                start, end,
                checkedFilterData['serviceName'],
                checkedFilterData['eventType'],
                device,
                checkedFilterData['os'],
                checkedFilterData['crashType'],
            );
            /** 필터. 이벤트 테이블 정보 */
            let result = await eventSearch(
                checkedFilterData['serviceName'],
                checkedFilterData['eventType'],
                device,
                checkedFilterData['os'],
                checkedFilterData['crashType'],
                startDate, endDate, 0
            );
            if (!checkLogin(result.data) || !checkLogin(chartRes)) {
                navigate(routes.login);
                dispatch(endLoading());
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                dispatch(endLoading());
                return;
            } else if (chartRes.code !== 0) {
                errorMsg(chartRes.message);
                dispatch(endLoading());
                return;
            }
    
            setData(result.data.reverse());
            setChart(chartRes.data);
            setResetTable(true);
        } catch (error) {
            errorMsg(`${error?.message}`);
            return;
        } finally {
            dispatch(endLoading());
        }
    }
    // Chrat 출력 데이터 세팅
    useEffect(() => {
        const today = endDate === 0 ? getToday() : endDate;
        let start = startDate === 0 ? (today - (getWeekSeconds() - 1000)) : startDate;

        //검색 , 필터 - 중복 처리X

        let object = {};
        let service = [];
        let xaxisTime = [];
        let series = [];        

        while (start <= today) {
            xaxisTime.push(dateTime(start));
            start += 1000*60*60*24;
        }

        if (chart.length === 0 ) {
            object = {
                series: [{
                    data: [],
                    name: ''
                }],
                xaxis: xaxisTime
            };

            setChartData(object);
            return;
        }
        
        for (const item of chart) {
            const name = item.serviceName;
            service[name] = Object.fromEntries(
                Object.values(xaxisTime).map((time) => [time, null])
            );
            for (const data of item.count) {
                const time = dateTime(data.date);
                service[name][time] = data.count;
            }
        }


        for (const [name, data] of Object.entries(service)) {
            series.push({
                name,
                data: Object.values(data)
            });
        }

        object = {
            series,
            xaxis: xaxisTime
        };

        setChartData(object);
    }, [chart]);

    /** Main Slide 펼쳐지는 버튼 클릭 이벤트 */
    const handleMainCollapse = (type) => {
        if(mainCollapse === type) {
            setMainCollapse(null);
            return;
        }
        setMainCollapse(type);
    }

    return (
        <Layout>
            <div className='eventStyle'>
                <EventFilter uncheckedFilterData={uncheckedFilterData} setUncheckedFilterData={setUncheckedFilterData} checkedFilterData={checkedFilterData} setCheckedFilterData={setCheckedFilterData} setEventFilterState={setEventFilterState} startDate={startDate} isPeriod={isPeriod}/>
                <Navbar>
                    <div className='eventNav'>
                        <NavButton text='이벤트 현황' clickState={mainCollapse === 'chart'} clickEvent={() => handleMainCollapse('chart')} isBackColor={true} />
                        <div className='period' >
                            <ul>
                                <NavButton text='조회기간' clickEvent={()=>{ setPopup(!popup) }} />
                                {popup ? <PeriodDropdown setChart={setChart} setData={setData} setStartDate={setStartDate} onClose={setPopup} setResetTable={setResetTable} setIsPeriod={setIsPeriod} /> : null}
                            </ul>
                        </div>
                        <NavButton text='검색' clickState={mainCollapse === 'search'} clickEvent={() => handleMainCollapse('search')} isBackColor={true} />
                    </div>
                </Navbar>
                {mainCollapse !== null ?
                    <MainCollapse>
                        {mainCollapse === 'chart' ? <EventChart chartData={chartData}/> : <EventSearch startDate={startDate} setEndDate={setEndDate} setStartDate={setStartDate} setChart={setChart} setData={setData} setResetTable={setResetTable} setCheckedSearchKey={setCheckedSearchKey} />}
                    </MainCollapse>
                    : null
                }
                <EventTable setTableIndex={setTableIndex} startDate={startDate}  eventData={outputData} resetTable={resetTable} setResetTable={setResetTable} isCollapseOpen={mainCollapse !== null}  />
            </div>
        </Layout>
    );
};

export default Event;