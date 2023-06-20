import React from 'react';
import { CSVLink } from 'react-csv';

// Styles
import './EventDownload.scss';

const EventDownload = ({style, disabled, downloadData, dumpData, isCsv = true, isJson = true, isDump = true}) => {

    /** Json 저장 클릭 이벤트 */
    const handleJsonDownload = () => {
        const blob = new Blob([JSON.stringify(downloadData)], { type: 'application/json' });

        const link = document.createElement('a');
        link.download = "appcatch-data-json.json";
        link.href = URL.createObjectURL(blob);

        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(clickEvt);
        link.remove();
    }

    /** 크래시덤프 저장 클릭 이벤트 */
    const handleDumpDownload = () => {
        const blob = new Blob([JSON.stringify(dumpData)], { type: 'application/json' });

        const link = document.createElement('a');
        link.download = "appcatch-data-dump.json";
        link.href = URL.createObjectURL(blob);

        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(clickEvt);
        link.remove();
    }

    return (
        <div className='eventDownload' style={style}>
            {isCsv && <CSVLink className='csvLink' extension=".csv" filename="appcatch-data-csv.csv" data={Array.isArray(downloadData) ? downloadData : [downloadData]}>
                <button disabled={disabled}>CSV 저장</button>
            </CSVLink>}
            {isJson && <button disabled={disabled} onClick={handleJsonDownload}>JSON 저장</button>}
            {isDump && <button disabled={disabled} onClick={handleDumpDownload}>크래시덤프 저장</button>}
        </div>
    );
};

export default EventDownload;