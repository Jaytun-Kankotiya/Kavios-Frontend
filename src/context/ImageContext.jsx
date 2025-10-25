import { createContext, useContext } from "react";



const ImageContext = createContext()

export const useImageContext = () => useContext(ImageContext)

const ImageProvider = ({children}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL



    const value = {
        backendUrl
    }

    return (
        <ImageContext.Provider value={value}>
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider