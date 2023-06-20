import React, {useState, useEffect} from 'react';

type DataViewerProps = {
    data: string
};

const DataViewer:React.FC<DataViewerProps> = ({data}) => {
    const [decoded, setDecoded] = useState<string|null>(null);
    const [viewing, setViewing] = useState<string>(data);

    useEffect(() => {
        switch (decoded) {
            case 'uri':
                setViewing('DECODED:' + decodeURIComponent(data));
                break;
            default:
            case null:
                setViewing(data); break;
        }

    }, [decoded, data]);

    return (
    <div>
        <button onClick={() => setDecoded('uri')}>decodeURIComponent</button>
        <div>{viewing}</div>
    </div>
    );
};

export default DataViewer;