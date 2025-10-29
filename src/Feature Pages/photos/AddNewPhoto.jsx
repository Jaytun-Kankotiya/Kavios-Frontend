import { X } from "lucide-react"
import { useState } from "react"
import { useImageContext } from "../../context/ImageContext"



const AddNewImage = () => {

    const {backendUrl, newImage, setNewImage, loading, setLoading} = useImageContext()
    const [imageData, setImageData] = useState({
        name: '',
        albumId: '',
        tags: '',
        person: '',
        comments: ''
    })

    const changeHandler = (e) => {
        const {name, value} = e.target
    }

    const addImageSubmitHandler = (e) => {

    }

    return (
        <>
        <div className="addalbum-outer">
      <div className="addAlbum-main">
        <div className="addAlbum-header">
          <p>Upload an Image</p>
          <X
            size={22}
            className="close-icon"
            onClick={() => setNewImage(false)}
          />
        </div>

        <form onSubmit={addImageSubmitHandler}>
          <div className="addalbum-inputs">
            <input
              type="text"
              placeholder="Image Name"
              name="name"
              value={imageData.name}
              onChange={changeHandler}
              required
            />
            <input
              type="text"
              placeholder="Comments"
              name="description"
              value={imageData.comments}
              onChange={changeHandler}
              required
            />
          </div>

          <button className="addAlbum-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Album"}
          </button>
        </form>
      </div>
    </div>
        </>

    )
}

export default AddNewImage