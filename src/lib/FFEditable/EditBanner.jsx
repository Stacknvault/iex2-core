import { Button } from '@material-ui/core';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ContextStore } from '../Context';
import { EditChildModal } from './EditChildModal';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export const EditBanner = ({title, totalCount, children, id, index, item, configurator}) => {
    let divStyle = {outline: '4px dotted red'};
    const {iex, customConfig, updateCustomConfig} = useContext(ContextStore)
    const [isOpen, setOpen] = useState(false);
    const close = () => setOpen(false);

    const hidden = useMemo(() => {
        return customConfig[id] && customConfig[id][item.id] && customConfig[id][item.id].hidden
    }, [customConfig]);

    const initConfig = () => {
        let _customConfig={...customConfig}
        if (!_customConfig[id]) {
            _customConfig[id] = {};
        }
        if (!_customConfig[id][item.id]){
            _customConfig[id][item.id] = {};
        }
        return _customConfig;
    }
    const handleClickShowHide = useCallback(() => {
        let _customConfig = initConfig();
        _customConfig[id][item.id].hidden = !hidden;
        updateCustomConfig(_customConfig);
    }, [customConfig]);

    // const handleClickUp = useCallback(() => {
    //     let _customConfig = initConfig();
    //     if (!_customConfig[id][item.id].index){
    //         _customConfig[id][item.id] = {index};
    //     }
    //     const newIndex = _customConfig[id][item.id].index > 0 ? _customConfig[id][item.id].index - 1 : 0;
    //     console.log('newIndex', newIndex);
    //     _customConfig[id][item.id].index = newIndex;
    //     updateCustomConfig(_customConfig);
    // }, [customConfig]);

    // const handleClickDown = useCallback(() => {
    //     let _customConfig = initConfig();
    //     if (!_customConfig[id][item.id].index){
    //         _customConfig[id][item.id] = {index};
    //     }
    //     const newIndex = _customConfig[id][item.id].index < totalCount - 1 ? _customConfig[id][item.id].index + 1 : totalCount -1;
    //     console.log('newIndex', newIndex);
    //     _customConfig[id][item.id].index = newIndex;
    //     updateCustomConfig(_customConfig);
    // }, [customConfig]);

    return (
        <div key={`${id}-banner-${index}`} style={divStyle}>
            <div className='hideOnPrint' style={{position: 'relative', left: 0, top: 0, backgroundColor: '#cccccc', color: 'white', height: 30, display: 'flex', alignContent: 'flex-end'}}>
                <div>{title}</div>
                {configurator &&
                    <React.Fragment>
                        <div><Button onClick={setOpen}><SettingsIcon/></Button></div>
                        <EditChildModal id={id} item={item} isOpen={isOpen} close={close} configurator={configurator}/>
                    </React.Fragment>
                }
                <div><Button onClick={handleClickShowHide}>{hidden ? <VisibilityIcon/> : <VisibilityOffIcon/>}</Button></div>
                {/* <div><Button onClick={handleClickUp}>Up</Button></div>
                <div><Button onClick={handleClickDown}>Down</Button></div> */}
            </div>
            {!hidden && children}
        </div>
    );
}