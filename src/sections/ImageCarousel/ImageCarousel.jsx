import React, {useContext} from 'react';
import {ContextStore} from '@stacknvault/iex2-core'
import PropTypes from 'prop-types';

import Slider from './Slider'

 
const ImageCarousel = ({className, autoPlay, scale}) =>{
  const {iex, config, ready, error} = useContext(ContextStore);
  if (!ready){
    return (<div></div>);
  }
  const images = iex.context.entity.longImage.values.map(item=>item.uri);
  // const loadedImages = images.map((image)=>{
  //   const img=new Image();
  //   img.src = image;
  //   console.log('setting src', image)
  //   return img;
  // })
  
  console.log(images);

  return (
    <div>
        <Slider scale={scale?scale:1} slides={images} autoPlay={autoPlay}/>
    </div>
  );
}
ImageCarousel.propTypes = {
  className: PropTypes.string,
  autoPlay: PropTypes.number,
  scale: PropTypes.number
}

export default ImageCarousel;
