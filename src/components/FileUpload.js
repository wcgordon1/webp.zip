'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import imageCompression from 'browser-image-compression'

export default function FileUpload() {
  const [files, setFiles] = useState([])
  const [failedConversions, setFailedConversions] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [zipFile, setZipFile] = useState(null) // State to hold the generated ZIP file

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        status: 'queued'
      }))
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/avif': [],
      'image/bmp': []
    },
    multiple: true
  })

  const removeFile = (file) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file))
    URL.revokeObjectURL(file.preview)
  }

  const resetForm = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
    setFiles([])
    setFailedConversions(0)
    setIsProcessing(false)
    setProgress(0)
    setZipFile(null) // Reset the ZIP file state
  }

  const convertToWebP = async (file, quality) => {
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        fileType: 'image/webp',
        quality: quality / 100
      }

      console.log(`Converting ${file.name} with quality ${quality}%`)
      console.log(`Original size: ${file.size} bytes`)

      const webpFile = await imageCompression(file, options)

      console.log(`Converted size: ${webpFile.size} bytes`)

      return new File([webpFile], file.name.replace(/\.[^/.]+$/, ".webp"), { type: 'image/webp' })
    } catch (error) {
      console.error('Error converting file:', file.name, error)
      throw error
    }
  }

  const beginProcessing = async () => {
    setIsProcessing(true)
    setFailedConversions(0)
    setProgress(0)

    const zip = new JSZip()
    let converted = 0
    let failed = 0

    for (const file of files) {
      try {
        const webpFile = await convertToWebP(file, 50) // Use a default quality of 50
        zip.file(webpFile.name, webpFile)
        converted++
      } catch (error) {
        console.error(`Failed to convert ${file.name}:`, error)
        failed++
      }
      setProgress((converted + failed) / files.length * 100)
    }

    setFailedConversions(failed)

    if (converted > 0) {
      const content = await zip.generateAsync({ type: 'blob' })
      setZipFile(content) // Store the generated ZIP file
      saveAs(content, 'converted_images.zip') // Automatically download the ZIP file
    }

    setIsProcessing(false)
  }

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  // Calculate total file size
  const totalFileSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop your JPG, PNG, AVIF, or BMP images here, or click to select files</p>
        )}
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">
            Total file size: {(totalFileSize / (1024 * 1024)).toFixed(2)} MB / 100 MB
          </p>
        </div>
      )}
      {failedConversions > 0 && (
        <p className="mt-4 text-red-500">
          {failedConversions} file(s) failed to convert. The ZIP file will contain successfully converted files only.
        </p>
      )}
      {files.length > 0 && (
        <>
          <div className="flex space-x-4 mt-8">
            <button
              onClick={beginProcessing}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Begin Processing'}
            </button>
            <button
              onClick={resetForm}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
              disabled={isProcessing}
            >
              Reset
            </button>
          </div>
          {isProcessing && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Converting: {Math.round(progress)}%</p>
            </div>
          )}
          {zipFile && (  // Conditionally render the download button
            <div className="mt-4">
              <button
                onClick={() => saveAs(zipFile, 'converted_images.zip')}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Download ZIP
              </button>
            </div>
          )}
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {files.map((file) => (
              <div key={file.name} className="relative">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-20 object-cover rounded-lg"
                  onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
                <button
                  onClick={() => removeFile(file)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                  disabled={isProcessing}
                >
                  ×
                </button>
                <p className="mt-1 text-xs truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}