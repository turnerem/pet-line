import React from 'react'

export const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {

  return (
    <GlobalContext.Provider>
      { children }
    </GlobalContext.Provider>
  )
}