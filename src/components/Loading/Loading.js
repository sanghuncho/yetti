import React from 'react';
import { MoonLoader } from 'react-spinners';

// Styles
import './Loading.scss';

const Loading = () => {
    return (
        <div className='loading'>
            <div className='form'>
                <MoonLoader
                    className='loader'
                    color="black"
                    size={60}
                    margin={2}/>
            </div>
        </div>
    );
};

export default Loading;