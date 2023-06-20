import React, { useState }  from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postServiceInfo } from '../../api/serviceApi';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { alertMessage, iconLevel } from '../../utils/message';
import routes from '../../libs/routes';
import { checkLogin } from '../../utils/isLogin';

// Images & Icons
import { ReactComponent as CopyIcon } from '../../assets/icons/ic_copy.svg';

// Components
import DetailModal from '../Modal/DetailModal';

// Styles
import './AddServiceModal.scss';
import '../../styles/sweetalert2.scss';

const AddServiceModal = ({isOpen, setIsOpen, setNum}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[serviceName, setServiceName] = useState("");
    const[serviceKey, setServiceKey] = useState("");

    /** 팝업 닫기 이벤트 */
    const setClose = () => {
        setIsOpen(null);
        if(serviceKey) {
            setNum(pre => pre+1);
        }
    }

    /** 등록 버튼 이벤트 */
    const register = (e) => {
        if (e) e.preventDefault();

        dispatch(startLoading());
        postServiceInfo(serviceName).then((result) => {

            if(!checkLogin(dispatch, result.code)){
                navigate(routes.login);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                let errorMessage;
                switch (result.code){
                    case -1011: // code -1011 : check input value
                        errorMessage = "서비스를 입력해 주세요."
                        break;
                    case -1050: // code -1050 : exists service
                        errorMessage = "중복된 서비스입니다."
                        break;
                    case -1080: // code -1080 : sql processing fail, 보류 중
                        errorMessage = "관리자에게 문의하세요."
                        break;
                    default:
                        errorMessage = result.message;
                }
                alertMessage(iconLevel.WARNING, errorMessage);
                dispatch(endLoading());
                return;
            }
    
            // API 요청 성공
            alertMessage(iconLevel.SUCCESS, "서비스가 추가되었습니다.");
            setServiceKey(result.data);
            setServiceName("");
        })
        dispatch(endLoading());
    }

    /** 클립보드 복사 이벤트 */
    const handleCopyClipBoard = async(key) => {
        try {
            await navigator.clipboard.writeText(key);
            alertMessage(iconLevel.SUCCESS, "클립보드에 복사되었습니다. ");
        } catch (e) {
            alertMessage(iconLevel.ERROR, "복사에 실패하였습니다");
        }
    };

    return (
        <DetailModal isOpen={isOpen} setIsOpen={setClose} headerTitle='서비스 추가' width={1100} height={300}  >
            <div className='addServiceModal'>
                <div className='inputArea'>
                    <span>서비스명</span>
                    <input placeholder='추가하려는 서비스명을 입력해주세요.' value={serviceName} onChange={(e) => setServiceName(e.target.value)} onKeyDown={e => e.keyCode == 13 ? register(e) : ''} autoFocus />
                    <button onClick={register}>등록</button>
                </div>
                <div className='inputArea'>
                    <span>서비스키</span>
                    <span>
                        <span className='key'>{serviceKey}</span>
                        {serviceKey && <CopyIcon className='copyIcon' onClick={() => handleCopyClipBoard(serviceKey)} />}
                    </span>
                </div>
            </div>
        </DetailModal>
    );
};

export default AddServiceModal;