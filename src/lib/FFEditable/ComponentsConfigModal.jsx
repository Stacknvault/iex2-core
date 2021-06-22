import { Button, Checkbox, FormControlLabel, Modal, TextField } from '@material-ui/core';
import React, { useContext } from 'react';
import { ContextStore } from '../Context';

export const ComponentsConfigModal = ({id, children, showToolbar, setShowToolbar}) => {
    const {customConfig, updateCustomConfig} = useContext(ContextStore)
    const sectionConfig=customConfig[id];
    return (
        <Modal style={{
            top: '0%',
            left: '20%',
            width: '60%',
            transform: 'translate(-50%, -50%) !important',
            }} open={showToolbar}>
            <div style={{backgroundColor: '#eeeeee'}}>
                <div><h2>Sections</h2></div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{padding: 10, width: '50%'}}>
                        <div style={{maxHeight: 500, overflow: 'scroll'}}>
                            <div style={{margin: 5}}>{children}</div>
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', maxHeight: 500, overflow: 'scroll', width: '100%'}}>
                        {sectionConfig && Object.keys(sectionConfig).filter(key=>Object.keys(sectionConfig[key]).length>3/* it means it has more custom config*/).map((key)=>{
                            const sectionConfigKey=sectionConfig[key];
                            return (
                                <div key={`cfg-${key}`} style={{display: 'flex', flexDirection: 'column', backgroundColor: '#eeeeee', width: '100%'}}>
                                    <h3>{key}</h3>
                                    {
                                        Object.keys(sectionConfigKey).filter(subkey=>!['index', 'title', 'hidden'].includes(subkey)).map((subkey)=>{
                                            return (
                                                <div key={`cfg-${key}-${subkey}`} style={{marginLeft: 30, width: '100%'}}>
                                                    {sectionConfigKey[subkey] && typeof sectionConfigKey[subkey] === 'string' && 
                                                    <div style={{marginLeft: 30, width: '100%'}}>
                                                        <FormControlLabel style={{width: '100%'}}
                                                            control={<TextField fullWidth={true} value={sectionConfigKey[subkey]} onChange={(e)=>{
                                                                let _customConfig={...customConfig};
                                                                _customConfig[id][key][subkey]=e.target.value;
                                                                updateCustomConfig(_customConfig);
                                                            }}/>}
                                                            label={subkey}
                                                            />
                                                    </div>
                                                    }
                                                    {sectionConfigKey[subkey] && typeof sectionConfigKey[subkey] === 'number' && 
                                                    <div style={{marginLeft: 30, width: '100%'}}>
                                                        <FormControlLabel style={{width: '100%'}}
                                                            control={<TextField fullWidth={true} value={sectionConfigKey[subkey]} onChange={(e)=>{
                                                                try{
                                                                    let n=Number(e.target.value);
                                                                    if (typeof n === 'number' && ''+n !== 'NaN'){
                                                                        let _customConfig={...customConfig};
                                                                        _customConfig[id][key][subkey]=n;
                                                                        updateCustomConfig(_customConfig);
                                                                    }
                                                                }catch(e){}
                                                            }}/>}
                                                            label={subkey}
                                                        />
                                                    </div>
                                                    }
                                                    {(sectionConfigKey[subkey]||sectionConfigKey[subkey]===false) && typeof sectionConfigKey[subkey] === 'boolean' && 
                                                    <div style={{marginLeft: 30, width: '100%'}}>
                                                        <FormControlLabel style={{width: '100%'}}
                                                            control={<Checkbox
                                                                title={subkey}
                                                                checked={sectionConfigKey[subkey]} 
                                                                onChange={(e, value)=>{
                                                                    let _customConfig={...customConfig};
                                                                    _customConfig[id][key][subkey]=value;
                                                                    updateCustomConfig(_customConfig);
                                                                }}/>}
                                                                label={subkey}
                                                        />
                                                    </div>
                                                    }
                                                </div>
                                                
                                            );
                                        })
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={{width: '100%'}}><div ><Button onClick={()=>{
                        setShowToolbar(false);
                    }}>Close</Button></div>
                </div>
            </div>
        </Modal>
    );
}