import {Button} from '@material-ui/core'
import React, {useCallback, useContext, useMemo, useState} from 'react'
import {ContextStore} from '../Context'
import {EditChildModal} from './EditChildModal'
import SettingsIcon from '@material-ui/icons/Settings'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import {makeStyles} from '@material-ui/styles'


const useStyles = makeStyles(
  () => ({
      root: {
          position: 'relative',
          left: 0,
          top: 0,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#e6e6e6',
          color: '#444',
          boxShadow: 'inset 0 0 10px 0 #ccc',
          marginBottom: 1,
          zIndex: 10,
      },
      innerWrap: {
          maxWidth: 1200,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
      },
      title: {
          marginRight: 5,
          marginBottom: 0,
      },
      buttons: {},
      btn: {
          marginLeft: '5px !important',
          minWidth: 'unset !important'
      }
  }),
  {name: 'FFEditable'},
)

export const EditBanner = ({title, totalCount, children, id, index, item, configurator}) => {
    let divStyle = {outline: '4px dotted yellow'}
    const {iex, customConfig, updateCustomConfig} = useContext(ContextStore)
    const [isOpen, setOpen] = useState(false)
    const close = () => setOpen(false)
    const classes = useStyles()

    const hidden = useMemo(() => {
        return customConfig[id] && customConfig[id][item.id] && customConfig[id][item.id].hidden
    }, [customConfig])

    const initConfig = () => {
        let _customConfig = {...customConfig}
        if (!_customConfig[id]) {
            _customConfig[id] = {}
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
      <div key={`${id}-banner-${index}`}>
          <div className={`${classes.root} hideOnPrint`}>
              <div className={classes.innerWrap}>
                  <p className={classes.title}>{title}</p>
                  <div className={classes.buttons}>
                      {configurator &&
                      <React.Fragment>
                          <Button
                            onClick={setOpen}
                            size='small'
                            className={classes.btn}><SettingsIcon/></Button>
                          <EditChildModal
                            id={id}
                            item={item}
                            isOpen={isOpen}
                            close={close}
                            configurator={configurator}/>
                      </React.Fragment>}
                      <Button
                        onClick={handleClickShowHide}
                        size='small'
                        className={classes.btn}>{hidden ? <VisibilityIcon/> : <VisibilityOffIcon/>}</Button>
                  </div>
                  {/* <div><Button onClick={handleClickUp}>Up</Button></div>
                <div><Button onClick={handleClickDown}>Down</Button></div> */}
              </div>
          </div>
          {!hidden && children}
      </div>
    );
}