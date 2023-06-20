import React, { useEffect } from "react";
import Select, { components }  from "react-select";
import { ReactComponent as ErrorInfoIconRed }  from '../../../assets/icons/ic_errorInfo_red.svg';

import './ThreadSelect.scss';
import { useState } from "react";

const ThreadSelect = ({setDefaultIdx, data, onChange}) => {
    // luf 데이터가 있으면 포커스 맞추기
    const [list,setList] = useState([]);
    const [key,setKey] = useState([]);
    
    // let list = [];
    // let key;
    useEffect(()=>{
        data.forEach((item, index) => {
            const name = "Thread " + index;
            if(item.luf !== undefined) {
                setKey({ value: index , label : name , icon: <ErrorInfoIconRed className="warninIcon" />});
                setList(lists=>[...lists,{value : index , label : name , icon: <ErrorInfoIconRed className="warninIcon" />}]);
                setDefaultIdx(index);
            }else{
                setList(lists=>[...lists,{value : index , label : name}]);
            }
        });
    },[data])
    const Option = (props) => (
        <components.Option {...props} className="icon-option" >
          {props.data.label }{ props.data.icon && <ErrorInfoIconRed className="warninIcon" /> }
        </components.Option> 
    );
    const SingleValue = ({  children, ...props }) => (
        <components.SingleValue {...props}  className="icon-singleValue">
            {children}{ props.data.icon && <ErrorInfoIconRed className="warninIcon" /> }
        </components.SingleValue>
    );

    const customStyles = {
        control: base => ({
            ...base,
            height: 30,
            minHeight: 30,
            width: 129,
            marginTop:1,
            fontSize: 'small',
            borderRadius:'10px 10px 10px 10px'
        }),
        menuList: base =>({
            ...base,
            maxHeight: 180,
            width: 120,
            fontSize: 'small',
        }),
        menu: base =>({
            ...base,
            width:120,
            borderRadius:'10px 10px 10px 10px'
        }),
        valueContainer: base => ({
             ...base,
             height: 20,
             width:120,
         }),
         indicatorsContainer: base => ({
             ...base,
             height: 15,
             minHeight: 30,
             alignItems: 'center',
         }),
    
    }

    return (
        <Select
            // defaultValue와 key를 같이 사용해야 default가 update됨
            defaultValue={key} 
            key={key}
            isSearchable={false}
            onChange={onChange}
            options={list}
            placeholder="Thread 0"
            styles={customStyles}
            components={{
                Option,
                SingleValue
            }}
        />)
};


export default ThreadSelect;