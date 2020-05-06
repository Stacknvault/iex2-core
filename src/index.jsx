import React, { useState, useEffect, cloneElement } from 'react';
export * from './sections/GracefulHeroBanner';
export * from './sections/ImageWall';
export * from './sections/LogoBanner';
export * from './sections/ProvisionContractAgreement';
export * from './sections/SimpleDataTable';
export * from './sections/SimpleHeroBanner';


export function Section({name, children}){
  useIEX = () =>{
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
    return {
        iex, ready, error, config
    } 
  }
  const { iex, ready, error, config } = useIEX();
  const {context, currentStage} = iex;
  if (!ready){
    return <div></div>
  }
  
  if (config && config.sections && config.sections[currentStage] && !config.sections[currentStage].includes(name)){
    return <div></div>
  }
  return cloneElement(children, { ...children.props, name: name, iex, ready, error, config })
}

