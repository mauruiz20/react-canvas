'use client'

import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    width: 100%;
    margin: 0;
  }

  button {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
  }

  a {
    color: inherit;
  }
`

export default GlobalStyles

export const CanvasContainer = styled.div`
  background: beige;
`
