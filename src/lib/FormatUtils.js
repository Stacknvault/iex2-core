import React from 'react'
import ReactMarkdown from 'react-markdown'

const ffmd = (mdtext) => {
  return <ReactMarkdown source={mdtext}/>
}

const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const currency = (n) => {
  if (!n) {
    return undefined
  }
  return formatter.format(n).replace(',00', '')
}
export {ffmd, currency}