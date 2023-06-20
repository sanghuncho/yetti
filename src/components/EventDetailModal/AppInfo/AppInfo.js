import React, { useEffect, useState } from 'react';
import { secondTime } from '../../../utils/time';
import { KbToGb, NumberWithComma } from '../../../libs/regex';
// Styles
import './AppInfo.scss';

const AppInfo = ({eventDetail}) => {

    // 저장 공간 State
    const[storageSpace, setStorageSpace] = useState('0%');
    const[memorySpace, setMemorySpace] = useState('0%');


    // 저장공간, 메모리 사용공간 세팅
    useEffect(() => {
        let storage = (1 - eventDetail?.device?.storageAvailable/eventDetail?.device?.storageMax) * 100;
        let memory = (1 - eventDetail?.device?.memoryAvailable/eventDetail?.device?.memoryMax) * 100;

        if (!isNaN(storage)) {
            setStorageSpace(`${storage}%`);
        }
        if (!isNaN(memory)) {
            setMemorySpace(`${memory}%`);
        }
    }, [eventDetail])

    return (
            <div className='aasicInfo1'>
                <div className="serviceInfo">
                    <ul className=" ">
                        <li><div className='basicTtl'>서비스 종류</div><div className='basicCnt'>{eventDetail?.type}</div></li>
                        <li><div className='basicTtl'>서비스 이름</div><div className='basicCnt'>{eventDetail?.service?.name}</div></li>
                        <li><div className='basicTtl'>발생일시</div><div className='basicCnt'>{secondTime(eventDetail?.time)}</div></li>
                        <li><div className='basicTtl'>이벤트 종류</div><div className='basicCnt'>{eventDetail?.info?.crashType}</div></li>
                    </ul>
                    <ul className=" ">
                        <li><div className='basicTtl'>운영환경</div><div className='basicCnt'>{eventDetail?.os?.name}</div></li>
                        <li><div className='basicTtl'>운영환경 버전</div><div className='basicCnt'>{eventDetail?.os?.version}</div></li>
                        <li><div className='basicTtl'>앱 이름</div><div className='basicCnt'>{eventDetail?.app?.name}</div></li>
                        <li><div className='basicTtl'>앱 식별자</div><div className='basicCnt'>{eventDetail?.app?.identifier}</div></li>
                    </ul>
                </div>
                <div className='deviceInfo '>
                    <ul>
                        <li>
                            <div className='key'>모델</div>
                            <div className='value'>{eventDetail?.device?.model}</div>
                        </li>
                        <li>
                            <div className='key'>장치 식별 키</div>
                            <div className='value'>{eventDetail?.device?.uuid}</div>
                        </li>
                        <li>
                            {eventDetail?.device?.vendor.toUpperCase() === "APPLE" ? 
                            <div className='key'>탈옥여부</div>
                            :
                            <div className='key'>루팅여부</div>
                            }
                            {eventDetail?.device?.vendor.toUpperCase() === "APPLE" ? 
                            <span className='value'>{eventDetail?.device?.rooted ? '탈옥됨' : '탈옥되지 않음'}</span>
                            : 
                            <span className='value'>{eventDetail?.device?.rooted ? '루팅됨' : '루팅되지 않음'}</span>
                            }
                        </li>
                        <li>
                            <div className='key'>해상도</div>
                            <div className='value'>{eventDetail?.device?.screen?.width ?? 0} x {eventDetail?.device?.screen?.height ?? 0} </div>
                        </li>
                        <li>
                            <div className='key'>저장공간</div>
                            <div className='value'>
                                <div>
                                    <span>전체공간 : {NumberWithComma(KbToGb(eventDetail?.device?.storageMax))} GB</span>
                                    <span style={{marginLeft: 50}}>남은공간 : {NumberWithComma(KbToGb(eventDetail?.device?.storageAvailable))} GB</span>
                                </div>
                                <div className='maxSpace'>
                                    <div className='usedSpace' style={{width: storageSpace, backgroundColor: '#A9E6EA'}}></div>
                                </div>                        
                            </div>
                        </li>
                        <li>
                            <div className='key'>메모리</div>
                            <div className='value'>
                                <div>
                                    <span>전체공간 : {NumberWithComma(KbToGb(eventDetail?.device?.memoryMax))} GB</span>
                                    <span style={{marginLeft: 50}}>남은공간 : {NumberWithComma(KbToGb(eventDetail?.device?.memoryAvailable))} GB</span>
                                </div>
                                <div className='maxSpace'>
                                    <div className='usedSpace' style={{width: memorySpace, backgroundColor: '#79B2DB'}}></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className='key'>통신사</div>
                            <div className='value'>{eventDetail?.network?.cellVendor}</div>
                        </li>
                        <li>
                            <div className='key'>앱 아키텍처</div>
                            <div className='value'>{eventDetail?.app?.arch}</div>
                        </li>
                        <li>
                            <div className='key'>앱 설치경로</div>
                            <div className='value'>{eventDetail?.app?.path}</div>
                        </li>
                    </ul>
                </div>
            </div>
            );
};

export default AppInfo;
