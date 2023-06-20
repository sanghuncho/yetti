import React from 'react';
import { randomStr } from '../../utils/random';

// Images & Icons
import CheckBoxOn from '../../assets/icons/ic_checkbox_2_on';
import CheckBoxOff from '../../assets/icons/ic_checkbox_2_off';

// Styles
import './CheckBox.scss';

const CheckBox = ({text, textColor = 'black', textSize = 14, fontWeight = 400, checkboxColor = '#4c52bc', onClick, checked}) => {

    const randomId = randomStr();

    const textStyle = {
        color: textColor, 
        fontSize: textSize, 
        fontWeight: fontWeight.bold
    }

    return (
        <div className="checkbox">
            <label htmlFor={randomId}>
                {checked ? <CheckBoxOn color={checkboxColor} /> : <CheckBoxOff color={checkboxColor} />}
            </label>
            <input type="checkbox" id={randomId} onClick={onClick} hidden/>
            {text && <span style={textStyle}>{text}</span>}
        </div>
    );
};

export default CheckBox;