import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Styles
import '../../styles/Statistics.scss';

const OsCount = ({statisticsList}) => {
    const[chartData, setChartData] = useState({"series": [], "xaxis": []});

    useEffect(() => {
        let xaxisOS = [];
        let series = [];

        let outputData = statisticsList.serviceReport.os;

        outputData.map((osCountItem) => {
            let os = osCountItem.name;
            if(!xaxisOS.includes(os))
            xaxisOS.push(os);
        });

        xaxisOS.sort();
        for(const os of Object.values(xaxisOS)) 
            series[os] = 0;
        
        outputData.map((osCountItem) => {
            let os = osCountItem.name;
            series[os] += parseInt(osCountItem.count);
        });

        setChartData({"series": Object.values(series), "xaxis": xaxisOS})

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
           <h3>OS 버전별 비율</h3>
            <div>
                <ReactApexChart options={chart.options} series={chart.series} type="donut" width={380} />
            </div>
        </div>
    );
};

export default OsCount;