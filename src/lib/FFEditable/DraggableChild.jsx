import { Checkbox } from '@material-ui/core';
import React, { useContext, useRef } from 'react';
import Draggable from 'react-draggable';
import { ContextStore } from '../Context';

const DraggableChild = ({id, newChildrenTree, moveElement, index, item, dragIndex, setDragIndex}) => {
    const {customConfig, setCustomConfig} = useContext(ContextStore)
    const ref=useRef(null)
    return (
        <Draggable 
            ref={ref}
            axis='y' 
            onStop={(e, node)=>{
                const positions=Math.round(node.lastY/29)
                moveElement(newChildrenTree, index, positions);
            }}
            onStart={()=>{
                setDragIndex(index);
            }}
            disabled={false}
            position={{x: 0, y: 0}}>
            <div style={{margin: 4, cursor: 'move', height: 25, border: '1px solid #cccccc', fontFamily: 'Roboto Condensed', backgroundColor: dragIndex === index ? '#ccccff': 'white'}}>
                <Checkbox 
                    checked={!item.config.hidden} 
                    onChange={(e, value)=>{
                        let _customConfig={...customConfig}
                        _customConfig[id][item.id].hidden=!value;
                        setCustomConfig(_customConfig);
                    }}/> {item.config.title}
            </div>
        </Draggable>
    );
}

export default DraggableChild;