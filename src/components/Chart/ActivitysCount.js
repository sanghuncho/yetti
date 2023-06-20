import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { generateTimeTable, utcTimeToLocalTime } from '../../utils/time';
import { itemColor } from '../../utils/itemColor';

// Styles
import '../../styles/Statistics.scss';

const ActivitysCount = ({statisticsList, startDate, endDate}) => {

    const[chartData, setChartData] = useState({"series": [], "xaxis": []});

    useEffect(() => {
        let active = [];
        let series = [];
        let xaxisTime = generateTimeTable(startDate, endDate);
        let outputData = statisticsList.appReport;

        for(const item of outputData) {
            let name = item.appName;
            if(!active.includes(name))
                active[name] = {};
        }

        for(const t of Object.values(xaxisTime))
            for(const s of Object.keys(active))
                active[s][t] = 0;

        for(const item of outputData) {
            // object 날짜 별로 기입
            item.active.event.map((activeCountItem) => {
                active[item.appName][utcTimeToLocalTime(activeCountItem.date).getTime()] = parseInt(activeCountItem.activecount);
            });
        }
        for(const name of Object.keys(active)) {
            let obj = {};
            obj.name = name;
            obj.data = Object.values(active[name]);
            obj.type = 'area';
            series.push(obj );
        }        
        setChartData({"series": series, "xaxis": xaxisTime})

    }, [statisticsList, startDate, endDate])

    // 차트 세팅
    var chart =  {
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
            //     text: '일일 활성화 단말기 개수'
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
            plotOptions: {
                bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
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
                tooltip: { enabled: false }
            },
            markers: {
                size: 1
            },
            // yaxis: [{
            //     title: {
            //         text: '활성화 단말 개수',
            //         style: {
            //             fontSize: '1.2em'
            //         }
            //     }
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
                }
            },
        },
      };

    return (
        <div className="">            
                {/*<p>App 별 이용 현황(일 평균 활성화 단말 수)</p>*/}
                <h3>이용자 수</h3>
                <div className="graphcont">
                    <ReactApexChart options={chart.options} series={chart.series} type="line" height={400} />
                    <div className='chartInfo' > ※ Crash, Fatal 이벤트 </div>
                </div>            
        </div>        
    );
};

export default ActivitysCount;