import React from 'react';

// Images
import { ReactComponent as CloseIcon } from '../../assets/icons/ic_close.svg';

// Styles
import './Modal.scss';

const ChannelModal = ({isOpen, setIsOpen, children}) => {

    // X 버튼 클릭 이벤트
    const handleClose = (e) => {
        if(e?.target !== e?.currentTarget) return;
        setIsOpen(false);
    }

    return (
        <div className={isOpen ? 'channelModal openModal' : 'channelModal'} onClick={e => handleClose(e)}>
            <div className='modalBox'>
                <div className='contents'>
                    <CloseIcon className='icon' onClick={e => handleClose()} />
                    <div className="modalCnts">
                        <p className="modalTitle">수신채널 등록 <span> &#40;최대 5개까지 가능&#41; </span></p>
                        
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelModal;