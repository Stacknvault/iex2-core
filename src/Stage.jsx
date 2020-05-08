import React, { useState, useEffect, cloneElement } from 'react';
import PropTypes from 'prop-types';
export const ContextStore = React.createContext({});

const Stage = ({name, children, level})=>{
    const [ iex, setIEX ] = useState({});
    const [ ready, setReady ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ config, setConfig ] = useState(false);
    
    useEffect(() => {
      fetch('assets/context/context.json',{headers:{}})
      .then(res => {
        return res.json();
      })
      .then(
        (result) => {
          setIEX(result);
          setError(null);
          fetch('assets/context/config.json',{headers:{}})
          .then(res => {
            return res.json();
          })
          .then(
            (result) => {
              setConfig(result)
              setReady(true);
            },
            (error) => {
              setError(""+error);
            }
          )
        },
        (error) => {
          setError(""+error);
        }
      )
    }, []);
  const {currentStage} = iex;
  if (!ready){
    return <div></div>
  }
  
  if (""+currentStage!==level){
    return <div></div>
  }
  return (
    <ContextStore.Provider value={{iex, config, ready, error}}>
      {cloneElement(children)}
    </ContextStore.Provider>
  )
}

Stage.propTypes = {
  level: PropTypes.string
}

export default Stage;