import { Button, Modal, TextField } from '@material-ui/core';
import React, { useContext } from 'react';
import { ContextStore } from '../Context';

const EditChildModal = ({id, currentId, setCurrentId, currentTitle, setCurrentTitle}) => {
    const {iex, customConfig, setCustomConfig} = useContext(ContextStore)
    return (
        <Modal style={{
            top: '20%',
            left: '20%',
            width: '30%',
            transform: 'translate(-50%, -50%) !important',
        }} open={currentId!=null}>
            <div style={{backgroundColor: 'white', padding: 5}}>
                <div style={{maxHeight: 700, overflow: 'scroll'}}>
                    <div><h2>Edit title</h2></div>
                    <div style={{margin: 5}}>
                    <TextField fullWidth={true} value={currentTitle} onChange={(e)=>{
                        setCurrentTitle(e.target.value);
                    }}/>
                    </div>
                </div>
                <div style={{width: '100%'}}><div ><Button onClick={()=>{
                    setCurrentId(null);
                    }}>Cancel</Button>
                    <Button onClick={()=>{
                    let _customConfig={...customConfig};
                    _customConfig[id][currentId].title=currentTitle;
                    setCustomConfig(_customConfig);
                    setCurrentId(null);
                    }}>OK</Button></div></div>
            </div>
        </Modal>
    );
}

export default EditChildModal;