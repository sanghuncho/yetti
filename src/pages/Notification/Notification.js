import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import routes from '../../libs/routes';
import { alertMessage, iconLevel, errorMsg } from '../../utils/message';
import { checkLogin } from '../../utils/isLogin';
import { useForm, useFieldArray, Controller} from 'react-hook-form';
import { getServiceList } from '../../api/serviceApi';


import {notiList, notiInfo, notiDelete, notiModify} from '../../api/notificationAPI';
import ChannelModal from '../../components/Modal/ChannelModal';

// Components
import Category from '../../components/Category/Category';
import Navbar from '../../components/Navbar/Navbar';
import Layout from '../../layout/MainLayout/MainLayout';
import DataForm from '../../components/DataForm/DataForm';
import Title from '../../components/Title/Title';
import NotificationRegister from './NotificationRegister';

// Styles
import '../../styles/Notification.scss';
import '../../styles/sweetalert2.scss';
import { endLoading, startLoading } from '../../redux/actions/loading';


// Images & Icons
import { ReactComponent as Edit2Icon } from '../../assets/icons/ic_edit2.svg';
import { ReactComponent as NotificationIcon } from '../../assets/icons/ic_notification.svg';

const Notification = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [notificationList, setNotificationList] = useState([]);
    const [myServiceList, setMyServiceList] = useState([]);
    const [edited, setEdited] = useState(false);
    const [editedIndex, setEditedIndex] = useState(0);
    const [isRegister, setIsRegister] = useState(false);
    
    const {register, handleSubmit, setError, control, reset} = useForm({
        defaultValues: {
            // channelList: [{ channelType: "email", channel: "" }] // 이런 모습
            channelList : []
          }
    });
    let { fields, append, remove } = useFieldArray({
        control,
        name : "channelList", /* required */
    });
    const [isOpen, setIsOpen] = useState(false);
    const [channelList, setChannelList] = useState([]);
    const MAX_CHANNELLIST = 4;

    const showChannelList = (index, e) => {
        if (index >= channelList.length)
            setChannelList([...channelList, e.target.value]);
        else
            channelList[index] = e.target.value;
    }

    /** 서비스 리스트 가져오기 */
    const getMyServiceList=()=>{
        getServiceList().then((result) => {

            // code -1010 : 로그인 세션 만료 / 로그인 상태 X
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
            setMyServiceList(result.data);
        }).catch(error => {
            console.log(error);
            errorMsg(`${error?.message}`);
            // dispatch(endLoading());
            return;
        });

    };

    /** 알림 리스트 가져오기 */
    const getNotiList = () => {
        notiList().then((result)=>{
            if(result.code !== 0){
                console.log(result.message);
                return;
            }
            setNotificationList(result.data);
        }).catch(error => {
            console.log(error);
            errorMsg(`${error?.message}`);
            // dispatch(endLoading());
            return;
        });
    };

    /** 알림 화면 */
    useEffect(()=>{
        dispatch(startLoading());

        getMyServiceList();
        getNotiList();

        dispatch(endLoading());
    }, [dispatch, navigate]);

    /** 알림 등록 클릭 이벤트 */
    const handleNotiRegister = (data) =>{
        let channel = {};
        let email = [];
        let sms = [];

        /** 알림 탐지주기를 선택하지 않은 경우 */
        if (data.interval === null) {
            alertMessage(iconLevel.WARNING, "알림 탐지주기를 확인해 주세요.");
            return;
        }
        /** 알림 종류를 선택하지 않은 경우 */
        if (data.crashType === false) {
            alertMessage(iconLevel.WARNING, "알림 종류를 확인해 주세요.");
            return;
        }
        /** 알림 채널을 입력하지 않은 경우 */
        if(data.channelList.length === 0){
            alertMessage(iconLevel.WARNING, "알림 채널을 입력해 주세요.");
            return;
        }

        for (const item of data.channelList){
            switch(item.channelType){
                case "sms":
                    sms.push(item.channel);
                    break;
                case "email":
                    email.push(item.channel);
                    break;
                default:
            }
        }

        channel.email = email;
        channel.sms = sms;

        let crashType = {};
        for(const item of data.crashType){
            crashType[item] = true;
        }

        let newNoti = {};
        newNoti.name = data.name;
        newNoti.sid = data.sid;
        newNoti.count = parseInt(data.count); /*number */
        newNoti.interval = parseInt(data.interval); /*number */
        newNoti.crashType = crashType;
        newNoti.usermessage = data.usermessage;
        newNoti.channel = channel;

        try{
            notiInfo(newNoti).then((result)=>{
                if(!checkLogin(dispatch, result.code)){
                    navigate(routes.login);
                    return;
                }
                // code 0 이 아님 : API 요청 실패
            if(result.code !== 0) {
                errorMsg(result.message);
                return;
            }
            alertMessage(iconLevel.SUCCESS, "등록되었습니다.");

            //리스트 다시 가져오기
            getNotiList();
            setIsRegister(false);
            reset({"channelList":[]});

            })
        }catch(error){
            console.log(error);
        }
    };

    /** 알림 수정 시 상태 변경 */
    const handleEditBtn = (data) => {
        if (!edited) {
            setEditedIndex(data.target.value);
        } else {
            reset({"channelList":[]})
            setChannelList([]);
        }
        setEdited((prev) => !prev);
    };

    /** 알림 수정 시 채널 설정*/
    const modifyChannelList = () => {
        /** 처음 한 번만 수행한다. */
        let channel = [];
        notificationList.map((item) => {
            if (item.nid === editedIndex) {
                item.channel.sms?.map((item2) => {
                    append({ channelType: "sms", channel: item2 });
                    channel.push(item2);
                })
                item.channel.email?.map((item2) => {
                    append({ channelType: "email", channel: item2 });
                    channel.push(item2);
                })
                setChannelList([...channelList, ...channel]);
            }
        })
    }

    /** 알림 수정 */
    const handleNotiEdit = (data) => {

        let channel = {};
        let email = [];
        let sms = [];

        if(channelList.length === 0 && data.channelList.length === 0){
            modifyChannelList();
            return;
        }

        if(!edited || data.channelList.length === 0) return;

        /** 알림 탐지주기를 선택하지 않은 경우 */
        if (data.interval === null) {
            alertMessage(iconLevel.WARNING, "알림 탐지주기를 확인해 주세요.");
            return;
        }
        /** 알림 종류를 선택하지 않은 경우 */
        if (data.crashType === false) {
            alertMessage(iconLevel.WARNING, "알림 종류를 확인해 주세요.");
            return;
        }
        /** 알림 활성화를 선택하지 않은 경우 */
        if (data.active === null) {
            alertMessage(iconLevel.WARNING, "알림 활성화를 확인해 주세요.");
            return;
        }
        for(const item of data.channelList){
            switch(item.channelType){
                case "sms":
                    sms.push(item.channel);
                    break;
                case "email":
                    email.push(item.channel);
                    break;
                default:
            }
        }

        channel.email = email;
        channel.sms = sms;

        let crashType = {};
        for(const item of data.crashType){
            crashType[item] = true;
        }

        let modifiedNoti = {};
        modifiedNoti.nid = editedIndex;
        modifiedNoti.sid = data.sid;
        modifiedNoti.interval = parseInt(data.interval); /*number */
        modifiedNoti.count = parseInt(data.count); /*number */
        modifiedNoti.crashType = crashType;
        modifiedNoti.usermessage = data.usermessage;
        modifiedNoti.name = data.name;
        modifiedNoti.channel = channel;
        modifiedNoti.active = data.active;

        setChannelList([]);
        notiModify(modifiedNoti).then((result) => {
            // code -1010 : 로그인 세션 만료 / 로그인 상태 X
            if(!checkLogin(dispatch, result.code)){
                navigate(routes.login);
                return;
            }

            // code 0 이 아님 : API 요청 실패
            if (result.code !== 0) {
                errorMsg(result.message);
                return;
            }

            alertMessage(iconLevel.SUCCESS, "수정되었습니다.");
            setEdited(false);
            setEditedIndex(0);

            getNotiList();
            reset({"channelList":[]})
        });
    };


    /** 알림 삭제 클릭 이벤트 */
    const handelNotiDelete = (data) => {
        const notiId = data.target.value;
        notiDelete(notiId).then((result)=>{
        // code -1010 : 로그인 세션 만료 / 로그인 상태 X
        if(!checkLogin(dispatch, result.code)){
            navigate(routes.login);
            return;
        }

        // code 0 이 아님 : API 요청 실패
        if(result.code !== 0) {
            errorMsg(result.message);
            return;
        }

        alertMessage(iconLevel.SUCCESS, "삭제되었습니다.");

        let newNotiList = notificationList.filter((element) => parseInt(element['nid']) !== parseInt(notiId));
        setNotificationList(newNotiList);
        });
    };

    const handleOpenRegister = () => {
        setIsRegister(true);
    }

    return (
        <Layout>
            <div className='notification'>    
                <Navbar/>
                <Category text="알림" />
                <DataForm>  
                   <div className="alrmTitl">
                       <p>오류 알람을 설정하실 수 있습니다.</p><button className="alrmSbmtBtn" onClick={handleOpenRegister}><NotificationIcon className='icon' />알림등록</button>
                    </div>
                <div className="registerNotification">
                    {!isRegister ? null :
                        <div className="setupAlm almList">
                            <NotificationRegister handleNotiRegister={handleNotiRegister} myServiceList={myServiceList}> </NotificationRegister>
                        </div>
                    }
                    {notificationList.length === 0 ?
                        <div className="almList nspnAlm">
                            <p>등록된 알림이 없습니다.</p>
                        </div>
                        :
                        <>
                        {notificationList.map((item) => {
                            return (
                                <form onSubmit={handleSubmit(handleNotiEdit)} key={item.nid} >
                                <div className="almList">
                                {
                                    edited && (parseInt(item.nid) === parseInt(editedIndex)) ?
                                    <ul className="almL">
                                    <li>
                                    <dl>
                                        <dt>알림이름 </dt>
                                        <input type="text" {...register("name")} defaultValue={item.name} />
                                    </dl>
                                    </li>
                                    </ul>
                                    :
                                    <h3>{item.name}</h3>
                                }
                                <ul className="almL">
                                    <li>
                                        <dl>
                                            <dt>서비스</dt>{
                                            edited && (parseInt(item.nid) === parseInt(editedIndex)) ?
                                            (<>
                                                <input type='hidden' {...register("sid")} defaultValue={item.sid} />
                                                <dd>{item.serviceName}</dd>
                                            </>)
                                            : item.serviceName
                                            }
                                        </dl>
                                    </li>
                                    <li>
                                        <dl>
                                            <dt>탐지주기</dt>
                                             <dd>{
                                                edited && (parseInt(item.nid) === parseInt(editedIndex)) ?
                                                <div className="intRadio2">
                                                    <input type="radio" id="dtctCyc011" value={10} {...register("interval")} /><label htmlFor="dtctCyc011">10분</label>
                                                    <input type="radio" id="dtctCyc022" value={60} {...register("interval")} /><label htmlFor="dtctCyc022">60분</label>
                                                    <input type="radio" id="dtctCyc033" value={180}{...register("interval")} /><label htmlFor="dtctCyc033">180분</label>
                                                </div>
                                                :
                                                item.interval + "분"
                                            }</dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl>
                                            <dt>오류횟수</dt>
                                           <dd> {
                                                    edited && (parseInt(item.nid) === parseInt(editedIndex))
                                                    ?
                                                    <input type="text" id="count" placeholder="ex) 10" {...register("count")} defaultValue={item.count}/>
                                                    :
                                                    item.count
                                                }
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl>
                                            <dt>종류</dt>
                                             <dd>{
                                                edited && (parseInt(item.nid) === parseInt(editedIndex))
                                                ?
                                                <div className="intRadio2">
                                                    <input type="checkbox" id="crashType011" value={'crash'}{...register("crashType")} /><label htmlFor="crashType011">crash</label>
                                                    <input type="checkbox" id="crashType022" value={'nelog'}{...register("crashType")} /><label htmlFor="crashType022">log</label>
                                                    <input type="checkbox" id="crashType033" value={'fatal'}{...register("crashType")} /><label htmlFor="crashType033">fatal</label>
                                                </div>
                                                :
                                                <div>
                                                    {item.crashType.crash === true && <span className="errtyp3">Crash</span>}
                                                    {item.crashType.fatal === true && <span className="errtyp3">Fatal</span>}
                                                    {item.crashType.nelog === true && <span className="errtyp3">Nelog</span>}
                                                </div>
                                            }
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl>
                                            <dt>수신채널
                                                {edited && (parseInt(item.nid) === parseInt(editedIndex)) &&
                                                    <div className="chanlAddBtn" onClick={() => {setIsOpen(!isOpen)}}>
                                                        <Edit2Icon className='icon' />
                                                        수정
                                                    </div>
                                                }
                                                </dt>
                                            <dd>
                                                {(parseInt(item.nid) !== parseInt(editedIndex)) &&
                                                    item.channel.sms !== null && item.channel.sms !== undefined ?
                                                    item.channel.sms.map((item2, index2) => {
                                                        return (
                                                            <span className="errtyp2" key={index2}>{item2}</span>
                                                        )
                                                    })
                                                    : null
                                                }
                                                {(parseInt(item.nid) !== parseInt(editedIndex)) &&
                                                    item.channel.email !== null && item.channel.email !== undefined ?
                                                    item.channel.email.map((item2, index2) => {
                                                        return (
                                                            <span className="errtyp2" key={index2}>{item2} </span>
                                                        );
                                                    })
                                                    : null
                                                }

                                                {edited && (parseInt(item.nid) === parseInt(editedIndex)) && channelList?.map((item, index) => {
                                                    return (<span className="errtyp2" key={index}>{item}</span>)
                                                })}
                                                {(parseInt(item.nid) === parseInt(editedIndex)) && channelList.length == 0 && item.channel.sms?.map((item2, index2) => {
                                                    return (<span className="errtyp2" key={index2}>{item2}</span>)
                                                })}
                                                {(parseInt(item.nid) === parseInt(editedIndex)) && channelList.length == 0 && item.channel.email?.map((item2, index2) => {
                                                    return (<span className="errtyp2" key={index2}>{item2}</span>)
                                                })}
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl>
                                            <dt>알림메시지 </dt>
                                              <dd>
                                             {
                                                edited && (parseInt(item.nid) === parseInt(editedIndex)) ?
                                                <input type="text" placeholder="ex) 10분동안 10개의 오류가 발생했습니다." defaultValue={item.usermessage} {...register("usermessage")}/>
                             
                                            : <div className="ddDiv">{item.usermessage}</div>
                                            }                                              
                                           </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl>
                                            <dt>활성화</dt>
                                            <dd>
                                            {
                                                edited && (parseInt(item.nid) === parseInt(editedIndex)) ?
                                                <div className="intRadio3">
                                                    <input type="radio" id="notiOn" value={true}{...register("active")}/><label htmlFor="notiOn">on</label>
                                                    <input type="radio" id="notiOff" value={false}{...register("active")}/><label htmlFor="notiOff">off</label>
                                                </div>
                                                :
                                                (item.active ? <span className="activeOn">on</span> : <span className="activeOff">off</span>)
                                            }
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
                            <div className="btnWrap">
                                {
                                    edited && editedIndex === item.nid ?
                                    <button className="errDelBtn" type="button" onClick={handleEditBtn} >취소</button>
                                    :
                                    <button className="errDelBtn" type="button" onClick={handelNotiDelete} value={item.nid}>삭제</button>
                                }
                                {
                                    edited && editedIndex !== 0 && editedIndex === item.nid?
                                    <button className="errEditBtn" type="submit" >저장</button>
                                    :
                                    <button className="errEditBtn" type="button" onClick={handleEditBtn} value={item.nid}>수정</button>
                                }
                            </div>
                        </div>
                        </form>
                        )
                        })}
                        </>
                        }
                    </div>
                    {isOpen && (
                    <ChannelModal isOpen={isOpen} setIsOpen={setIsOpen}>
                        <button type="button" className="chanlModalAddBtn" onClick={() => {fields.length <= MAX_CHANNELLIST && append({ channelType: "email", channel: "example@gmail.com" }) }}>+ 채널 추가</button>
                        <div className="chclListWrap">
                        {
                        fields?.map((item, index) => {
                            return (
                                <div key={item.id} className="chnlModal">
                                <select {...register(`channelList.${index}.channelType`, { required: true })}>
                                    <option value="email">e-mail</option>
                                    <option value="sms" disabled>sms</option>
                                </select>

                                <Controller render={({ field }) =>
                                    <input {...field} type="text" className="errType" onBlur={(e) => showChannelList(index, e)}/>}
                                    name={`channelList.${index}.channel`}
                                    control={control}
                                />

                                <button type="button" className="chnlMdDlcBtn" onClick={() => remove(index)}> 삭제 </button>
                                </div>
                            )
                        })
                        }
                    </div>
                        <button type="submit" className="chnlMdSbmBtn" onClick={() => { setIsOpen(!isOpen) }}> 확인 </button>
                       <div className="modalBgBk"></div>
                    </ChannelModal> 
                    )}
                </DataForm>
            </div>
        </Layout>
    );

};

export default Notification;
