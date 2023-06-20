import React from 'react';
import { useDispatch } from 'react-redux';

import { dateTime } from '../../utils/time';

// Components
import DataForm from '../../components/DataForm/DataForm';

// Images & Icons
import {ReactComponent as RemoveIcon} from '../../assets/icons/ic_remove.svg';
import { alertMessage, errorMsg, iconLevel } from '../../utils/message';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { deleteServicePermission } from '../../api/serviceApi';
import { checkLogin } from '../../utils/isLogin';
import routes from '../../libs/routes';

type SubscribedServicesProps = {
    serviceList: Array<{[key:string]:any}>;
    setNum: React.Dispatch<React.SetStateAction<number>>;

};

const SubscribedServices:React.FC<SubscribedServicesProps> = ({serviceList, setNum}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /** 사용자 조회 권한 삭제 이벤트 */
    const handleDeletePermission = async(shId:string, sId:string) => {
        Swal.fire({
            icon: 'warning',
            text: "해당 서비스의 구독을 해지하겠습니까? ",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B4B4B4',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            dispatch(startLoading());

            try {
                // 서비스조회권한사용자삭제 API 연동
                let result = await deleteServicePermission(shId, sId);

                if (!checkLogin(dispatch, result.code)) {
                    navigate(routes.login);
                    // dispatch(endLoading());
                    return;
                }

                // code 0 이 아님 : API 요청 실패
                if(result.code !== 0) {
                    errorMsg(result.message);
                    // dispatch(endLoading());
                    return;
                }
                alertMessage(iconLevel.SUCCESS, "서비스 구독을 해지하였습니다.");
                setNum((pre:number) => pre + 1);
            } catch (error: any) {
                if (error.message) {
                    errorMsg(`${error?.message}`);
                }
                dispatch(endLoading());
            } 
            // finally {
            //     dispatch(endLoading());
            // }
        })

    }

    return (
        <DataForm title='구독 서비스'>
            {/* 조회권한 받은 서비스 */}
            <div className='service'>
                <table className='other serviceTable'>
                    <thead>
                        <tr>
                            <th>서비스</th>
                            <th>관리자</th>
                            <th>등록일 (최종 수정일)</th>
                            <th>구독 해지</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceList.filter(i=>!i.owner).map((item, index) => {
                            return(
                                <React.Fragment key={index}>
                                    <tr>
                                        <td >{item.name}</td>
                                        <td >{item.email}</td>
                                        <td >{`${dateTime(item.regDate)} (${dateTime(item.modDate)})`}</td>
                                        <td style={{padding:'0 20px',overflow:'hidden'}} onClick={ ()=>handleDeletePermission(item.shid, item.id)}>
                                            <RemoveIcon className='removeIcon'  />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{minHeight: 45}} />
        </DataForm>
    );
}

export default SubscribedServices;