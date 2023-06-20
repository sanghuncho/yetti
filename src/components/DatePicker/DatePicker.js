import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';

// Images & Icons
import { ReactComponent as CalendarIcon } from '../../assets/icons/ic_calendar.svg';

// Styles
import './DatePicker.scss';

const DatePicker = ({startDate, endDate, setStartDate, setEndDate}) => {
    return (
        <div className='dataPickerArea'>
            <label>
                <div className='datePickerInput'>
                    <ReactDatePicker className='datePicker' locale={ko} selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy/MM/dd" maxDate={endDate ? endDate : new Date()} />
                    <CalendarIcon className='icon' />
                </div>
            </label>
            <span className='contour'></span>
            <label>
                <div className='datePickerInput'>
                    <ReactDatePicker className='datePicker' locale={ko} selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy/MM/dd" minDate={startDate ?? null} maxDate={new Date()} />
                    <CalendarIcon className='icon' />
                </div>
            </label>
        </div>

    );
};

export default DatePicker;