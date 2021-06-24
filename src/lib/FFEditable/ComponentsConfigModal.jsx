import { Button, Checkbox, FormControlLabel, Modal, TextField } from '@material-ui/core';
import React, { useContext } from 'react';
import { ContextStore } from '../Context';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    () => ({
        root: {
            backgroundColor: '#eeeeee',
            top: '50%',
            left: '50%',
            display: 'flex',
            outline: 'unset',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            background: '#FFFFFF',
            flexDirection: 'column',
            margin: 20,
            padding: 10,
        },
        rowDiv: {
            display: 'flex',
            flexDirection: 'row',
        },
        dragContainer: {
            padding: 10,
            width: '100%',
        },
        dragItemContainer: {
            maxHeight: 500,
            overflow: 'scroll',
        },
        dragItemContainerInner: {
            margin: 5,
        }
        
    }),
{ name: 'ComponentsConfigModal' }
);
export const ComponentsConfigModal = ({id, children, showToolbar, setShowToolbar}) => {
    const {customConfig, updateCustomConfig} = useContext(ContextStore)
    const sectionConfig=customConfig[id];
    const classes = useStyles();
    return (
        <Modal open={showToolbar}>
            <div className={classes.root}>
                <div><h2>Sections</h2><h5>Please select the sections that you want displayed and drag and drop them to the desired order</h5></div>
                <div className={classes.rowDiv}>
                    <div className={classes.dragContainer}>
                        <div className={classes.dragItemContainer}>
                            <div className={classes.dragItemContainerInner}>{children}</div>
                        </div>
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