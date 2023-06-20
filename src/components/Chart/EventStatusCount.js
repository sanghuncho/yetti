import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Styles
import '../../styles/Statistics.scss';

const EventStatusCount = ({statisticsList}) => {
    const[chartData, setChartData] = useState({"series": [], "xaxis": []});

    useEffect(() => {
        let xaxisType = [];
        let series = [];

        let outputData = statisticsList.serviceReport.event;

        Object.keys(outputData.typeCount).forEach(key=>{
            xaxisType.push(key);
            series[key] = outputData.typeCount[key];
        })
        xaxisType.sort();
        
        setChartData({"series": Object.values(series), "xaxis": xaxisType})

    }, [statisticsList])

    // 원형 차트 세팅
    const chart = {
        series: chartData.series,
        options: {
            chart: {
                width: 668,
                type: 'donut',
            },
            plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        showAlways: true,
                        show: true
                      }
                    }
                  }
                }
            },
            legend: {
                position: 'bottom'
            },
            labels: chartData.xaxis,
            responsive: [{
                breakpoint: 480
            }]
        }
    };

    return (
        <div className="grpContChart">
           <h3>이벤트 종류별 비율</h3>
            <div>
                <ReactApexChart options={chart.options} series={chart.series} type="donut" width={380} />
            </div>
        </div>
    );
};

export default EventStatusCount;