import React from 'react';

// Images & Icons
import CheckBoxOn from '../../assets/icons/ic_check_box2_on';
import CheckBoxOff from '../../assets/icons/ic_check_box2_off';

// Styles
import './FilterCheckBoxs.scss';

const FilterCheckBoxs = ({filterData, filterType, checkedData, title, onChangeAll, onChangeItem}) => {
    return (
        <div className='filterCheckBoxs'>
            <div className="checkbox">
                <label htmlFor={filterType}>
                    {filterData?.length === checkedData?.length ? <CheckBoxOn color='#B7D2FF'/> : <CheckBoxOff color='#B7D2FF'/>}
                </label>
                <input type="checkbox" id={filterType} onChange={(e) => onChangeAll(e.target.checked, e.target.id)}/>
                <span>{title}</span> 
            </div>
            {filterData?.map((item) => {
                return(
                    <div className="checkbox">
                        <label className='icon' htmlFor={item}>
                            {checkedData?.includes(item) ? <CheckBoxOn color='#B7D2FF'/> : <CheckBoxOff color='#B7D2FF'/>}
                        </label>
                        <input type="checkbox" id={item} onChange={(e) => onChangeItem(e.target.checked, item, 0)}/>
                        <span>{item}</span>
                    </div>
                )
            })}
        </div>
    );
};

export default FilterCheckBoxs;