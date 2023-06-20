import React from 'react';

// Images & Icons
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/ic_arrow_left.svg';
import { ReactComponent as ArrowRightIcon } from '../../assets/icons/ic_arrow_right.svg';

// Styles
import './MainPagination.scss';

const MainPagination = ({page, handlePrePage, handleNextPage}) => {
    return (
        <div className='pagination'>
            <ArrowLeftIcon onClick={handlePrePage}/>
            <span>Page {page}</span>
            <ArrowRightIcon onClick={handleNextPage} />
        </div>
    );
};

export default MainPagination;