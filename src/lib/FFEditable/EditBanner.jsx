import { Button } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { ContextStore } from '../Context';
import { EditChildModal } from './EditChildModal';

export const EditBanner = ({children, id, index, item, configurator}) => {
    let divStyle = {outline: '4px dotted red'};
    const {iex, customConfig, updateCustomConfig} = useContext(ContextStore)
    const [isOpen, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
        <div key={`${id}-banner-${index}`} style={divStyle}>
            <div className='hideOnPrint' style={{position: 'relative', left: 0, top: 0, backgroundColor: '#cccccc', color: 'white', height: 30, display: 'flex', alignContent: 'flex-end'}}>
                {configurator &&
                    <React.Fragment>
                        <div><Button onClick={setOpen}>Edit</Button></div>
                        <EditChildModal id={id} item={item} isOpen={isOpen} close={close} configurator={configurator}/>
                    </React.Fragment>
                }
                <div><Button onClick={()=>{
                    let _customConfig={...customConfig}
                    _customConfig[id][item.id].hidden=true;
                    updateCustomConfig(_customConfig);
                }}>Hide</Button></div>
            </div>
            {children} 
        </div>
    );
}