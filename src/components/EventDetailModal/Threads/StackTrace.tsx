import React from "react";

type FrameInfo = {
    "number": string;
    module?: string;
    address?: string;
    "function"?: string;
    location?: string;
}

type StackTraceProps = {
    osName: string;
    data: FrameInfo[];
};

import './StackTrace.scss'

import { ReactComponent as IconModuleUser} from '../../../assets/icons/ic_module_user.svg'
import { ReactComponent as IconModuleDYLIB} from '../../../assets/icons/ic_module_dylib.svg'
import { ReactComponent as IconModuleFramework} from '../../../assets/icons/ic_module_framework.svg'
import { ReactComponent as IconModuleCore} from '../../../assets/icons/ic_module_core.svg'
import { ReactComponent as IconModuleAndroid} from '../../../assets/icons/ic_module_android.svg'
import { ReactComponent as IconModuleJava} from '../../../assets/icons/ic_module_bean.svg'

function defaultStackTrace(data: FrameInfo[]) {
    return (
        <table>
            <thead>
                <tr className="legacy-stack-trace">
                    <th>
                        <div className="th-text">&nbsp; </div>
                    </th>
                    <th>
                        <div className="th-text">함수</div>
                    </th>
                    <th>
                        <div className="th-text">모듈</div>
                    </th>
                    <th>
                        <div className="th-text">위치</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.number}</td>
                                <td>{item.function}</td>
                                <td>{item.module}</td>
                                <td>{item.location}</td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}

function ParsedFrameTitle({osName}) {
    if (osName == 'iOS') {
        return (
            <li className="title">
                <div className="frameIcon"></div>
                <div className="frameNumber">#</div>
                <div className="frameModule">모듈</div>
                <div className="frameContents">내용</div>
            </li>
        )
    }

    if (osName == 'Android') {
        return (
            <li className="title">
                <div className="frameIcon"></div>
                <div className="frameNumber">#</div>
                <div className="frameContents">내용</div>
                </li>
        )
    }

    return (<div>need to be parsed</div>);
}

function IconModule({moduleName}) {

    if (moduleName === 'dylib') {
        return (
            <IconModuleDYLIB></IconModuleDYLIB>
        )
    }
    if (moduleName === 'core') {
        return (
            <IconModuleCore/>
        )
    }

    if (moduleName === 'framework') {
        return (
            <IconModuleFramework/>
        )
    }

    if (moduleName === 'java') {
        return (
            <IconModuleJava/>
        )
    }

    if (moduleName === 'android') {
        return (
            <IconModuleAndroid/>
        )
    }

    return (
        <IconModuleUser/>
    )
}
function ParsedFrame({osName, fi}) {
    if (osName == 'iOS') {
        const table = {
            "core": [
                'CoreFoundation'
            ],
            "framework": [
                'UIKitCore'
            ],
            "dylib": [
                'libobjc.A.dylib',
                'libswiftUIKit.dylib'
            ]
        }
        
        let icon = 'userModule';

        for (let m in table) {
            if (table[m].indexOf(fi.module) != -1) {
                icon = m;
                break;
            }
        }

        return (
            <li className={icon}>
                <div className="frameIcon"><div className="iconContainer"><IconModule moduleName={icon}></IconModule></div></div>
                <div className="frameNumber">{fi.number}</div>
                <div className="frameModule">{fi.module}</div>
                <div className="frameContents">{fi.function} + {fi.location}</div>
            </li>
        )
    }

    if (osName == 'Android') {
        const table = {
            "android": [
                'android.',
                'androidx.'
            ],
            "java": [
                'java.',
                'javax.'
            ],
            "framework": [
                'UIKitCore'
            ]
        }
        
        let icon = 'userModule';

        for (let m in table) {
            table[m].forEach(el=> {
                if (fi.module.startsWith(el)) {
                    icon = m;
                    return false;
                }
            });
        }
        return (
            <li className={icon}>
                <div className="frameIcon"><div className="iconContainer"><IconModule moduleName={icon}></IconModule></div></div>
                <div className="frameNumber">{fi.number}</div>
                <div className="frameContents">{fi.module}.{fi.function} (:{fi.location})</div>
            </li>
        )
    }

    return (<></>);
}

const StackTrace: React.FC<StackTraceProps> = ({ osName, data }) => {
    switch (osName) {
        case 'iOS':
        case 'Android':
            break;
        default:
            // 기존 형식
            return defaultStackTrace(data);
    }

    // new view
    const frames = data.map((item, index) => 
        <ParsedFrame osName={osName} key={index} fi={item}></ParsedFrame>
    );
    
    return (
        <div className="stackFrameRoot">
            <ul className="stackFrame title"><ParsedFrameTitle osName={osName}></ParsedFrameTitle></ul>
            <ul className="stackFrame">{frames}</ul>
        </div>
    );
}

export default StackTrace;