import styled from 'styled-components'

export const ShopContainer = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  gap: 30px;
`

export const Market = styled.div`
  width: 100%;
  max-width: 800px;
  background: beige;
  border: 1px solid red;
`

export const ShopList = styled.div`
  width: 100%;
  height: 100px;
  background: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`

export const ShopItem = styled.img`
  width: auto;
  height: 90px;
`
