'use client'
const { createContext, useState, useContext } = require("react");

const TitleContext = createContext()

export const TitleProvider = ({children})=>{
    const [title, setTitle] = useState('')

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    )
}

export const useTitle = () => {
    return useContext(TitleContext);
}