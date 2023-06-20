import React from 'react';

// Styles
import './DataForm.scss';


type DataFormProps = {
    title: string;
    children: React.ReactNode;
    width?: number|string;
    label?: string;
};
const DataForm:React.FC<DataFormProps> = ({title, children, width, label}) => {
    return (
        <div className='dataform'>
            <h5>{title}</h5> <label>{label}</label>
            <div className='content' style={{width: width}}>
                {children}
            </div>
        </div>
    );
};

export default DataForm;