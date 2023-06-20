import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteServiceInfo, deleteServicePermission, getServiceList, postServicePermission, servicePermissionList, deleteLog } from '../../api/serviceApi';
import { checkUserPassword, patchUserInfo, userLogin } from '../../api/userApi';
import { changeInfoEncrypt, encrypt } from '../../utils/encrypt';
import { login } from '../../redux/actions/user';
import { dateTime } from '../../utils/time';
import { errorMsg, alertMessage, iconLevel } from '../../utils/message';
import { endLoading, startLoading } from '../../redux/actions/loading';
import { passwordRegExp } from '../../libs/regex';
import routes from '../../libs/routes';
import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import { checkLogin } from '../../utils/isLogin';
import SubscribedServices from './SubscribedServices';

// Components
import Category from '../../components/Category/Category';
import Navbar from '../../components/Navbar/Navbar';
import Layout from '../../layout/MainLayout/MainLayout';
import DataForm from '../../components/DataForm/DataForm';
import Title from '../../components/Title/Title';
import AddServiceModal from '../../components/AddServiceModal/AddServiceModal';

// Images & Icons
import { ReactComponent as UserIcon } from '../../assets/icons/ic_user.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/ic_edit.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/ic_remove.svg';
import { ReactComponent as CopyIcon } from '../../assets/icons/ic_copy.svg';
import { ReactComponent as ValidIcon } from '../../assets/icons/ic_pass.svg';
import { ReactComponent as InvalidIcon } from '../../assets/icons/ic_fail.svg';

// Styles
import '../../styles/Management.scss';
import '../../styles/sweetalert2.scss';
import ReactTooltip from 'react-tooltip';

const Management = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { name, email, statusCode } = useSelector(({user}) => { return user.value});

    // 내 정보 데이터
    const[userName, setUserName] = useState("");
    const[password, setPassword] = useState("");
    const[newPassword, setNewPassword] = useState("");
    const[newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const[isNameEdit, setIsNameEdit] = useState(false);

    // 내 서비스 리스트 데이터
    const[serviceList, setServiceList] = useState([]);
    const[selectLine, setSelectLine] = useState(-1);

    // 비밀번호 변경 상태
    /**
     * 0: 수정을 하지 않는 상태
     * 1: 수정을 하는 상태 (비밀번호 확인 이전)
     * 2: 수정을 하는 상태 (비밀번호 확인 후, 데이터 갱신)
     */
    const[changePassword, setChangePassword]  = useState(0);

    // 서비스조회권한사용자 데이터
    const[permissionList, setPermissionList] = useState([]);

    // 모달 관련 State
    const[isModalOpen, setIsModalOpen] = useState(false);

    // 서비스 키 확인 State
    const[keyView, setKeyView] = useState(false);

    // 사용자 추가 버튼 클릭 상태 State
    const[isAddUser, setIsAddUser] = useState(false);

    // 사용자권한추가할 이메일 주소 State
    const[addingEmail, setAddingEmail] = useState("");

    // 서비스 리스트 API 재호출
    const[num, setNum] = useState(0);

    const[ownerTotalSize, setOwnerTotalSize] = useState("");

    const STATUS_CODE = {
        "0": "정상 이용 가능",
        // "1": "메일 인증 필요",
        // "2": "접속금지",
        "3": "관리자 승인 필요"
    };

    useEffect(() => {
        setUserName(name);
    }, [name]);

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    // 서비스 리스트 데이터 호출
    useEffect(() => {
        dispatch(startLoading());
        // 서비스 리스트 API 연동
        getServiceList().then((result) => {
            // dispatch(endLoading());

            if (!checkLogin(dispatch, result.code)) {
                navigate(routes.login);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }

            // QR 데이터 필드 추가
            result.data.map(item => {
                const resultQR = {
                    email: item.email,
                    name: encodeURIComponent( item.name ),
                    pks: item.pks,
                    serverUrl: item.serverUrl
                };
                item.qr = 'appcatch://yettiesoft?' + btoa(JSON.stringify(resultQR));
            });

            // API 요청 성공
            setServiceList(result.data);
            calculateTotalSize(result.data);
            dispatch(endLoading());
        }).catch(error => {
            errorMsg(`${error?.message}`);
            dispatch(endLoading());
            return;
        });
    }, [dispatch, navigate, num]);

    /** 변경사항 저장 클릭 이벤트 */
    const handleChangeUserData = async(e) => {
        if (e) e.preventDefault();

        let message;

        if (newPassword !== newPasswordConfirm) {
            message = "변경하려는 비밀번호가 서로 다릅니다. 다시 입력해주세요.";
            alertMessage(iconLevel.WARNING, message);
            return;
        }

        let encryptResult, encryptNewPw = null;

        if(newPassword !== '') {
            if (newPassword !== '' && !passwordRegExp.test(newPassword)) {
                message = "비밀번호는 8자리 이상 영문, 숫자, 특수문자가 포함되어야 합니다. ";
                alertMessage(iconLevel.WARNING, message);
                return;
            }

            encryptResult = await changeInfoEncrypt(password, newPassword);
            encryptNewPw = encryptResult.newPassword;
        } 

        if ( !encryptNewPw && (userName === name) ) {
            message = "변경할 데이터가 없습니다. 다시 확인해주세요.";
            alertMessage(iconLevel.WARNING, message);
            return;
        }

        patchUserInfo(userName !== name ? userName : null,
                      encryptNewPw).then((result) => {

            if (!checkLogin(dispatch, result.code)) {
                navigate(routes.login);
                return;
            }

            if (result.code !== 0) {
                let errorMessage;
                switch (result.code) {
                    case -1012:
                        errorMessage = "비밀번호 오류 입니다. 다시 입력해 주십시오.";
                        break;
                    case -1014:
                        errorMessage = "동일한 비밀번호로 변경할 수 없습니다.";
                        break;
                    default:
                        errorMessage = result.message;
                }
                alertMessage(iconLevel.WARNING, errorMessage);
                return;
            }

    
            // API 요청 성공
            message = "내 정보를 변경하였습니다. ";
            alertMessage(iconLevel.SUCCESS, message);

            // 리덕스 유저 정보 갱신
            dispatch(login({
                "email": email,
                "name": userName,
                "statusCode":statusCode
            }));

            // 비밀번호 입력창 초기화
            setPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setChangePassword(0);
            setIsNameEdit(false);
        }).catch(error => {
            errorMsg(`${error?.message}`);
            return;
        });
    }

    /** Table line 클릭 이벤트 */
    const handleClickLine = (service) => {
        setIsAddUser(false);
        
        if(selectLine === service.id) {
            setSelectLine();
        } else {
            servicePermissionList(service.id).then((result) => {

                if (!checkLogin(dispatch, result.code)) {
                    navigate(routes.login);
                    return;
                }    
                // code 0 이 아님 : API 요청 실패
                if(result.code !== 0) {
                    errorMsg(result.message);
                    return;
                }
        
                // API 요청 성공
                setSelectLine(service.id);
                setPermissionList(result.data);
                setKeyView(false);
            }).catch(error => {
                errorMsg(`${error?.message}`);
                return;
            });
        }
    }

    /** 데이터 삭제 이벤트 */
    const handleDeleteLog = (service) => {
        // 삭제  API 연동
        Swal.fire({
            icon: 'warning',
            text: "모든 데이터를 삭제하시겠습니까?",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#B4B4B4',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (!result.isConfirmed) return;
            dispatch(startLoading());
            deleteLog(service.id).then((result) => {
                dispatch(endLoading());

                if (!checkLogin(dispatch, result.code)) {
                    navigate(routes.login);
                    return;
                }

                // code 0 이 아님 : API 요청 실패
                if(result.code !== 0) {
                    errorMsg(result.message);
                    return;
                }
        
                // API 요청 성공
                alertMessage(iconLevel.SUCCESS, "데이터가 삭제되었습니다.");
                setNum(pre => pre + 1);
            }).catch(error => {
                console.log(error);
                errorMsg(`${error?.message}`);
                dispatch(endLoading());
                return;
            });
            
        });
    }

    /** 서비스 삭제 아이콘 클릭 이벤트 */
    const handleDeleteService = (service) => {
        
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
            if (!result.isConfirmed) return;
            dispatch(startLoading());
            deleteServiceInfo(service.id).then((result) => {
                dispatch(endLoading());

                if (!checkLogin(dispatch, result.code)) {
                    navigate(routes.login);
                    return;
                }

                // code 0 이 아님 : API 요청 실패
                if(result.code !== 0) {
                    errorMsg(result.message);
                    return;
                }
        
                // API 요청 성공
                alertMessage(iconLevel.SUCCESS, "해당 서비스가 삭제되었습니다.");
                setNum(pre => pre + 1);
            }).catch(error => {
                console.log(error);
                errorMsg(`${error?.message}`);
                dispatch(endLoading());
                return;
            });
        });
    }

    /** 사용자 조회 권한 추가 이벤트 */
    const handleAddPermission = async(service, e) => {
        if (e) e.preventDefault();

        if(addingEmail === "" || addingEmail === null) {
            alertMessage(iconLevel.WARNING, "이메일을 입력해주세요.");
            return;
        }

        dispatch(startLoading());

        try {
            // 서비스조회권한사용자추가 API 연동
            let result = await postServicePermission(service.id, addingEmail);

            if (!checkLogin(dispatch, result.code)) {
                navigate(routes.login);
                dispatch(endLoading());
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if (result.code !== 0) {
                let errorMessage;
                switch (result.code) {
                    case -1020: // code -1020 : already registered user
                        errorMessage = "이미 조회 권한에 등록된 사용자입니다.";
                        break;
                    case -1022: // code -1022 : not registered user
                        errorMessage = "가입되지 않은 사용자입니다.";
                        break;
                    case -1030: // code -1030 : self set permission is block
                        errorMessage = "본인은 등록할 수 없습니다.";
                        break;
                    case -1033: // code -1033 : NOT_VALID_USER_INFO
                        errorMessage = "관리자에게 문의하세요. \n 서비스 이용 권한이 없는 사용자입니다."
                        break;
                    default:
                        errorMessage = result.message;
                }
                alertMessage(iconLevel.WARNING, errorMessage);
                dispatch(endLoading());
                return;
            }

            // 서비스조회권한사용자추가 API 요청 성공
            // 서비스조회권한사용자조회 API 연동
            let result2 = await servicePermissionList(service.id);

            if (!checkLogin(dispatch, result2.code)) {
                navigate(routes.login);
                dispatch(endLoading());
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if (result2.code !== 0) {
                errorMsg(result2.message);
                dispatch(endLoading());
                return;
            }

            // API 요청 성공
            setPermissionList(result2.data);
            alertMessage(iconLevel.SUCCESS, "조회 권한에 해당 사용자를 추가하였습니다.");
        } catch (error) {
            console.log(error);
            errorMsg(`${error?.message}`);
            return;
        } finally {
            dispatch(endLoading());
        }

    }

    /** 사용자 조회 권한 삭제 이벤트 */
    const handleDeletePermission = async(shId, sId) => {
        Swal.fire({
            icon: 'warning',
            text: "해당 사용자의 조회 권한을 삭제하겠습니까? ",
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
                    dispatch(endLoading());
                    return;
                }

                // code 0 이 아님 : API 요청 실패
                if(result.code !== 0) {
                    errorMsg(result.message);
                    dispatch(endLoading());
                    return;
                }

                // 서비스조회권한사용자삭제 API 요청 성공
                // 서비스조회권한사용자조회 API 연동
                let result2 = await servicePermissionList(sId);

                if (!checkLogin(dispatch, result2.code)) {
                    navigate(routes.login);
                    dispatch(endLoading());
                    return;
                }

                // code 0 이 아님 : API 요청 실패
                if(result2.code !== 0) {
                    errorMsg(result2.message);
                    dispatch(endLoading());
                    return;
                }

                // API 요청 성공
                setPermissionList(result2.data);
                alertMessage(iconLevel.SUCCESS, "조회 권한에서 해당 사용자를 삭제하였습니다.");

                dispatch(endLoading());
            } catch (error) {
                console.log(error);
                errorMsg(`${error?.message}`);
            } finally {
                dispatch(endLoading());
            }
        })

    }

    /** 클립보드 복사 이벤트 */
    const handleCopyClipBoard = async (key) => {
        try {
            await navigator.clipboard.writeText(key);
            alertMessage(iconLevel.SUCCESS, "클립보드에 복사되었습니다.");
        } catch (e) {
            alertMessage(iconLevel.ERROR, "복사에 실패하였습니다.");
        }
    }

    const handleChangeCancel = () => {
        setUserName(name);
        setPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setChangePassword(0);
        setIsNameEdit(false);
    }

    const handleCheckPassword = async(e) => {
        if (e) e.preventDefault();

        if (password === '') {
            alertMessage(iconLevel.WARNING, "비밀번호는 8자리 이상 영문, 숫자, 특수문자가 포함되어야 합니다.");
            return;
        }

        let encryptPw = await encrypt(password);
        checkUserPassword(encryptPw).then((result) => {

            if (!checkLogin(dispatch, result.code)) {
                navigate(routes.login);
                return;
            }

            if (result.code === -1012) {
                alertMessage(iconLevel.WARNING, "비밀번호 오류입니다. 다시 입력해 주세요.");
                return;
            }

            if (result.code === 0) {
                setChangePassword(2);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if (result.code !== 0) {
                errorMsg(result.message);
                return;
            }
        }).catch(error => {
            console.log(error);
            errorMsg(`${error?.message}`);
            return;
        });
    }

    
    function convertLog(logSize) {

        let convertedSize = '-';
        if (logSize === 0)
            return convertedSize;

        if (logSize >= 1000000) {
            convertedSize = String((logSize / 1000000).toFixed(2)).padStart(5, ' ');
        } else if (logSize >= 1000) {
            convertedSize = String((logSize / 1000).toFixed(2)).padStart(5, ' ');
        } else if (logSize > 0) {
            convertedSize = String((logSize).toFixed(2)).padStart(5, ' ');
        }
        return convertedSize;
    }

    function getDataUnit(logSize) {

        let unit = ' ';
        if (logSize === 0)
            return unit;

        if (logSize >= 1000000) {
            unit = ' GB';
        } else if (logSize >= 1000) {
            unit = ' MB';
        }
        else if (logSize > 0) {
            unit = ' KB';
        }

        return unit
    }

    function addDelete(item) {
        let content;
        if (item.email === email) {
            if (item.logSize !== 0) {
                content = <div style={{ float: 'right' }} className='logDelete' disabled='disabled' onClick={() => handleDeleteLog(item)}>삭제</div>;
            } else {
                content = <div style={{ width: '20%', textAlign: 'center', display: 'inline-block' }}></div>;
            }
        } else {
            content = <div style={{ float: 'right', width: '20%' }}> </div>;
        }
        return content;
    }

    function calculateTotalSize (list) {
        let totalSize = 0;
        list.filter(i=>i.owner).map((item, index) => {
            totalSize += item.logSize;
        });
        
        // console.log(`calculateTotalSize = ${convertLog(totalSize) + getDataUnit(totalSize)}`);
        setOwnerTotalSize(`데이터 총합: ${convertLog(totalSize) + getDataUnit(totalSize)}`);
    }

    const dataWidth = "60em";

    return (
        <Layout>
            <div className='management'>
                <Navbar/>
                <Category text="내 정보" />
                <DataForm title='내 정보 관리' width={dataWidth}>
                    <div className='mydata'>
                        <div className='profile1'>
                            <UserIcon className='userIcon'/>
                            <div className='name'>
                                <input style={changePassword ===2 ?{"border-bottom": "1px solid #4e4e4e"} : {}} value={userName} onChange={(e) => setUserName(e.target.value)} disabled={!isNameEdit}/>
                                {changePassword === 2 &&
                                    <EditIcon className='editIcon' onClick={() => setIsNameEdit(!isNameEdit)}
                                    style={isNameEdit ? {filter: 'invert(100%)'} : {}} />
                                }
                            </div>
                        </div>
                        <div className='profile2'>
                            <div className='email'>
                                <Title title="이메일" />
                                <p>{email}</p>
                            </div>
                            <div className='permission'>
                                <Title title="서비스 권한" />
                                {statusCode === '0' ?
                                    <>
                                        <p className='status valid'>
                                            <ValidIcon className='validIcon' />
                                            {STATUS_CODE[statusCode]}
                                        </p>
                                    </> :
                                    <>
                                        <p className='status invalid' data-tip={'관리자 승인 후 내 서비스를 추가하실 수 있습니다.'}>
                                            <InvalidIcon className='invalidIcon' />
                                            {STATUS_CODE[statusCode]}
                                        </p>
                                        <ReactTooltip type='error' effect='solid' padding='15px' />
                                    </>
                                }
                            </div>
                            <div>
                                {/* <Title title="비밀번호" /> */}
                                <div className='password'>
                                {changePassword === 0 &&
                                    <>
                                    <div className='changePassword' onClick={() => setChangePassword(1)} >
                                        내 정보 변경
                                    </div>
                                    </>
                                }
                                {changePassword === 1 &&
                                    <>
                                    <Title title="비밀번호" /><br/>
                                    <input type='password' placeholder='현재 비밀번호 입력' value={password} onKeyDown={e => e.keyCode == 13 ? handleCheckPassword(e) : ''} onChange={e => setPassword(e.target.value)} maxLength="15" autoFocus /><br/>
                                    <button onClick={handleCheckPassword} >비밀번호 확인</button>
                                    <button onClick={handleChangeCancel} >변경 취소</button>
                                    </>
                                }
                                {changePassword === 2 &&
                                    <>
                                    <Title title="비밀번호" /><br/>
                                    <p className='pwInfo'>8자리 이상 영문, 숫자, 특수문자가 포함되어야 합니다.</p>

                                    <input type='password' placeholder='새 비밀번호' value={newPassword} onChange={e => setNewPassword(e.target.value)} maxLength="15" autoFocus /><br/>
                                    <input type='password' placeholder='새 비밀번호 확인' value={newPasswordConfirm} onChange={e => setNewPasswordConfirm(e.target.value)} onKeyDown={e => e.keyCode == 13 ? handleChangeUserData(e) : ''} maxLength="15" /><br/>

                                    <button onClick={handleChangeUserData} >변경사항 저장</button>
                                    <button onClick={handleChangeCancel} >변경 취소</button>
                                    </>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </DataForm>
                <div style={{minHeight: 5}} />
                {/* <Category text="내 서비스" isIcon={false} /> */}
                <SubscribedServices serviceList={serviceList} setNum={setNum} ></SubscribedServices>
                <DataForm title={`내서비스`} label={`(${ownerTotalSize})`} width={dataWidth}>
                    {/* 내가 생성한 서비스 */}
                    <div className='service'>
                        <table className='serviceTable'>
                            <thead>
                                <tr>
                                    <th>서비스</th>
                                    <th>등록일 (최종 수정일)</th>
                                    <th>데이터</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceList.filter(i=>i.owner).map((item, index) => {
                                    return(
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td style={{cursor: 'pointer'}} onClick={() => handleClickLine(item)}>{item.name}</td>
                                                {/* <td style={{cursor: 'pointer'}} onClick={() => handleClickLine(item)}>{item.email}</td> */}
                                                <td style={{cursor: 'pointer'}} onClick={() => handleClickLine(item)}>{`${dateTime(item.regDate)} (${dateTime(item.modDate)})`}</td>
                                                <td style={{padding:'0 20px',overflow:'hidden'}}>
                                                    <div style={{width:'100%'}}>
                                                    <div style={{align: 'center', textAlign:'right', display:'inline-block', width:'30%'}}>
                                                    {
                                                        convertLog(item.logSize) + getDataUnit(item.logSize)
                                                    }
                                                    </div>
                                                    {
                                                        addDelete(item)
                                                    }
                                                    </div>
                                                </td>
                                                <td>{item.email === email ? <RemoveIcon className='removeIcon' onClick={() => handleDeleteService(item)} /> : '-'}</td>
                                            </tr>
                                            {item.email === email ? <tr style={selectLine === item.id ? {display: ''} : {display: 'none'}}>
                                                <td colSpan="5">
                                                    <div className='detail'>
                                                        <div className='service'>
                                                            {isAddUser ?
                                                                <>
                                                                    <p>사용자 추가</p>
                                                                    <div className='dataArea'>
                                                                        <input placeholder='E-mail을 입력해주세요.' value={addingEmail} onChange={(e) => setAddingEmail(e.target.value)} onKeyDown={e => e.keyCode == 13 ? handleAddPermission(item, e) : ''} autoFocus />
                                                                        <button onClick={() => handleAddPermission(item)}>추가</button>
                                                                    </div>
                                                                </>
                                                                : 
                                                                <>
                                                                    <div className='dataArea'>
                                                                        <span className='title'>서비스명</span>
                                                                        <span className='data'>{item.name}</span>
                                                                    </div>
                                                                    <div className='dataArea'>
                                                                        <span className='title'>서비스키</span>
                                                                        {keyView ? 
                                                                            <span className='data'>
                                                                                <span>{item.pks}</span>
                                                                                <CopyIcon className='copyIcon' onClick={() => handleCopyClipBoard(item.pks)} />
                                                                            </span> 
                                                                            : <button onClick={() => setKeyView(true)}>확인</button>}
                                                                    </div>
                                                                    <div className='dataArea'>
                                                                        <span className='title'>API URL</span>
                                                                            <span className='data'>{decodeURIComponent( item.serverUrl )}
                                                                                <CopyIcon className='copyIcon' onClick={() => handleCopyClipBoard(decodeURIComponent( item.serverUrl ))} />
                                                                            </span>
                                                                    </div>
                                                                    <div className='dataArea'>
                                                                        <span className='title'>QR Code</span>
                                                                        <span className='data'>
                                                                            <QRCode
                                                                                size={256}
                                                                                style={{height: 'auto', width: '50%'}}
                                                                                bgColor={'#FFFFFF'}
                                                                                fgColor={'#000000'}
                                                                                value={ item.qr }
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </>}
                                                        </div>
                                                        <div className='permission'>
                                                            <p>조회권한</p>
                                                            <table className='permissionTable'>
                                                                <thead>
                                                                    <tr>
                                                                        <th>E-mail</th>
                                                                        <th>이름</th>
                                                                        <th>삭제</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {permissionList.map((item2, index) => {
                                                                        return(
                                                                            <tr key={index}>
                                                                                <td>{item2.userEmail}</td>
                                                                                <td>{item2.userName}</td>
                                                                                <td><RemoveIcon className='removeIcon' onClick={() => handleDeletePermission(item2.shareId, item.id)} /></td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </tbody>                                            
                                                            </table>
                                                                            <span style={{color: '#6284C8', cursor: 'pointer'}} onClick={()=> setIsAddUser(!isAddUser)}>{isAddUser ? '사용자 추가 취소' : '+ 사용자 추가'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr> : null}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                        {statusCode === '0' ?
                            <div className="addServiceFrame">
                                <div className='addService' onClick={() => setIsModalOpen(true)} >+ 서비스 추가</div>
                            </div> : null
                        }
                    </div>
                   
                </DataForm>
            </div>
            {isModalOpen ? <AddServiceModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setNum={setNum} /> : null}
        </Layout>
    );
};

export default Management;