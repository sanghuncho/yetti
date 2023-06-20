import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { secondTime } from '../../utils/time';

const EventContents = ({statisticsList}) => {

    const[serviceEvent, setServiceEvent] = useState([]);

    useEffect(() => {
        let eventArray = [];
        for(const events of statisticsList.appReport) {
            let name = events.appName;
            let eventContents = events.event.contents;

            eventContents.map((item) => {
                item.appName = name;
                eventArray.push(item);
            });
        }

        setServiceEvent(eventArray);

    }, [statisticsList])

    // 최근 8개만 출력
    const page = 0;     // 현재 페이지
    const limit = 20;   // 출력할 항목 개수

    return (
        
            <div className='eventContents'>
            <h3>이벤트 내역</h3>
                <div>
                    <EventContentsTable eventData={[...serviceEvent].reverse()} page={page} limit={limit} />
                </div>
            </div>

    );
};

const EventContentsTable = ({eventData, page, limit}) => {  

    return(
        <>
            <table className='contentsTable'>
                <thead>
                    <tr>
                        <th>발생일시</th>
                        <th>앱</th>
                        <th>버전</th>
                        <th>개발언어</th>
                        <th>내용</th>
                        <th>디바이스</th>
                        <th>운영체제</th>
                        <th>기기식별</th>
                    </tr>
                </thead>
                <tbody>
                    {eventData.slice(page * limit, page * limit + limit).map((item, index) => {
                        return(
                            <tr key={index}>
                                <td>
                                    <span data-tip={secondTime(item.time)}>{secondTime(item.time)}</span>
                                </td>
                                <td>
                                    <span data-tip={item.appName}>{item.appName}</span>
                                </td>
                                <td>
                                    {item.appVersion}
                                </td>
                                <td>
                                    {item.eventType}
                                </td>
                                <td>
                                    <span data-tip={item.name} style={{textAlign:'left'}}>{item.name}</span>
                                </td>
                                <td>
                                    <span data-tip={item.device}>{item.device}</span>
                                </td>
                                <td>
                                    {item.os} {item.osVersion}
                                </td>
                                <td>
                                    <span data-tip={item.uid}>{item.uid}</span>
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

export default EventContents;