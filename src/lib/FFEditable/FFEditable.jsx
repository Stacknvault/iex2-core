import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react'
import { ComponentsConfigModal } from './ComponentsConfigModal'
import { EditBanner } from './EditBanner';
import {ContextStore, getExternalConfig} from '../Context'
import { DraggableChild } from './DraggableChild';
import './FFeditable.scss'
const externalConfig = getExternalConfig();
const moveArray = (arr, pos1,pos2) => {
    // local variables
    var i, tmp;
    // cast input parameters to integers
    // if positions are different and inside array
    if (pos1 !== pos2 && 0 <= pos1 && pos1 <= arr.length && 0 <= pos2 && pos2 <= arr.length) {
      // save element from position 1
      tmp = arr[pos1];
      // move element down and shift other elements up
      if (pos1 < pos2) {
        for (i = pos1; i < pos2; i++) {
            arr[i] = arr[i + 1];
        }
      }
      // move element up and shift other elements down
      else {
        for (i = pos1; i > pos2; i--) {
            arr[i] = arr[i - 1];
        }
      }
      // put element from position 1 to destination
      arr[pos2] = tmp;
    }
    return arr;
  };
  
const FFEditable= (props) => {
    const { id, title, controls, theme } = props;
    const EDIT_MODE=externalConfig && externalConfig.editMode && controls;
    // const EDIT_MODE=controls;
    let { children } = props;
    // in case it's single child
    if (!children.map){
        children=[children];
    }
    const {customConfig, updateCustomConfig} = useContext(ContextStore)
    const [dragIndex, setDragIndex]=useState(-1); 
    const [showToolbar, setShowToolbar]=useState(false);
    // const [customConfig, updateCustomConfig]=useState((iex.config && iex.config[id]))
    const [currentId, setCurrentId] = useState(null);


  // custom colors / fonts for MUI elements
  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: theme.brand.colors.primary,
        contrastText: theme.brand.colors.primaryText,
      },
      secondary: {
        main: theme.brand.colors.secondary,
        contrastText: theme.brand.colors.secondaryText,
      },
    },
    typography: {
      fontFamily: '"Roboto Condensed", sans-serif',
    },
  })

    const moveElement = (newChildrenTree, fromIndex, positions) => {
        let fromArray=Object.keys(customConfig[id]).sort((item1, item2)=>customConfig[id][item1].index - customConfig[id][item2].index);

        let toIndex=fromIndex+positions;
        if (toIndex<0){
            toIndex=0;
        }else if (toIndex>=fromArray.length){
            toIndex=fromArray.length - 1;
        }
        if (fromIndex !== toIndex){
            let _customConfig={...customConfig};
            let newArray = moveArray(fromArray, fromIndex, toIndex);
            newArray.map((key, index)=>_customConfig[id][key].index=index);
            updateCustomConfig(_customConfig);
            // we allow another second to the highlight on its current index
            setDragIndex(toIndex);
            setTimeout(()=>setDragIndex(-1), 1000);
        }else{
            setDragIndex(-1);
        }
    }
    useEffect(()=>{
        let _customConfig={...customConfig};
        let changes=false;
        children && children.map && children.map((child, index) => {
            if (!(child && child.props && child.props.id)){
                throw Error('ID is required for FFEditable children');
            }
            const childId=child.props.id;
            if (!_customConfig[id]){
                _customConfig[id]={};
            }
            if (!_customConfig[id][childId]){
                const title=(child && child.props && child.props.title) || `Section ${index}`;
                _customConfig[id][childId]=({index, hidden: false, title});
                changes=true;
            }
        });
        if (changes){
            updateCustomConfig(_customConfig);
        }
        
    }, [children, customConfig, id, updateCustomConfig])
    
    const addDraggables = (newChildrenTree, index, item) => newChildrenTree.push(
        <DraggableChild key={`drag-${id}-${index}-${title}`} id={id} newChildrenTree={newChildrenTree} moveElement={moveElement} index={index} item={item} dragIndex={dragIndex} setDragIndex={setDragIndex}/>
    );

    if (children && children.map){
        let newChildrenTree=[];
        return (
            <MuiThemeProvider theme={muiTheme} key={`ffedit-${id}-${title}`}>
                {EDIT_MODE && 
                    <div className='hideOnPrint'>
                        <ComponentsConfigModal id={id} showToolbar={showToolbar} setShowToolbar={setShowToolbar}>{newChildrenTree}</ComponentsConfigModal>
                        <Button onClick={()=>setShowToolbar(true)}>Configure {title || 'Sections'}</Button>
                    </div>            
                }
                
                {customConfig && customConfig[id] && children && children
                .map((child)=>{
                    return {id: child.props.id, config: customConfig[id][child.props.id], child}
                })
                .sort((item1, item2)=>{
                    return item1.config && item2.config && item1.config.index - item2.config.index
                })
                .map((item, index)=>{
                    const config = item.config;
                    EDIT_MODE && addDraggables(newChildrenTree, index, item)
                    if (EDIT_MODE) {
                        const _child=React.cloneElement(item.child, {...item.child.props, key:`ffedit-${id}-${title}-${index}`, configuration: config || {}});
                        return (
                            <EditBanner totalCount={children.length} title={_child.props.title} configurator={_child.props.configurator} key={`banner-${id}-${title}-${index}`} id={id} index={index} setCurrentId={setCurrentId} item={item} config={config}>
                               {_child}
                            </EditBanner>
                        );
                    } else {
                        if (config && config.hidden){
                            return <React.Fragment key={`ffedit-${id}-${title}-${index}`}/>
                        } else {
                            return item.child;
                        }
                    }
                })
                }
            </MuiThemeProvider>
        )
    }
    return children;
}
export { FFEditable };