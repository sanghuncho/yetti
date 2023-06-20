import React from 'react';
import ReactApexChart from 'react-apexcharts';

// Styles
import './EventChart.scss';

const EventChart = React.memo(({chartData}) => {
    if(Object.keys(chartData).length === 0) return;
    // 이벤트 현황 막대 차트 세팅
    const data = {
        series: chartData.series,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            theme: {
                palette: 'palette7' // upto palette10
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '80%',
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: true,
                position: 'top',
                style: {
                    fontFamily: 'Noto Sans KR',
                    fontWeight: 'bold',
                    colors: ['#000'],
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                labels: {
                    style: {
                        fontWeight: 700,
                        fontSize: '13px'
                    },
                  },
                categories: chartData.xaxis,
            },
            yaxis: {
                title: {
                    text: 'COUNT'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                intersect: true,
                y: {
                    formatter: function (val) {
                        return val;
                    }
                },
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
            legend: {
                show: true,
                position: 'bottom',
                showForSingleSeries: true,
                showForNullSeries: false,
            },
        },
    };

    return (
        <>
        {data !== null ?
        <div className='eventChart'>
            <ReactApexChart className='apexChart' options={data.options} series={data.series} type="bar" height={300} />
        </div>
        : null}
        </>
    );
});

export default EventChart;