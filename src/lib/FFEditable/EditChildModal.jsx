import { Button, Modal, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { ContextStore } from '../Context';
// import postRobot from 'post-robot';

export const EditChildModal = (props) => {
    const {iex, customConfig, updateCustomConfig} = useContext(ContextStore)
    const { isOpen, close, configurator, id, item } = props;
    const [newConfiguration, setNewConfiguration] = useState(customConfig[id][item.id]||{});
    const newConfigurator=
        React.cloneElement(
            configurator, 
        {
            ...configurator.props, 
            configuration: newConfiguration,
            onChangeConfiguration: (newConfig) => {
                console.log('gotten new config', newConfig);
                setNewConfiguration(newConfig);
            }
        });
    const closeConfiguration = () => {
        const _customConfig={...customConfig}
        _customConfig[id][item.id] = newConfiguration;
        updateCustomConfig(_customConfig);
        close();
    }
    return (
        <Modal style={{
            top: '20%',
            left: '20%',
            width: '30%',
            transform: 'translate(-50%, -50%) !important',
        }} open={isOpen}>
            <div style={{backgroundColor: 'white', padding: 5}}>
                <div>
                    {newConfigurator}
                </div>
                <div>
                    <Button onClick={closeConfiguration}>OK</Button>
                </div>
            </div>
        </Modal>
    );
}