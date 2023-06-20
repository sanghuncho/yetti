import React from 'react';

// Images
import { ReactComponent as CloseIcon } from '../../assets/icons/ic_close.svg';

// Styles
import './Modal.scss';

const DetailModal = ({isOpen, setIsOpen, headerTitle, headerItems, width, height, children}) => {

    // X 버튼 클릭 이벤트
    const handleClose = (e) => {
        if(e?.target !== e?.currentTarget) return;
        setIsOpen(false);
    }
    
    return (
        <div className={isOpen ? 'detailModal openModal' : 'detailModal'} onClick={e => handleClose(e)}>
            <div className='modalBox' style={{width: width && width, height: height && height}}>
                <div className='contents'>
                    <div className='header'>
                        <h5>{headerTitle}</h5>
                        <span className='rightItems'>
                            {headerItems}
                            <CloseIcon className='icon' onClick={e => handleClose()} />
                        </span>
                    </div>
                    <div className='children2'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;