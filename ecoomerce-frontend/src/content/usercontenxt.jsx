// save and make your data centrlize

import React, { useState } from 'react'
import { dataContext as DataContext } from './dataContext';



const Usercontent = ({ children }) => {
  const [centerdata, setCenterData] = useState("")

  return (

    <DataContext.Provider value={{ centerdata, setCenterData }}>
      <div>{children}</div>
    </DataContext.Provider>

  )
}

export default Usercontent;
