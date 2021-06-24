import React, {useContext, useEffect, useState} from 'react'
import jp from 'jsonpath'
import mustache from 'mustache'

export const supportedLanguages = ['en', 'es', 'de', 'it', 'fr' ];

const appStage = process.env.REACT_APP_STAGE || 'production'
const devProd = appStage === 'production' || appStage === 'staging' ? 'prod' : 'dev'
export const getDevProd = () => {
  return devProd
}
export const getFFUrl = () => {
  return `https://api.${appStage}.cloudios.flowfact-${devProd}.cloud`
}
export const flattenEntity = (entity) => {
  let entityCopy = {}
  entity && Object.keys(entity).map(key => {
    if (entity[key] && entity[key].values) {
      if (entity[key].values && entity[key].values.length > 0) {
        entityCopy[key] = entity[key].values[0]
      }
    }
    if (entity[key] && !entity[key].values) {
      entityCopy[key] = entity[key]
    }
  })
  entityCopy._raw = {...entityCopy}
  return entityCopy
}

export const getExternalConfig = () => {
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

export const getExposeId = () => {
  const m = document.location.href.match('\/render\/([^\/]*)')
  const local = !m || m.length < 2
  if (local) {
    return null;
  } else {
    const exposeId = m[1] // maybe better it came from the context
    return exposeId;
  }
}
export const getBackendUrl = () => {
  return `https://iex2-expose-lambda.${appStage}.sf.flowfact-${devProd}.cloud`;
}
const externalConfig = getExternalConfig()

const ContextStore = React.createContext({})
const Context = ({children}) => {
  const [iex, setIEX] = useState({})
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState(false)
  const [contractAcceptances, setContractAcceptances] = useState({})
  const [hostname, setHostname] = useState('')
  const [language, setLanguage] = useState('de')
  const [customConfig, setCustomConfig] = useState({})

  const getMessages = (event) => {
    if (event.data.eventName) {
      // let's see if it's a configuration event
      if (event.data.eventName === 'expose-configuration') {
        setCustomConfig(event.data.data);
      }
  }
  }
  useEffect(() => {
    window.addEventListener('message', getMessages);
    return () => window.removeEventListener('message', getMessages);
  }, []);

  const updateCustomConfig = (newCustomConfig) => {
    setCustomConfig(newCustomConfig);
    try {
        const w = window.opener || window.parent;
        if (w) {
            console.log('posting message...');
            // postRobot.send(window.opener, 'expose-configurator', _customConfig);
            w.postMessage({ eventName: 'expose-configuration', data: newCustomConfig }, '*') // '*' is "parent url"
        }
    } catch (e) {
        console.warn(e);
    }

  }
  const filterContracts = (contracts) => {
    let filteredContracts = (contracts && contracts
      .filter((item) => {
        //console.log('item.technicalName', item.technicalName);
        return item.technicalName.endsWith(`-${language}`)
      })
      .sort((item) => (!item.technicalName.startsWith('terms_of_use') ? 1 : -1))) || []
    if (filteredContracts.length === 0){
      if (contracts.length > 0){
        const m = contracts[0].technicalName.match('-(.*)$');
        if (m && m.length>1){
          const firstLang = m[1];
          //console.log('firstLang', firstLang);
          filteredContracts = contracts.filter((contract) => contract.technicalName.endsWith(`-${firstLang}`))
          .sort((item) => (!item.technicalName.startsWith('terms_of_use') ? 1 : -1));
        }else {
          filteredContracts = contracts;
        }
      } else {
        filteredContracts = [];
      }
    }
    // filter if there is no commission
    return filteredContracts.filter((contract) => (!contract.technicalName.startsWith('commission_hint') && !contract.technicalName.startsWith('revocation_terms')) || ffmap`estate.commissionProspect`);
  }

  function upgradeStage(toStage, vars) {
    // console.log('contractAcceptances', contractAcceptances);
    const m = document.location.href.match('\/render\/([^\/]*)')
    const local = !m || m.length < 2
    if (local) {
      const newIex = {...iex}
      newIex.stage++
      setIEX(newIex);
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

              <p>${dateStr} Uhr: Es wurden mehr Informationen angefordert</p>`

      var acceptedContracts = []

      Object.keys(contractAcceptances).length && iex.company.legislationTexts.map(item => {
        var legislationCheckboxes = item.legislationCheckboxes.filter(i => contractAcceptances[`${item.id}-${i.value}`]).map(cb => ({
          ...cb,
          value: mustache.render(cb.value, vars),
          label: mustache.render(cb.label, vars),
        }))
        item.legislationTextContent = mustache.render(item.legislationTextContent, vars)

        var contract = {...item, legislationCheckboxes}
        acceptedContracts = [...acceptedContracts, contract]
        legislationCheckboxes.map(res => {
          message += `<p>✓${res.label}<\p>`
        })
      })
      message += `<p>${dateStr} Uhr: Der Besucher hat das interaktive Exposé verlassen<\p>\n`


      fetch(`${getBackendUrl()}/public/expose/${exposeId}/track?async`,
        {
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            subject: 'Neuer Besucher im Interaktiven Exposé',
            message: mustache.render(message, vars),
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

  

  const applyMappings = (iex, mappings) => {
    if (mappings) {
      Object.keys(mappings).map((mappingName) => {
        const schemaIndex = iex.schemas.findIndex((schema) => schema.name === iex[mappingName]._metadata.schema);
        const mappingArray = mappings[mappingName];
        mappingArray.map((mapping) => {
          ['', ...supportedLanguages].map((language) => {
            const LANG = language.toUpperCase();
            const goodKeyIndex = mapping.findIndex((item) => {
              const key = `${item}${LANG}`;
              const value = iex[mappingName][key];
              return value;
            });
            if (goodKeyIndex >= 0) {
              for (let i = 0; i<mapping.length; i++) {
                if(i!==goodKeyIndex) {
                  const localizedMapping = `${mapping[i]}${LANG}`;
                  const localizedKey = `${mapping[goodKeyIndex]}${LANG}`;
                  iex[mappingName][localizedMapping]=iex[mappingName][localizedKey];
                  if (schemaIndex >= 0 && !iex.schemas[schemaIndex].properties[localizedMapping]) {
                    // we need to add the property to the schema too
                    iex.schemas[schemaIndex].properties[localizedMapping] = iex.schemas[schemaIndex].properties[mapping[goodKeyIndex]];
                  }
                }
              }
            }
          });
        });
      });
    }
    return iex;
  }

  const jsonify = res => res.json()
  const reportError = error => {
    setError('' + error)
  }
  const fetchContext = (expectStageChange, targetStage) => {
    var contextURL = externalConfig && externalConfig.contextURL ? externalConfig.contextURL : `assets/context/context.json?${Math.random()}`
    const headers = externalConfig ? {...externalConfig.authHeaders} : {}
    fetch(contextURL, {headers: headers})
      .then(jsonify)
      .then(iex => {
        if (expectStageChange && targetStage !== iex.stage) {
          // let's try it again
          // console.log('Retrying context fetch until we see a stage change')
          setTimeout(() => fetchContext(true, targetStage), 1000)
          return
        }
        setError(null)
        fetch(`assets/context/config.json?${Math.random()}`, {headers: headers})
          .then(jsonify)
          .then(config => {
            // resetMissingVars();
            setConfig(config)
            setReady(true)
            // we apply the field mappings here
            const mappings = config.fieldMapping;
            setCustomConfig(iex.config||{})
            setIEX(applyMappings(iex, mappings));
          }, reportError)
      }, reportError)
      .catch(error => console.log(error))
  }

  useEffect(fetchContext, [])
  if (!ready) {
    return <React.Fragment></React.Fragment>
  }
  const {stage} = iex

  return <ContextStore.Provider value={{
    iex,
    customConfig,
    updateCustomConfig,
    config,
    ready,
    error,
    upgradeStage,
    stage,
    setContractAccepted,
    hostname,
    setHostname,
    language,
    setLanguage,
    filterContracts,
  }}>{children}</ContextStore.Provider>
}

const Stage = ({level, children}) => {
  const {iex, ready} = useContext(ContextStore)
  const {stage} = iex
  if (!ready) return <React.Fragment></React.Fragment>
  if ('' + stage !== level) return <React.Fragment></React.Fragment>
  return <React.Fragment>{children}</React.Fragment>
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
const __ffmap = (strings, ...values) => {
  let str = ''
  for (let i = 0; i < strings.length; i++) {
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
    if (Array.isArray(answer) && answer.length > 1) {
      return answer
    }

    // undue the weird everything is a value array in FF
    if (Array.isArray(answer) && answer.length) {
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


const ffmap = (strings, ...values) => {
  const {language} = ContextStore._currentValue
  let value = __ffmap(strings, ...values)
  if (!value && language) {
    const lng = language.substring(0, 2).toUpperCase()
    // const newKey = strings[0].replace(/([^\.]+\.[^\.]+)(.?.*)$/, '$1EN$2');
    const newKey = strings[0]
    value = __ffmap(`${newKey}${lng}`, ...values)
    if (!value && lng === 'DE'){
      // try also with 'ch'
      value = __ffmap(`${newKey}CH`, ...values)
    }
  }
  return value
}


export {Context, ContextStore, Stage, ffmap, resetMissingVars}
