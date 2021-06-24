import { Checkbox } from '@material-ui/core';
import React, { useContext, useRef } from 'react';
import Draggable from 'react-draggable';
import { ContextStore } from '../Context';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        divStatic: {
            margin: 4, 
            cursor: 'move', 
            height: 40, 
            border: '1px solid #cccccc',
            fontFamily: 'Roboto Condensed', 
            backgroundColor: 'white' 
        },
        divDragging: {
            margin: 4, 
            cursor: 'move', 
            height: 40, 
            border: '1px solid #cccccc',
            fontFamily: 'Roboto Condensed', 
            backgroundColor: '#ccccff',
            zIndex: 1000,
        }
        
    }),
    { name: 'DraggableChild' }
);
export const DraggableChild = ({ id, newChildrenTree, moveElement, index, item, dragIndex, setDragIndex }) => {
    const { customConfig, updateCustomConfig } = useContext(ContextStore)
    const ref = useRef(null)
    const classes = useStyles();
    return (
        <Draggable
            ref={ref}
            axis='y'
            onStop={(e, node) => {
                const positions = Math.round(node.lastY / 49)
                moveElement(newChildrenTree, index, positions);
            }}
            onStart={() => {
                setDragIndex(index);
            }}
            disabled={false}
            position={{ x: 0, y: 0 }}>
            <div className={ dragIndex === index ? classes.divDragging : classes.divStatic } >
                <Checkbox
                    checked={!item.config.hidden}
                    onChange={(e, value) => {
                        let _customConfig = { ...customConfig }
                        _customConfig[id][item.id].hidden = !value;
                        updateCustomConfig(_customConfig);
                    }} /> {item.child.props.title}
            </div>
        </Draggable>
    );
}