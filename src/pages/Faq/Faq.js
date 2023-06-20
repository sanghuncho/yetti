import {useState} from 'react';

// Components
import Category from '../../components/Category/Category';
import Navbar from '../../components/Navbar/Navbar';
import Layout from '../../layout/MainLayout/MainLayout';

// Images & Icons
import { ReactComponent as QuestionIcon } from '../../assets/icons/ic_question.svg';
import { ReactComponent as DownIcon } from '../../assets/icons/ic_down.svg';
import { ReactComponent as UpIcon } from '../../assets/icons/ic_up.svg';

// Styles
import '../../styles/Faq.scss';
import '../../styles/sweetalert2.scss';

const Faq = () => {

    const [showAnswer, setShowAnswer] = useState([false,]);

    const handleQuestion = (index, isShow) => {
        showAnswer[index] = isShow;
        setShowAnswer([...showAnswer]);
    }

    return (
        <Layout>
            <div className='guide'>
                <Navbar/>
                <Category text="사용자 가이드" />

                <div className="faq">
                    <ul>
                        <li className="title">
                            <QuestionIcon className='icon'/>
                            자주 물어보는 질문 FAQ
                        </li>
                        <li className='question'>
                            { showAnswer[0] ? <button className='icon' onClick={() => {handleQuestion(0, false)}}><UpIcon/></button> : <button className='icon' onClick={() => {handleQuestion(0, true)}}><DownIcon/></button>}
                            계정당 몇 개의 프로젝트를 가질 수 있습니까?
                        </li>
                        { showAnswer[0] ? <li className="answer">임시 질문과 대답 내용입니다.</li> : null }
                        <li className='question'>
                            { showAnswer[1] ? <button className='icon' onClick={() => {handleQuestion(1, false)}}><UpIcon/></button> : <button className='icon' onClick={() => {handleQuestion(1, true)}}><DownIcon/></button>}
                            AppCatch admin 페이지에 접근하기 위해 지원되는 브라우저는 무엇인가요?
                        </li>
                        { showAnswer[1] ? <li className='answer'>AppCatch admin 페이지는 Chrome, FireFox, Safari 및 Edge와 같은 인기 있는 데스크톱 브라우저의 최신 버전에서 액세스할 수 있습니다. 모바일 브라우저는 현재 완전히 지원되지 않습니다.</li> : null}
                        <li className='question'>
                            { showAnswer[2] ? <button className='icon' onClick={() => {handleQuestion(2, false)}}><UpIcon/></button> : <button className='icon' onClick={() => {handleQuestion(2, true)}}><DownIcon/></button>}
                            프로젝트 구성원에게 소유자 역할과 같은 역할을 할당하려면 어떻게 해야 합니까?
                        </li>
                        { showAnswer[2] ? <li className='answer'>각 프로젝트 구성원에게 할당된 역할을 관리하려면 AppCatch 프로젝트의 소유자이거나 <span className='important'>resourcemanager.projects.setIamPolicy</span> 권한이 있는 역할을 할당받아야 합니다.<br/>역할을 할당하고 관리할 수 있는 위치는 다음과 같습니다.</li> : null }
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default Faq;