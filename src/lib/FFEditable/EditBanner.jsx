import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { ContextStore } from '../Context';

const EditBanner = ({children, id, index, setCurrentTitle, setCurrentId, item, config}) => {
    let divStyle = {outline: '4px dotted red'};
    const {iex, customConfig, setCustomConfig} = useContext(ContextStore)
    return (
        <div key={`${id}-banner-${index}`} style={divStyle}>
            <div className='hideOnPrint' style={{position: 'relative', left: 0, top: 0, backgroundColor: '#cccccc', color: 'white', height: 30, display: 'flex', alignContent: 'flex-end'}}>
            <div><Button onClick={()=>{
                setCurrentTitle(config.title);
                setCurrentId(item.id);
            }}>{config.title}</Button></div>
            <div><Button onClick={()=>{
                console.log('hiding...', customConfig[id])
                let _customConfig={...customConfig}
                _customConfig[id][item.id].hidden=true;
                setCustomConfig(_customConfig);
            }}>Hide</Button></div>
            </div>
            {children} 
        </div>
    );
}

export default EditBanner;