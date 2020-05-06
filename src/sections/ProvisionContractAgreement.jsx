import React from 'react';
import { Section } from "..";

function ProvisionContractAgreementSection({className, iex, ready, error, config}){
    if (ready){
        const agreement=iex.context.company.legislationTexts.filter(item=>item.legislationTextName=='Widerrufsbelehrung')[0];
        return (
            <div className={className}>
                <div>{agreement.legislationTextContent}</div>
                {
                agreement.legislationCheckboxes.map((item)=>(
                    <div>
                        <input type="checkbox" value={item.value} checked={false}/> {item.label}
                    </div>
                ))
            }
            </div>
        );
    }else{
        return(<div></div>);
    }
}
export function ProvisionContractAgreement({className}){
  return (
      <Section name="ProvisionContractAgreement">
          <ProvisionContractAgreementSection className={className}/>
      </Section>
  )
}

