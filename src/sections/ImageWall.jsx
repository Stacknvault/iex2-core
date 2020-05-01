import React from 'react';
import { Section } from "..";

function ImageWallSection({className, iex, ready, error, config}){
    return (
        <div className={className}>The ImageWall section</div>
    );
}
export function ImageWall({className}){
  return (
      <Section name="ImageWall">
          <ImageWallSection className={className}/>
      </Section>
  )
}

