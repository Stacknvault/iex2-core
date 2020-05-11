import React, {useContext} from 'react';
import { ContextStore } from '../Stage'
const ProvisionContractAgreementSection = ({className})=>{
    const {iex, config, ready, error} = useContext(ContextStore);
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
export default ProvisionContractAgreementSection;