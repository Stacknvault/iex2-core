import React from 'react';
import { Section } from "..";

function ProvisionContractAgreementSection({className, iex, ready, error, config}){
    return (
        <div className={className}>Legal stuff</div>
    );
}
export function ProvisionContractAgreement({className}){
  return (
      <Section name="ProvisionContractAgreement">
          <ProvisionContractAgreementSection className={className}/>
      </Section>
  )
}

