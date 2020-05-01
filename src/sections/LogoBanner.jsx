import React from 'react';
import { Section } from "..";

function LogoBannerSection({className, iex, ready, error, config}){
    return (
        <div className={className}>The logo section</div>
    );
}
export function LogoBanner(){
  return (
      <Section name="LogoBanner">
          <LogoBannerSection className={className}/>
      </Section>
  )
}

