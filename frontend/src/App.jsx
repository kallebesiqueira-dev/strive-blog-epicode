import {useState} from "react";

const App = () => {
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({})

    const onChangeFile = (e) => {
        setFile(e.target.files[0])
    }

    const onChangeInput = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const uploadFile = async (file) => {
        const fileData = new FormData()
        fileData.append('img', file)

        try {
            const response = await fetch('http://localhost:9099/upload/post/cloud', {
                method: 'POST',
                body: fileData
            })
            return await response.json()
        } catch (e) {
            console.error(e)
        }
    }

    const onSubmitPost = async (e) => {
        e.preventDefault()
        if (file) {
            try {
                const uploadedFile = await uploadFile(file)

                const postFormDataWithImage = {
                    ...formData,
                    cover: uploadedFile.img
                }
                console.log(postFormDataWithImage)
                const response = await fetch('http://localhost:9099/posts', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postFormDataWithImage)
                })

                return await response.json()
            }catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <div>
            <form onSubmit={onSubmitPost} encType='multipart/form-data'>
                <input
                    onChange={onChangeInput}
                    type="text" name='category'/>
                <input
                    onChange={onChangeFile}
                    type="file"
                    name='img'
                />
                <input
                    onChange={onChangeInput}
                    type="text" name='title'/>
                <input
                    onChange={onChangeInput}
                    type="text" name='value'/>
                <input
                    onChange={onChangeInput}
                    type="text" name='unit'/>
                <input
                    onChange={onChangeInput}
                    type="text" name='author'/>
                <input
                    onChange={onChangeInput}
                    type="text" name='content'/>

                <button type='submit'>
                    invia
                </button>
            </form>
        </div>
    )
}

export default App