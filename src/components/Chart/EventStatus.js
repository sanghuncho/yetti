import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

// Components
// import StatisticsForm from '../StatisticsForm/StatisticsForm';

const EventsStatus = ({statisticsList}) => {

    const[eventStatus, setEventStatus] = useState([]);
    
    useEffect(() => {
        let status = [];

        let outputData = statisticsList.serviceReport.event;

        var sortJSON = function(data, key, type) {
            if (type == undefined) {
              type = "asc";
            }
            return data.sort(function(a, b) {
              var x = a[key];
              var y = b[key];
              if (type == "desc") {
                return x > y ? -1 : x < y ? 1 : 0;
              } else if (type == "asc") {
                return x < y ? -1 : x > y ? 1 : 0;
              }
            });
        };

        // for(const item of outputData) {
            outputData.status.map((eventStatusItem) => {
                status.push(eventStatusItem);
            });
        // }

        sortJSON(status, "count");
        
        setEventStatus(status);
    }, [statisticsList])
    // 최근 8개만 출력
    const page = 0;     // 현재 페이지
    const limit = 8;   // 출력할 항목 개수

    return (
        <div className='grpContTble'>      
              <EventContentsTable eventData={[...eventStatus].reverse()} page={page} limit={limit} />       
        </div>
    );
};

const EventContentsTable = ({eventData, page, limit}) => {  

    return(
        <>
           <h3>최다 발생 이벤트 TOP 8</h3>
            <table className='statusTable'>
                <thead>
                    <tr>
                        <th>이벤트 명</th>
                        <th>발생수</th>
                    </tr>
                </thead>
                <tbody>
                    {eventData.slice(page * limit, page * limit + limit).map((item, index) => {
                        return(
                            <tr key={index}>
                                <td>
                                    <span data-tip={item.title ? item.title : 'null'}>{item.title ? item.title : 'null'}</span>
                                </td>
                                <td>
                                    {item.count}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <ReactTooltip effect='solid' padding='15px' />
        </>
    )
}

export default EventsStatus;