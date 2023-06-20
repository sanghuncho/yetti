import React from 'react';
import Select from 'react-select'

const SelectBox = ({serviceList, onChange}) => {
    const customStyles = {
        singleValue: base =>({
            ...base,
            height: '20px',
        })
    }

    let mineArr = []; //내가 만든 서비스 
    let otherArr = []; // 구독 서비스

    serviceList?.map((item)=>{
        if(item.owner) mineArr.push({ value: item.id, label: item.name });
        else otherArr.push({ value: item.id, label: item.name, customAbbreviation: `관리자: ${item.email}` });
    });
 
    const groupOption = [
        {
            label:'내 서비스',
            options: mineArr
        },
        {
            label:'구독 서비스',
            options: otherArr
        }
    ];

    const formatOptionLabel = ({value, label, customAbbreviation}) => (
        <div style={{display: "flex"}}>
            <div style={{width: "150px"}}>{label}</div>
            <div style={{color: "#ccc"}}>
                {customAbbreviation}
            </div>
        </div>
    );

    return (
        <Select
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
            onChange={onChange}
            options={groupOption}
        />)        

};

export default SelectBox;