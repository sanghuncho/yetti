import React, { useEffect, useState, useCallback } from 'react';
import { serviceReport, getServiceList } from '../../api/serviceApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { errorMsg } from '../../utils/message';
import routes from '../../libs/routes';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import exceljs from "exceljs";
import {saveAs} from "file-saver";
import { checkLogin } from '../../utils/isLogin';

// Components
import DataForm from '../../components/DataForm/DataForm';
import Navbar from '../../components/Navbar/Navbar';
import Title from '../../components/Title/Title';
import Layout from '../../layout/MainLayout/MainLayout';
import ActivitysCount from '../../components/Chart/ActivitysCount';
import EventsCount from '../../components/Chart/EventsCount';
import EventStatus from '../../components/Chart/EventStatus';
import OsCount from '../../components/Chart/OsCount';
import EventStatusCount from '../../components/Chart/EventStatusCount';
import DeviceCount from '../../components/Chart/DeviceCount';
import DatePicker from '../../components/DatePicker/DatePicker';
import Category from '../../components/Category/Category';
import SelectBox from '../../components/SelectBox/SelectBox';

// Styles
import '../../styles/Statistics.scss';
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/sweetalert2.scss';
import { eventSearch } from '../../api/eventApi';
import { getMonthSeconds, getToday, dateTime } from '../../utils/time';

const Statistics = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // 조회 기간
    const [startDate, setStartDate] = useState(new Date(getToday() - (getMonthSeconds() - 1 * 1000)));
    const [endDate, setEndDate] = useState(new Date());
    // const [startDate, setStartDate] = useState(new Date(new Date(new Date().setMonth(new Date().getMonth() -1)).setHours(0,0,0,0)));

    // 조회 서비스
    const [serviceList, setServiceList] = useState([]);

    // 통계/리포트 출력 데이터
    const [statisticsList, setStatisticsList] = useState([]);
    
    const [selectedService, setSelectedService] = useState([]);

    /** select 박스 클릭 이벤트 */
    const handleSelectbox= (e) => {
        const service =  serviceList.filter(item => item.id === e.value);
        setStatisticsList([]);
        setSelectedService(service);
    }

    // 조회 가능 서비스 API 연동 
    useEffect(() => {
        dispatch(startLoading());
        
        getServiceList().then((result) => {
            dispatch(endLoading());
            if(!checkLogin(dispatch, result.code)){
                navigate(routes.login);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }
    
            // API 요청 성공
            setServiceList(result.data);
        }).catch(error => {
            console.log(error);
            errorMsg(`${error?.message}`);
            dispatch(endLoading());
            return;
        });
    }, [dispatch, navigate]);


    /** 검색 버튼 클릭 이벤트 */
    const handleSearch = useCallback(async () => {

        if(selectedService.length === 0) {
            return;
        }
        dispatch(startLoading());
        let checkedServiceList = selectedService.map(item => {
            let infos = {};
            infos.sid = item.id;
            infos.name = item.name;
            return(infos);
        })
        // 통계/리포트 API 연동
        await serviceReport(checkedServiceList, startDate, endDate).then((result) => {
            dispatch(endLoading());

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }
    
            // API 요청 성공
            setStatisticsList(result.data);
        }).catch(error => {
            console.log(error);
            errorMsg(`${error?.message}`);
            dispatch(endLoading());
            return;
        });

    }, [selectedService, startDate, endDate]);

    useEffect(()=>{
        handleSearch();
    }, [handleSearch] );


    /** PDF 다운로드 이벤트 */
    const handlePdfDownload = async(index, item) => {
        const btn = document.getElementById('pdfBtn');
        btn.innerText += ' 중...'
        btn.disabled = true;
        btn.style.cursor = "default";

        const input1 = document.getElementById('chartToPrint'+index);
        // const input2 = document.getElementById('eventToPrint'+index);

        const canvas1 = await html2canvas(input1);
        // const canvas2 = await html2canvas(input2);

        const imgData1 = canvas1.toDataURL('image/png');
        // const imgData2 = canvas2.toDataURL('image/png');

        var doc = new jsPDF("p", "mm", "a4"); 

        let imgWidth1;
        let imgHeight1;

        let imgWidth2;
        let imgHeight2;

        if(canvas1.width > canvas1.height) {
            imgWidth1 = 180;
            imgHeight1 = canvas1.height * imgWidth1 / canvas1.width;
        }
        else {
            imgHeight1 = 295;
            imgWidth1 = canvas1.width * imgHeight1 / canvas1.height - 30;
        }
        
        // if(canvas2.width > canvas2.height) {
        //     imgWidth2 = 180;
        //     imgHeight2 = canvas2.height * imgWidth2 / canvas2.width;
        // }
        // else {
        //     imgHeight2 = 295;
        //     imgWidth2 = canvas2.width * imgHeight2 / canvas2.height - 30;
        // }

        doc.addImage(imgData1, 'PNG', 10, 10, imgWidth1, imgHeight1); 
        doc.addPage();
        // doc.addImage(imgData2, 'PNG', 10, 10, imgWidth2, imgHeight2); 

        doc.save('Appcatch-Report_' + item.serviceName + '.pdf');
        // 버튼 원상복구
        btn.innerText = 'PDF 저장';
        btn.disabled = false;
        btn.style.cursor = "pointer";
    }

    /** Excel 다운로드 이벤트 */
    const handleExcelDownload = async(index, item) => {
/* test code         
        const readbook = new exceljs.Workbook();
        debugger;
        readbook.xlsx.readFile("/appcatch.xlsx").then(function( ) {
            const worksheet = readbook.getWorksheet("Chart Data");
            const t = worksheet.getColumn(3);
         
            worksheet.getColumn(4).values = [,,,1,9,9,9,8,6,3,5,6];
        }); 

        const buffer = await readbook.xlsx.writeBuffer();
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const fileExtension = '.xlsx';

        const blob = new Blob([buffer], {type: fileType});

        saveAs(blob, 'appcatch' + '_' + item.serviceName + fileExtension);     
*/
        //버튼 설정 
        const btn = document.getElementById('excelBtn');
        btn.innerText += ' 중...'
        btn.disabled = true;
        btn.style.cursor = "default";
        
        const workbook = new exceljs.Workbook();
        // 생성자
        workbook.creator = 'appcatch.io';

        // 최종 수정자
        workbook.lastModifiedBy = 'appcatch.io';

        // 생성일(현재 일자로 처리)
        workbook.created = new Date();

        // 수정일(현재 일자로 처리)
        workbook.modified = new Date();

        // 통계/리포트 데이터 시트 추가
        const worksheet1 = workbook.addWorksheet("Chart Data");
        const input1 = document.getElementById('chartToPrint'+index);
        const canvas1 = await html2canvas(input1);
        const imgData1 = canvas1.toDataURL('image/png');
        const imageId1 = workbook.addImage({
            base64: imgData1,
            extension: 'png',
        });

        worksheet1.addImage(imageId1, 'B2:S50');

        const worksheet2 = workbook.addWorksheet(item.serviceName);
        worksheet2.columns = [
            { header: "발생일시", key: "time", width: 32, style: {font: {name: 'Arial', size: 10}}},
            { header: "앱", key: "appName", width: 20, style: {font: {name: 'Arial', size: 10}}},
            { header: "버전", key: "appVersion", width: 10, style: {font: {name: 'Arial', size: 10}}},
            { header: "개발언어", key: "eventType", width: 10, style: {font: {name: 'Arial', size: 10}}},
            { header: "내용", key: "eventName", width: 60, style: {font: {name: 'Arial', size: 10}}},
            { header: "디바이스", key: "device", width: 20, style: {font: {name: 'Arial', size: 10}}},
            { header: "운영체제", key: "os", width: 10, style: {font: {name: 'Arial', size: 10}}},
            { header: "기기식별", key: "uid", width: 20, style: {font: {name: 'Arial', size: 10}}},
        ];

        // 이벤트 리스트 
        let event =[];
        eventSearch(
            [item.serviceName],
            null,null,null,['crash','fatal'],
            startDate, endDate, 0, -1
        )
        .then(async(result) => {

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
            event = origin;
          
            event.map((events) =>{
                const koreaTime = 1000 * 60 * 60 * 9;
                events.time = new Date(events.time + koreaTime);
                worksheet2.addRow(events);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const fileExtension = '.xlsx';
    
            const blob = new Blob([buffer], {type: fileType});
    
            saveAs(blob, 'Appcatch-Report_' + item.serviceName + fileExtension);
            // 버튼 원상복구
            btn.innerText = 'Excel 저장';
            btn.disabled = false;
            btn.style.cursor = "pointer";

        }).catch((error) => {
            errorMsg(`${error?.message}`);
            return;
        });
    };
    return (
        <Layout>
            <div className='statistics'>
                <Navbar/>
                <Category text='통계 / 리포트' />
                <DataForm title='기간별 통계 생성'>
                    <div className='children'>
                        <div className='period'>
                            <Title className="title" title='조회 기간' bgColor='#6588CD' />
                            <DatePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                        </div>
                        <div className='service'>
                            <Title className="title" title='조회 서비스' bgColor='#6588CD' />
                            <SelectBox serviceList={serviceList} onChange={handleSelectbox} />
                        </div>
                    </div>
                </DataForm>
                <div style={{minHeight: 50}}></div>
                {statisticsList.length !== 0 ? 
                statisticsList?.map((item, index) => {
                    return (                   
                        <DataForm key={index}>
                            <div className="report">
                                <div className="rptTitle">
                                    <Title title={`${item.serviceName} 서비스 조회 결과`} key={index} />
                                    <div className='download'>
                                        <button id='pdfBtn' onClick={() => handlePdfDownload(index, item)}>PDF 저장</button>
                                        <button id='excelBtn' onClick={() => handleExcelDownload(index, item)}>Excel 저장</button>
                                    </div>
                                </div>
                                
                                <div className='graphWrap'>
                                    <div id={`chartToPrint${index}`}  >
                                        <div className='bodyTitle'>
                                            <Title title={`${item.serviceName} 서비스 리포트`} />
                                            <div style={{fontSize: 16}}>
                                                <div>* 조회 기간: {`${dateTime(startDate)} ~ ${dateTime(endDate)}`}</div><br/>
                                                <div>* 서비스명: {`${item.serviceName}`}</div><br/>
                                                <div>* 서비스 관리자: {`${selectedService.pop().email}`}</div><br/>
                                            </div>
                                        </div>
                                        <br/><hr/><br/>

                                        <div className="graphDiv1">
                                            <ActivitysCount statisticsList={item} startDate={startDate} endDate={endDate} />
                                        </div>

                                        <div className="graphDiv1">
                                            <EventsCount statisticsList={item} startDate={startDate} endDate={endDate} />
                                        </div>

                                        <div className="graphDiv1">
                                           <DeviceCount statisticsList={item} />
                                        </div>
                                    
                                        <div className="graphDiv2">
                                            <OsCount statisticsList={item} />
                                            <EventStatusCount statisticsList={item} />
                                            <EventStatus statisticsList={item} />
                                            <div className='chartInfo' >※ Crash, Fatal 이벤트 </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DataForm>
                    )})
                : null}
                <div style={{minHeight: 82}}></div>
            </div>
        </Layout>
    );
};

export default Statistics;