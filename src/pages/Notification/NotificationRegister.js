import React, { useState } from 'react';

import { Controller, useForm, useFieldArray } from 'react-hook-form';
import ChannelModal from '../../components/Modal/ChannelModal';

const NotificationRegister = ({ handleNotiRegister, myServiceList }) => {

    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            // channelList: [{ channelType: "email", channel: "example@gmail.com" }]
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name : "channelList", /* required */
    });

    const [channelList, setChannelList] = useState([]);
    const MAX_CHANNELLIST = 4;

    const showChannelList = (e) => {
        setChannelList([...channelList, e.target.value]);
    }

    const [isOpen, setIsOpen] = useState(false);

    return <div>
        <form onSubmit={handleSubmit(handleNotiRegister)}>
            <fieldset>
                <ul className="almSetInput">
                    <li>
                        <label>알림이름 </label>
                        <input type="text" placeholder="ex) 알림설정1" {...register("name", { required: true })} />
                    </li>
                    <li>
                        <label>서비스 </label>
                        <select {...register("sid", { required: true })}>
                            {myServiceList?.map((item) => {
                                return (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </li>
                    <li>
                        <label>탐지주기 </label>
                        <div className="intRadio">
                            <input type="radio" id="dtctCyc01" value={10} {...register("interval")} /><label htmlFor="dtctCyc01">10분 </label>
                            <input type="radio" id="dtctCyc02" value={60}{...register("interval")} /><label htmlFor="dtctCyc02">60분</label>
                            <input type="radio" id="dtctCyc03" value={180}{...register("interval")} /><label htmlFor="dtctCyc03">180분</label>
                        </div>
                    </li>
                    <li>
                        <label htmlFor="errCount">오류횟수 </label>
                        <input type="text" id="count" placeholder="ex) 10" {...register("count", { required: true })} />
                    </li>
                    <li>
                        <label>종류 </label>
                        <div className="intRadio">
                            <input type="checkbox" id="crashType01" value={'crash'} {...register("crashType")} /><label htmlFor="crashType01">crash</label>
                            <input type="checkbox" id="crashType02" value={'nelog'}{...register("crashType")} /><label htmlFor="crashType02">log</label>
                            <input type="checkbox" id="crashType03" value={'fatal'}{...register("crashType")} /><label htmlFor="crashType03">fatal</label>
                        </div>

                    </li>
                    <li>
                        <label htmlFor="errChannel">수신채널 </label>
                        <div className="chanlAddBtn" onClick={() => setIsOpen(!isOpen)}>+ 추가</div>
                    </li>
                    <li>
                        <label></label>
                        <div className="channelList">
                            {channelList?.map((item, index) => {
                                return (
                                    <span className="errtyp2" key={index}>{item}</span>
                                )
                            })}
                        </div>
                    </li>
                    <li>
                        <label>알림메시지 </label>
                        <input type="text" placeholder="ex) 10분동안 10개의 오류가 발생했습니다." {...register("usermessage")} />
                    </li>
                    <li>
                        <label>활성화 </label>
                        <p className="activeOn">on</p> <span className="notiOn">*기본설정은 On입니다.</span>
                    </li>
                </ul>
                <button type='submit' className="submitBtn">확인</button>
            </fieldset>
        </form>

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
                                    <input {...field} type="text" className="errType" onBlur={(e) => showChannelList(e)} />}
                                    name={`channelList.${index}.channel`}
                                    control={control}
                                />

                                <button type="button" className="chnlMdDlcBtn" onClick={() => remove(index)}> 삭제 </button>
                                </div>
                        )
                    })
                }          
                </div>
                <button type="submit" className="chnlMdSbmBtn" onClick={() => { setIsOpen(!isOpen)}}> 확인 </button>
            </ChannelModal>
        )}

    </div>



};

export default NotificationRegister;