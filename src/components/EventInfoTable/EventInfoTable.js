import React from 'react';
import { useState } from 'react';
import { secondTime } from '../../utils/time';
import ReactTooltip from 'react-tooltip';

// Components
import CheckBox from '../CheckBox/CheckBox';

// Images & Icons
import { ReactComponent as ArrowTopIcon } from '../../assets/icons/ic_arrow_top.svg';
import { ReactComponent as ArrowBottomIcon } from '../../assets/icons/ic_arrow_bottom.svg';

// Styles
import './EventInfoTable.scss';

const EventDetailTable = ({eventDetail}) => {

    const infoData = eventDetail?.info;
    const[islogCheck, setIsLogCheck] = useState(false);
    const[isCrashFrame, setIsCrashFrame] = useState(false);

    return (
        <div className='eventInfoTable'>
            <div>
                <div className='checkbox'>
                    <CheckBox text='Log 전체표시' textColor='#4E4E4E' checkboxColor='#808080' onClick={() => setIsLogCheck(!islogCheck)} checked={islogCheck} />
                </div>
            </div>
            <div>
                {infoData && (
                    <div className='tableArea'>
                        <table className='infoTable'>
                            <thead>
                                <tr>
                                    <th>발생일시</th>
                                    <th>모듈</th>
                                    <th>이벤트 상세</th>
                                    <th>이벤트 레벨</th>
                                </tr>
                            </thead>
                            <tbody>
                            { infoData?.crash && 
                                    <>
                                        <tr>
                                            <td>
                                                <div className='crashDate'>
                                                    {isCrashFrame ? <ArrowTopIcon className='icon' onClick={() => setIsCrashFrame(false)} /> : <ArrowBottomIcon className='icon' onClick={() => setIsCrashFrame(true)} />}
                                                    <span>{eventDetail?.time ? secondTime(eventDetail?.time) : '-'}</span>
                                                </div>
                                            </td>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>{infoData?.crash?.threads ? infoData?.crash?.threads[0]?.frame ? infoData?.crash?.threads[0]?.frame[0]?.module ? infoData?.crash?.threads[0]?.frame[0]?.module : '-' : '-' : '-'}</td>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>{infoData?.title ? infoData?.title : '-'}</td>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>{infoData?.eventType ? infoData?.eventType : '-'}</td>
                                        </tr>
                                        <tr style={isCrashFrame ? {display: ''} : {display: 'none'}}>
                                            <td colSpan="4">
                                                <div className='foldingRow'>
                                                    <div className='crashThread'>
                                                        {infoData?.crash?.threads ? infoData?.crash?.threads[0]?.frame ?
                                                        infoData?.crash?.threads[0]?.frame.map((item, index) => {
                                                            return(
                                                                <React.Fragment key={index}>
                                                                    <div className='crashFrame'>
                                                                        <div>
                                                                            <span 
                                                                                data-multiline={true}
                                                                                data-tip={`제조사: ${item.vendor}<br/>
                                                                                    모듈명: ${item.module}<br/>
                                                                                    함수명: ${item.function}<br/>
                                                                                    위치: ${item.location}<br/>`}>{item.number}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span 
                                                                                data-multiline={true}
                                                                                data-tip={`제조사: ${item.vendor}<br/>
                                                                                    모듈명: ${item.module}<br/>
                                                                                    함수명: ${item.function}<br/>
                                                                                    위치: ${item.location}<br/>`}>{item.module}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                data-multiline={true}
                                                                                data-tip={`제조사: ${item.vendor}<br/>
                                                                                    모듈명: ${item.module}<br/>
                                                                                    함수명: ${item.function}<br/>
                                                                                    위치: ${item.location}<br/>`}>{item.function}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                data-multiline={true}
                                                                                data-tip={`제조사: ${item.vendor}<br/>
                                                                                    모듈명: ${item.module}<br/>
                                                                                    함수명: ${item.function}<br/>
                                                                                    위치: ${item.location}<br/>`}>{item.location}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                data-multiline={true}
                                                                                data-tip={`제조사: ${item.vendor}<br/>
                                                                                    모듈명: ${item.module}<br/>
                                                                                    함수명: ${item.function}<br/>
                                                                                    위치: ${item.location}<br/>`}>{item.vendor === undefined ? '-' : item.vendor}</span>
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        }) : '' : ''}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                }
                                {infoData?.log && [...infoData?.log].reverse().map((item, index) => {
                                    return(
                                        <tr key={index}>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>
                                                <span>
                                                    {secondTime(item.date)}
                                                </span>
                                            </td>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>
                                                <span
                                                    data-multiline={true}
                                                    data-tip={`파일명: ${item.file}<br/>
                                                        함수명: ${item.function}<br/>
                                                        위치: ${item.location}<br/>`}>{item.file}
                                                </span>
                                            </td>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>
                                                <span
                                                    data-multiline={true}
                                                    data-tip={`파일명: ${item.file}<br/>
                                                        함수명: ${item.function}<br/>
                                                        위치: ${item.location}<br/>`}>{item.data}
                                                </span>
                                            </td>
                                            <td style={islogCheck ? {whiteSpace: 'pre-line', wordBreak: 'break-all'} : null}>
                                                <span>
                                                    {item.level}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr></tr>                               
                            </tbody>
                        </table>
                        <ReactTooltip effect='solid' padding='15px' place='right' />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailTable;