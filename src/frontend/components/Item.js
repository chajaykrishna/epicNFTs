import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

const Item = () => {
    const {state} = useLocation();
    const {itemId} = useParams();
    // console.log(state.item_data)

  return (
    <div>
      <h1> {itemId}</h1>
    </div>
  )
}

export default Item
