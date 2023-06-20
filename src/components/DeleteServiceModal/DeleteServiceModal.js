import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteServiceInfo } from '../../api/serviceApi';
import { logout } from '../../redux/actions/user';
import { removeStorage } from '../../utils/storage';
import { endLoading, startLoading } from '../../redux/actions/loading';
import Swal from "sweetalert2"
import routes from '../../libs/routes';
import { errorMsg, alertMessage, iconLevel, SESSIONMESSAGE } from '../../utils/message';

// Components
import DetailModal from '../Modal/DetailModal';

// Styles
import './DeleteServiceModal.scss';
import '../../styles/sweetalert2.scss';
const DeleteServiceModal = ({isOpen, setIsOpen, setDeleteService, service, setNum}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[serviceName, setServiceName] = useState('');
    const[password, setPassword] = useState('');

    /** 팝업 닫기 이벤트 */
    const setClose = () => {
        setDeleteService(null);
        setIsOpen(null);
    }

    /** 삭제 버튼 클릭 이벤트 */
    const handleDelete = () => {
        if(serviceName !== service.name) {
            alertMessage(iconLevel.WARNING, "서비스가 다릅니다.");
            return;
        }

        if(password === '' || password === null) {
            alertMessage(iconLevel.WARNING, "비밀번호를 입력해주세요.");
            return;
        }

        // 삭제  API 연동
        Swal.fire({
            icon: 'warning',
            text: "해당 서비스를 삭제하시겠습니까?",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B4B4B4',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(startLoading());
                deleteServiceInfo(service.id).then((result) => {

                    if(!checkLogin(dispatch, result.code)){
                        navigate(routes.login);
                        return;
                    }
    
                    // code 0 이 아님 : API 요청 실패
                    if(result.code !== 0) {
                        errorMsg(result.message);
                        return;
                    }
            
                    // API 요청 성공
                    alertMessage(iconLevel.SUCCESS, "해당 서비스 삭제가 완료되었습니다.");
                    setClose();
                    setNum(pre => pre + 1);
                })
                dispatch(endLoading());
            }
        })
    }

    return (
        <DetailModal isOpen={isOpen} setIsOpen={setClose} headerTitle='서비스 삭제' width={1100} height={350} >
            <div className='deleteServiceModal'>
                <div className='inputArea'>
                    <span>서비스명</span>
                    <input placeholder='삭제하려는 서비스명을 입력해주세요.' value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                </div>
                <div className='inputArea'>
                    <span>비밀번호</span>
                    <input type='password' placeholder='로그인 시 사용하는 비밀번호를 입력해주세요.' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='buttonArea'>
                    <button onClick={setClose}>취소</button>
                    <button onClick={handleDelete}>삭제</button>
                </div>
            </div>
        </DetailModal>
    );
};

export default DeleteServiceModal;