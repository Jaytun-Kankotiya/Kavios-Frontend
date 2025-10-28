import { createContext, useContext, useState } from "react";



const ImageContext = createContext()

export const useImageContext = () => useContext(ImageContext)

const ImageProvider = ({children}) => {

    const [images, setImages] = useState([])
    const [albums, setAlbums] = useState([])
    const [favoriteImages, setFavoriteImages] = useState([])
    const [favoriteAlbums, setFavoriteAlbums] = useState([])
    const [recentlyAdded, setRecentlyAdded] = useState([])
    const [imageTrash, setImageTrash] = useState([])
    const [albumTrash, setAlbumTrash] = useState([])
    const [sharedWithMe, setSharedWithMe] = useState([])
    const [loading, setLoading] = useState(true)

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