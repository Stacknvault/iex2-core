import React from 'react';
import { Section } from "..";

function SimpleHeroBannerSection({className, iex, ready, error, config}){
    return (
        <div className={className}>The SimpleHeroBanner section</div>
    );
}
export function SimpleHeroBanner({className}){
  return (
      <Section name="SimpleHeroBanner">
          <SimpleHeroBannerSection className={className}/>
      </Section>
  )
}

