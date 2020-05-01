import React from 'react';
import { Section } from "..";

function SimpleDataTableSection({className, iex, ready, error, config}){
    return (
        <div className={className}>The SimpleDataTable section</div>
    );
}
export function SimpleDataTable({className}){
  return (
      <Section name="SimpleDataTable">
          <SimpleDataTableSection className={className}/>
      </Section>
  )
}

