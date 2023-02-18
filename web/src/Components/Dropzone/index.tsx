import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'

interface Props{
    onFileUploaded : (file:File)=>void;
}


const Dropzone: React.FC<Props> = ({onFileUploaded}) => {

    const [selectedFileURL, SetSelectedFileURL] = useState('')

    const onDrop = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0]
        const fileURL = URL.createObjectURL(file)
        SetSelectedFileURL(fileURL)
        onFileUploaded(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    })

    return (
        <div className='dropzone'{...getRootProps()} >
            <input accept='image/*' {...getInputProps()} />
            {
                selectedFileURL 
                ? <img src={selectedFileURL} />
                : (

                    <p>
                        <FiUpload />
                        Imagem do Estabelecimento.
                    </p>
                )
            }



        </div>
    )


}


export default Dropzone