/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const Slide = ({ content, width }) => {
  
  return (
  // <div
  //   css={css`
  //     height: 100%;
  //     width: ${width}px;
  //     background-image: url('${content}');
  //     background-size: cover;
  //     background-repeat: no-repeat;
  //     background-position: center;
  //   `}
  // />
  <div style={{width: '100%', height: '100%', display:'table-cell', verticalAlign: 'middle', textAlign: 'center'}}>
    <img style={{height: '100%'}} src={content}/>
  </div>
)}

export default Slide
