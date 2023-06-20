import React from 'react';

import { ReactComponent as CopyIcon } from '../../../assets/icons/ic_copy.svg';

import { errorMsg, alertMessage, iconLevel } from '../../../utils/message'
import { secondTime } from '../../../utils/time';

// Styles
import './ErrorEventTable.scss';

const ErrorEventTable = ({eventDetail, threadInfoCallback}) => {

    const trStyleHandler  = (target) => {
        let tbody = target.parentElement;
        let tr = tbody;

        while (tbody.tagName != 'TBODY') {
            tbody = tbody.parentElement;
            if (tbody.tagName == 'TR') tr = tbody;
        }

        for (let iter=0; iter<tbody.childElementCount; iter++) {
            if (tbody.children[iter].className == "on") {
                tbody.children[iter].className = "";
                break;
            }
        }

        tr.className = "on";
    };

    /** 클립보드 복사 이벤트 */
    const handleCopyClipBoard = async (key) => {
        try {
            await navigator.clipboard.writeText(key);
            alertMessage(iconLevel.SUCCESS, "클립보드에 복사되었습니다.");
        } catch (e) {
            alertMessage(iconLevel.ERROR, "복사에 실패하였습니다.");
        }
    }

    return (
        <div className="errorEventConts">          
            <div className="fixed-table-container">
                <div className="table-wrapper">
                    <table>
                        <colgroup>
                        <col width="18%"/>
                        <col width="7%" />
                        <col width="68%"/>
                        <col width="7%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>발생일자</th>
                                <th>레벨</th>
                                <th>이벤트 상세</th>
                                <th>복사</th>
                            </tr>
                        </thead>
                        <tbody>
                            { eventDetail?.info?.crash &&
                                <tr onClick={(evt) => {trStyleHandler(evt.target); threadInfoCallback(eventDetail?.info, 'crash')}}>
                                    <td>{eventDetail?.info?.crash?.date ? secondTime(eventDetail?.info?.crash?.date) : '-'}</td>
                                    <td>{eventDetail?.info?.crashType?.toUpperCase() || '-'}</td>
                                    <td>{eventDetail?.info?.title || '-'}</td>
                                    <td><CopyIcon className='copyIcon' onClick={() => handleCopyClipBoard(eventDetail?.info?.title || '-')} /></td>
                                </tr>  
                            }
                            {eventDetail?.info?.log && [...eventDetail?.info?.log].reverse().map((item, index) => {
                                return(
                                    <tr key={index} onClick={(evt) => {trStyleHandler(evt.target); threadInfoCallback(item, 'log')}}>
                                        <td>{secondTime(item.date)}</td>
                                        <td>{item.level.toUpperCase()}</td>
                                        <td>{item.data}</td>
                                        <td><CopyIcon className='copyIcon' onClick={() => handleCopyClipBoard(item.data)} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ErrorEventTable;