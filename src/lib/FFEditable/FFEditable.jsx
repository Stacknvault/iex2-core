import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react'
import { ComponentsConfigModal, EditBanner, EditChildModal } from '../..';
import {ContextStore, getExternalConfig} from '../Context'
import DraggableChild from './DraggableChild';
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
    console.log('let\'s rerender 2')
    const { id, title, controls, theme } = props;
    // const EDIT_MODE=externalConfig && externalConfig.editMode && controls;
    const EDIT_MODE=controls;
    let { children } = props;
    // in case it's single child
    if (!children.map){
        children=[children];
    }
    const {customConfig, setCustomConfig} = useContext(ContextStore)
    const [dragIndex, setDragIndex]=useState(-1); 
    const [showToolbar, setShowToolbar]=useState(false);
    // const [customConfig, setCustomConfig]=useState((iex.config && iex.config[id]))
    const [currentTitle, setCurrentTitle] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    console.log('1');


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
            setCustomConfig(_customConfig);
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
                //console.log(`adding ${title}`)
                _customConfig[id][childId]=({index, hidden: false, title});
                changes=true;
            }
        });
        if (changes){
            //console.log('_customConfig\n', JSON.stringify(_customConfig, null, 2))
            setCustomConfig(_customConfig);
        }
        console.log('2');
        
    }, [children, customConfig, id, setCustomConfig])
    
    const addDraggables = (newChildrenTree, index, item) => newChildrenTree.push(
        <DraggableChild key={`drag-${id}-${index}-${title}`} id={id} newChildrenTree={newChildrenTree} moveElement={moveElement} index={index} item={item} dragIndex={dragIndex} setDragIndex={setDragIndex}/>
    );

    

    const addEditBannerAndChild = (config, item, index) => {
        let _child = item.child;
        if (_child && _child.props && _child.props.title && _child.props.title!==config.title){
            _child=React.cloneElement(_child, {..._child.props, title: config.title});
        }
        return (
            <EditBanner id={id} index={index} setCurrentTitle={setCurrentTitle} setCurrentId={setCurrentId} item={item} config={config}>
                {_child}
            </EditBanner>
        )
    }

    console.log('3');
    if (children && children.map){
        console.log('4');
        let newChildrenTree=[];
        return (
            <MuiThemeProvider theme={muiTheme} key={`ffedit-${id}-${title}`}>
                {EDIT_MODE && 
                    <div className='hideOnPrint'>
                        <ComponentsConfigModal id={id} showToolbar={showToolbar} setShowToolbar={setShowToolbar}>{newChildrenTree}</ComponentsConfigModal>
                        <EditChildModal id={id} currentId={currentId} setCurrentId={setCurrentId} currentTitle={currentTitle} setCurrentTitle={setCurrentTitle}></EditChildModal>
                        <Button onClick={()=>setShowToolbar(true)}>Configure {title || 'Sections'}</Button>
                    </div>            
                }
                
                {customConfig && customConfig[id] && children && children
                .map((child)=>{
                    console.log('5');
                    return {id: child.props.id, config: customConfig[id][child.props.id], child}
                })
                .sort((item1, item2)=>{
                    console.log('6');
                    return item1.config.index - item2.config.index
                })
                .map((item, index)=>{
                    console.log('7');
                    const config = item.config;
                    //console.log('config', config)
                    EDIT_MODE && addDraggables(newChildrenTree, index, item)
                    if (config.hidden){
                        console.log('8');
                        return (<React.Fragment key={`ffedit-${id}-${title}-${index}`}/>)
                    }else {
                        console.log('9');
                        let _child = item.child;
                        if (_child && _child.props && _child.props.title && _child.props.title!==config.title){
                            _child=React.cloneElement(_child, {..._child.props, key:`ffedit-${id}-${title}-${index}`, title: config.title});//!!! maybe we need to do a deep clone to make effect
                        }
                        if (EDIT_MODE){
                            console.log('10');
                            return (
                                <EditBanner key={`banner-${id}-${title}-${index}`} id={id} index={index} setCurrentTitle={setCurrentTitle} setCurrentId={setCurrentId} item={item} config={config}>
                                    {_child}
                                </EditBanner>
                            )
                        } else{
                            console.log('11');
                            return _child;
                        }
                    }
                    
                })
                }
            </MuiThemeProvider>
        )
    }
    return children;
}

export default FFEditable;