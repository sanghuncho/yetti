import React from 'react';

// Images
import { ReactComponent as CloseIcon } from '../../assets/icons/ic_close.svg';

// Styles
import './Modal.scss';

const TermModal = ({isOpen, setIsOpen, contents}) => {

    // X 버튼 클릭 이벤트
    const handleClose = (e) => {
        if(e?.target !== e?.currentTarget) return;
        setIsOpen(false);
    }
    
    return (
        <div className={isOpen ? 'termModal openModal' : 'termModal'} onClick={e => handleClose(e)}>
            <div className='modalBox'>
                <div className='contents'>
                    <CloseIcon className='icon' onClick={e => handleClose()} />
                    <div>
                        {contents}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermModal;