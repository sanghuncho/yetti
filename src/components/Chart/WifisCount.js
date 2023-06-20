import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Components
import StatisticsForm from '../StatisticsForm/StatisticsForm';

const WifisCount = ({statisticsList}) => {

    const[chartData, setChartData] = useState({"name": [], "wifiCount": []});

    useEffect(() => {
        let nameArr = [];
        let wifiArr = [];

        for(const item of statisticsList) {
            nameArr.push(item.name);
            wifiArr.push(item.wifiCount)
        }

        setChartData({"name": nameArr, "wifiCount": wifiArr})

    }, [statisticsList])

    // 막대 차트 세팅
    const chart1  = {
        series: [{
                name: 'Wifi Count',
                data: chartData["wifiCount"]
        }],
        options: {
            chart: {
                width: 668,
                toolbar: {
                    show: false
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
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: chartData["name"]
            },
            yaxis: {
                title: {
                    text: 'Wifi Count'
                }
            },
            fill: {
                opacity: 1,
                colors: '#6588CD'
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }   
        }, 
    };

    // 원형 차트 세팅
    const chart2 = {
        series: chartData["wifiCount"],
        options: {
            chart: {
                width: 668,
                type: 'donut',
            },
            labels: chartData["name"],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    };

    return (
        <StatisticsForm title='네트워크 별 오류 이벤트 발생 횟수' >
            <div style={{display: 'flex', alignItems: 'center'}}>
                <ReactApexChart options={chart1.options} series={chart1.series} type="bar" width={600} height={350} /> 
                <ReactApexChart options={chart2.options} series={chart2.series} type="donut" width={500} />
            </div>       
        </StatisticsForm>
    );
};

export default WifisCount;