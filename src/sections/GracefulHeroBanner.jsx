import React from 'react';
import { Section } from "..";

function GracefulHeroBannerSection({className, iex, ready, error, config}){
    return (
        <div className={className}>The GracefulHeroBanner section</div>
    );
}
export function GracefulHeroBanner({className}){
  return (
      <Section name="GracefulHeroBanner">
          <GracefulHeroBannerSection className={className}/>
      </Section>
  )
}

