import React, {useContext, useEffect, useState} from 'react'
import jp from 'jsonpath'

const appStage = process.env.REACT_APP_STAGE || 'production'
const devProd = appStage === 'production' || appStage === 'staging' ? 'prod' : 'dev'
const getDevProd = () => {
  return devProd
}
const getFFUrl = () => {
  return `https://api.${appStage}.cloudios.flowfact-${devProd}.cloud`

}
const flattenEntity = (entity) => {
  let entityCopy = {}
  entity && Object.keys(entity).map(key => {
    if (entity[key] && entity[key].values) {
      if (entity[key].values && entity[key].values.length > 0) {
        entityCopy[key] = entity[key].values[0]
      }
    }
  })
  entityCopy._raw = { ...entityCopy }
  return entityCopy
}
const getExternalConfig = () => {
  if (window.document.location.hash) {
    try {
      return JSON.parse(decodeURI(window.document.location.hash.substring(1)))
    } catch (e) {
      console.log('getExternalConfig error', getExternalConfig)
      return undefined
    }

  }
  return undefined
}
const externalConfig = getExternalConfig()

const ContextStore = React.createContext({})
const Context = ({children}) => {
  const [iex, setIEX] = useState({})
  const [customConfig, setCustomConfig] = useState({})
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState(false)
  const [contractAcceptances, setContractAcceptances] = useState({})

  function upgradeStage(toStage) {
    // console.log('contractAcceptances', contractAcceptances);
    const m = document.location.href.match('\/render\/([^\/]*)')
    const local = !m || m.length < 2
    if (local) {
      const newIex = {...iex}
      newIex.stage++
      setIEX(newIex)
    } else {
      const exposeId = m[1] // maybe better it came from the context
      const dateStr = new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date())

      var message = `<p>${dateStr} Uhr: Der Besucher hat das interaktive Exposé besucht</p>

              <p>14.Sep. 09:57 Uhr: Es wurden mehr Informationen angefordert</p>`

      var acceptedContracts = []

      Object.keys(contractAcceptances).length && iex.company.legislationTexts.map(item => {
        var legislationCheckboxes = item.legislationCheckboxes.filter(i => contractAcceptances[`${item.id}-${i.value}`])
        var contract = {...item, legislationCheckboxes}
        acceptedContracts = [...acceptedContracts, contract]
        legislationCheckboxes.map(res => {
          message += `<p>✓${res.label}<\p>
                    `
        })
      })
      message += `<p>${dateStr} Uhr: Der Besucher hat das interaktive Exposé verlassen<\p>\n`
      //   console.log('message', message);

      fetch(`https://iex2-expose-lambda.${appStage}.sf.flowfact-${devProd}.cloud/public/expose/${exposeId}/track?async`,
        {
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            subject: 'Neuer Besucher im Interaktiven Exposé',
            message: message,
            stage: toStage,
            acceptedContracts,
          }),
          method: 'post',
        })
        .then(jsonify)
        .then(result => {
          // we do the local upgrade also to speed up the process while we fetch the new context
          const newIex = {...iex}
          newIex.stage++
          setIEX(newIex)
          setCustomConfig(newIex.config||{})
          fetchContext(true, newIex.stage)
          // for some reason this is not always working
          // setTimeout(()=>window.document.location.reload(), 1000)
        }, reportError)
    }
  }

  const setContractAccepted = (id, value, isAccepted) => {
    const ca = {...contractAcceptances}
    ca[`${id}-${value}`] = isAccepted
    setContractAcceptances(ca)
  }

  const jsonify = res => res.json()
  const reportError = error => {
    setError('' + error)
  }
  const fetchContext = (expectStageChange, targetStage) => {
    console.log('fetching context again')
    var contextURL = externalConfig && externalConfig.contextURL ? externalConfig.contextURL : `assets/context/context.json?${Math.random()}`
    fetch(contextURL, {headers: {cognitotoken: externalConfig && externalConfig.cognitotoken}})
      .then(jsonify)
      .then(result => {
        if (expectStageChange && targetStage !== result.stage) {
          // let's try it again
          // console.log('Retrying context fetch until we see a stage change')
          setTimeout(() => fetchContext(true, targetStage), 1000)
          return
        }
        setCustomConfig(result.config||{})
        setIEX(result)
        setError(null)
        fetch(`assets/context/config.json?${Math.random()}`, {headers: {cognitotoken: externalConfig && externalConfig.cognitotoken}})
          .then(jsonify)
          .then(result => {
            // resetMissingVars();
            setConfig(result)
            setReady(true)
          }, reportError)
      }, reportError)
  }

  useEffect(fetchContext, [])
  if (!ready) {
    return <></>
  }
  const {stage} = iex
  
  return <ContextStore.Provider value={{
    iex,
    customConfig,
    setCustomConfig,
    config,
    ready,
    error,
    upgradeStage,
    stage,
    setContractAccepted,
  }}>{children}</ContextStore.Provider>
}

const Stage = ({level, children}) => {
  const {iex, ready} = useContext(ContextStore)
  const {stage} = iex
  if (!ready) return <></>
  if ('' + stage !== level) return <></>
  return <>{children}</>
}

const resetMissingVars = () => {
  window.missingVars = []
}
resetMissingVars()
const addMissingVar = (ms) => {
  if (!window.missingVars.find((item) => item === ms)) {
    window.missingVars.push(ms)
    window.missingVars.sort()
  }
}
const ffmap = (strings, ...values) => {
  var str = ''
  for (var i = 0; i < strings.length; i++) {
    str += strings[i]
    if (i < values.length) {
      str += values[i]
    }
  }

  // console.log(str);
  const iex = ContextStore._currentValue.iex

  // console.log("Path : ",strings[0], iex)
  function q(jpath) {
    return jp.query(iex, jpath)
  }

  try {
    // try first with weird FF blah.values array
    let answer = q(`$.${str}.values`)
    // console.log("Answer with .values: ",answer)
    answer = answer[0]

    // undue the weird everything is a value array in FF
    if (Array.isArray(answer) && answer.length === 1) {
      // console.log("Unwrapping Array : ",answer[0]);
      answer = answer[0]
    }
    // console.log("Answer and typeof : ",answer, typeof answer);
    // if ((answer || (answer.values && answer.values.length===1 && answer.values[0]==false)) && typeof answer !== 'function') {
    if (answer && typeof answer !== 'function') {
      if (answer.length === 0) {
        addMissingVar(str)
        return undefined
      } else {
        // console.log('======================>answer1', answer)
        return answer
      }
    } else {
      // console.log("What is it's a normal object????!?!!?");
      // okay entities have weird value arrays but sender obj doesn't!!!!
      answer = q(`$.${str}`)[0]
      // console.log("Answer without .value: ",answer);
      if (answer) {
        //FF-35
        if ((answer.values && answer.values.length > 0 && answer.values[0] === '') || (answer.length === 0)) {
          addMissingVar(str)
          return undefined
        }
        //END FF-35
        // console.log('======================>answer2', answer)
        // check if values[0]=false
        if (answer.values && answer.values.length === 1 && answer.values[0] == false) {
          return 'false'
        }
        return answer
      }
      addMissingVar(str)
      return undefined
    }
  } catch (e) {
    // console.log(`Error trying to reference ${strings}`, e);
    addMissingVar(str)
    return 'ERROR'
  }
}


export {Context, ContextStore, Stage, ffmap, resetMissingVars, getDevProd, getFFUrl, flattenEntity, getExternalConfig}
