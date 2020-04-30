import React, { useState, useEffect, cloneElement } from 'react';

export function useIEX() {
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

export function Section({name, children}){
  const { iex, ready, error, config } = useIEX();
  const {context, currentStage} = iex;
  if (!ready){
    return <></>
  }
  console.log("currentStage", currentStage);
  console.log("config", config);
  console.log("name", name);
  console.log("children", children);
  if (currentStage<config.sections[name]){
    return <></>;
  }
  // if (children.map){ 
  //   return children.map(child => {
  //   return cloneElement(child, { ...child.props, name: 'x', iex, ready, error, config })
  //   });
  // }else{
  //   return children;
  // }
  return cloneElement(children, { ...children.props, name: 'x', iex, ready, error, config })
}

