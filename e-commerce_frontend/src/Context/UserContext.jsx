// save and make your data centerlize

import React, { createContext, useState } from 'react'
export const DataContext = createContext();



const UserContect = ({children}) => {
  const [centerData, setCenterData] = useState("")
  return (

    <DataContext.Provider value={{centerData , setCenterData}}>
        <div className='text-white'>{children}</div>
    </DataContext.Provider>

    
  )
}

export default UserContect