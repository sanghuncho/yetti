import React, {useState, useEffect, useRef} from 'react';

import StackTrace from './StackTrace';

import {multilineStr} from '../../../utils/string';
// Images
import { ReactComponent as RowIcon } from '../../../assets/icons/ic_row.svg';

// Styles
import './Threads.scss';
import ThreadSelect from '../ThreadSelect/ThreadSelect';

const Threads = ({osName, threadInfo, threadType, isCrash}) => {

    const [checkedThread, setCheckedThread] = useState([]);
    const [defaultIdx, setDefaultIdx] = useState(0);

    /** select 박스 클릭 이벤트 */
    const handleSelectbox = (e) => {
        setCheckedThread(threadInfo?.crash?.threads[e.value].frame);
    }

    useEffect(()=>{
        if(isCrash === true){
            setCheckedThread(threadInfo?.crash?.threads[defaultIdx].frame);
        }
    },[isCrash,defaultIdx]);

    return (
        <div className="threadsCont">
            <div className="errorEventDetail">
                {isCrash && <ThreadSelect setDefaultIdx={setDefaultIdx} data={threadInfo.crash.threads} onChange={handleSelectbox}></ThreadSelect>}
                {/* <RowIcon className='icon' /> */}
                {/* <p>{threadType === 'crash' ? threadInfo.title : threadInfo.file}</p> */}
            </div>
            <div className="fixed-table-container">
                <div className="header-bg"></div>
                <div className="table-wrapper">
                    {
                        threadType === 'crash' ?  <StackTrace osName={osName} data={ checkedThread}/> : 
                    <table>
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody>
                                <tr className="jsTable">
                                    <td>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>파일</th><td>{threadInfo.file}</td>
                                                    <th>함수</th><td>{threadInfo.function}</td>
                                                    <th>위치</th><td>{threadInfo.location}</td>
                                                </tr>
                                                <tr>
                                                    <th>내용</th>
                                                    <td colSpan="5">{multilineStr(threadInfo.data, 200)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        </div>
    );
};

export default Threads;