import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { generateTimeTable, utcTimeToLocalTime } from '../../utils/time';
import { itemColor } from '../../utils/itemColor';

// Styles
import '../../styles/Statistics.scss';

const EventsCount = ({statisticsList, startDate, endDate}) => {

    const[chartData, setChartData] = useState({"series": [], "xaxis": []});

    useEffect(() => {
        let event = [];
        let series = [];
        let xaxisTime = generateTimeTable(startDate, endDate);

        let outputData = statisticsList.appReport;

        for(const item of outputData) {

            let name = item.appName;
            if(!event.includes(name))
                event[name] = {};

            for(const time of Object.values(xaxisTime)){
                event[name][time] = 0;
            }
            // object 날짜 별로 기입
            item.active.event.map((eventCountItem) => {
                event[item.appName][utcTimeToLocalTime(eventCountItem.date).getTime()] = parseInt(eventCountItem.count);
            });
        }

        for(const name of Object.keys(event)) {
            let obj = {};
            obj.name = name;
            obj.data = Object.values(event[name]);
            obj.type = 'area';
            series.push(obj );
        }

        setChartData({"series": series, "xaxis": xaxisTime})

    }, [statisticsList, startDate, endDate])

    // 차트 세팅
    const chart =  {
        series: chartData.series,
        options: {
            colors: itemColor(),
            chart: {
                toolbar: {
                    show: false
                },
                zoom:{
                    enabled: false
                }

            },
            // title: {
            //     text: '앱별 이벤트 발생 개수'
            // },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [20, 100, 100, 100]
                  },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
                },
            },
            xaxis: {
                categories: chartData.xaxis,
                type: 'datetime',
                labels: {
                    // format: 'yyyy/MM/dd',
                    formatter: function(value) {
                        let date = new Date(value);
                        const year = date.getFullYear();
                        const month = ("0" + (date.getMonth()+1)).slice(-2);
                        const day = ("0" + date.getDate()).slice(-2);
                        return `${year}/${month}/${day}`;
                    }
                },
                tooltip:{enabled:false}
            },
            markers: {
                size: 1
            },
            // yaxis: [{
            //     title: {
            //         text: '발생 이벤트 개수',
            //         style: {
            //             fontSize: '1.2em'
            //         }
            //     },
              
            // }],
            legend: {
                show: true,
                position: 'bottom',
                showForSingleSeries:true,
            },
            tooltip: {
                x: {
                    formatter: function(value) {
                        let date = new Date(value);
                        const year = date.getFullYear();
                        const month = date.getMonth()+1;
                        const day = date.getDate();
                        return `${year}년 ${month}월 ${day}일`;
                    }
                },
            },
        },
      };

    const getChartWidth = () => {
        console.log("window.innerWidth: " + window.innerWidth);
        let result
        if(window.innerWidth < 1800 && window.innerWidth > 1300){
            result = 280
        } else if (window.innerWidth >= 1800){
            result = 400
        }
        return result
    }
    return (
        <div className="">            
                {/*<p>App 별 이용 현황(일 평균 활성화 단말 수)</p>*/}
                <h3>이벤트 수</h3>
                <div className="graphcont">
                    {chart.series !== null ?
                    <ReactApexChart options={chart.options} series={chart.series} type="line" height={400} />
                    : null}
                <div className='chartInfo' > ※ Crash, Fatal 이벤트 </div>

                </div>            
        </div>        
    );
};

export default EventsCount;