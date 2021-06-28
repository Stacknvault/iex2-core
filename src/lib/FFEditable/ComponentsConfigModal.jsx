import {Button, Modal} from '@material-ui/core'
import React, {useContext} from 'react'
import {ContextStore} from '../Context'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(
  () => ({
    root: {
      top: '50%',
      left: '50%',
      display: 'flex',
      outline: 'unset',
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      background: '#FFFFFF',
      flexDirection: 'column',
      padding: 30,
    },
    rowDiv: {
      padding: 0,
      margin: 0,
      marginTop: 15,
      marginBottom: 15,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 500,
      overflow: 'scroll',
    },
    header: {
      marginBottom: 0,
      color: '#555',
    },
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
          <h2 lassName={classes.header}>Sections</h2>
          <p>Please select the sections that you want displayed and drag and drop them to the desired order</p>
          <div className={classes.rowDiv}>
            {children}
            {/*  <div className={classes.dragContainer}>*/}
            {/*      <div className={classes.dragItemContainer}>*/}
            {/*          <div className={classes.dragItemContainerInner}>{children}</div>*/}
            {/*      </div>*/}
            {/*  </div>*/}
          </div>
            <Button
              onClick={() => {
                setShowToolbar(false)
              }}
              color="primary"
              variant='contained'>
              Close</Button>
          </div>
      </Modal>
    );
}