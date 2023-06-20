import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Styles
import '../../styles/Statistics.scss';

const DeviceCount = ({statisticsList}) => {
    
    const [chartData, setChartData] = useState({ "series": [], "xaxis": [] });
    const [init, setInit] = useState(false);
    
    const getHeight = ()=>{
        return chartData.xaxis.length * 20 + 100 + "%";
    }
    useEffect(() => {
        let series = [];
        let app = [];
        let xaxisService = [];
        let deviceList = {};
        let total = "total";

        let outputData = statisticsList.appReport;
        for(const item of outputData){
            app.push(item.appName);

            for(const d of item.device){
                if(!d) return;
                let deviceName = d.friendlyname == null ? d.name : d.friendlyname;
                if(!Object.keys(deviceList).includes(deviceName)){
                    deviceList[deviceName] = {};
                    deviceList[deviceName][total] = 0;
                    xaxisService.push(deviceName);
                }
            }
        }

        for(const appname of app){
            for(const devicename of xaxisService){
                deviceList[devicename][appname] = 0;
            }
        }

        for(const item of outputData){
            let serviceDevice = item.device;
            if(serviceDevice.length === 0){
                continue;
            }

            for(const deviceItem of serviceDevice){     
                let outputDevice = deviceItem.friendlyname == null ? deviceItem.name : deviceItem.friendlyname ;  
                deviceList[outputDevice][item.appName] += deviceItem.count;
                deviceList[outputDevice][total] += deviceItem.count;
            }
        }

        /* 정렬 */
        let ordered = [];
        let idx = 0;
        for(const i in deviceList){
            ordered.push([deviceList[i], deviceList[i][total], idx++]);
        }

        ordered.sort(function(a,b){
            return b[1] - a[1];
        });

        let newXaxisService =[];
        for(const element of ordered){
            newXaxisService.push(xaxisService[element[2]]);
        }

        /** 기존 xaxis와 동일할 경우 ReactApexChart가 재렌더링 되지 않는다.
         *  따라서 xaxis와 같을 경우 초기화 한 후에 다시 진행하도록 수정
         *  빈배열일때 무한 랜더링 -> 조건에서 제외
         */
        if(JSON.stringify(newXaxisService) === JSON.stringify(chartData.xaxis) && JSON.stringify(newXaxisService) !== '[]' ){
            setChartData({"series": [], "xaxis": []});
            setInit((prev) => !prev);
            return ;
        }

        for(const appItem of app) {
            let obj = [];            
            obj.name = appItem;

            let data = [];
            for(const value of Object.values(ordered)){
                for(const [appname, count] of Object.entries(value[0])){
                    if(appname === appItem){
                        data.push(count);
                    }
                }
            }
            obj.data = data;
            series.push(obj);

        }
        setChartData({"series": series, "xaxis": newXaxisService});

    }, [statisticsList, init])

    // 차트 세팅
    const chart  = {
        series: chartData.series,
        
        options: {
            chart: {
                id: "device-count-bar",
                toolbar: {
                    show: false
                },
                stacked: true,
            },
            theme: {
                palette: 'palette2' // upto palette10
            },
            plotOptions: {
                bar: {
                horizontal: true,
                endingShape: 'rounded',
                barHeight: '70%'
                },
            },
            dataLabels: {
                enabled: true,
                style:{
                    fontSize: '12px',
                }
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            axis: 'y',
            xaxis: {
                categories: chartData.xaxis,
            }
            
        }, 
    };


    return (
        <div className="">
            {/* <h3>기기별 이벤트 발생 현황</h3> */}
            <h3>기기별 수</h3>
            <div className="graphcont">
                <ReactApexChart options={chart.options} series={chart.series} type="bar" height={getHeight()}/>
                <div className='chartInfo' > ※ Crash, Fatal 이벤트 </div>
            </div>
        </div>             
    );
};

export default DeviceCount;