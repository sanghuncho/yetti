import React from 'react';

// Components
import Title from '../Title/Title';

// Styles
import './StatisticsForm.scss';

const StatisticsForm = ({title, content, children, width}) => {
    return (
        <div className='statisticsForm' width={width}>
            <Title className='title' title={title} bgColor='#8197C3' />
            <div>
                <span className='explain'>{content}</span>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StatisticsForm;