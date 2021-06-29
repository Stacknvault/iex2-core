import {Button, Modal} from '@material-ui/core'
import React, {useContext, useState} from 'react'
import {ContextStore} from '../Context'
import {makeStyles} from '@material-ui/styles'
// import postRobot from 'post-robot';

const useStyles = makeStyles(
  () => ({
    root: {},
    innerWrap: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) !important',
      backgroundColor: 'white',
      padding: 25,
    },
    content: {
      marginBottom: 10,
    },
  }),
  {name: 'EditChildModal'},
)

export const EditChildModal = (props) => {
  const {iex, customConfig, updateCustomConfig} = useContext(ContextStore)
  const {isOpen, close, configurator, id, item} = props
  const [newConfiguration, setNewConfiguration] = useState(customConfig[id][item.id] || {})
  const classes = useStyles()
  const newConfigurator =
    React.cloneElement(
      configurator,
      {
        ...configurator.props,
        configuration: newConfiguration,
        onChangeConfiguration: (newConfig) => {
          console.log('gotten new config', newConfig)
          setNewConfiguration(newConfig)
        },
        });
    const closeConfiguration = () => {
        const _customConfig={...customConfig}
        _customConfig[id][item.id] = newConfiguration;
        updateCustomConfig(_customConfig);
        close();
    }
    return (
      <Modal className={classes.root} open={isOpen}>
        <div className={classes.innerWrap}>
          <div className={classes.content}>
            {newConfigurator}
          </div>
          <Button variant='contained' disableElevation color='primary' size='small' onClick={closeConfiguration}>Save</Button>
        </div>
      </Modal>
    );
}