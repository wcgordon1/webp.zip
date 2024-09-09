import FileUpload from '../components/FileUpload'
import Image from 'next/image' // Import the Image component

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <header className="flex justify-end mb-12">
        <nav>
          <a href="https://github.com/wcgordon1/webp.zip" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-2">GitHub</a>
          <a href="https://x.com/helloIamWilly" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-2">x/Twitter</a>
          <a href="https://www.linkedin.com/in/will-gordon1/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mx-2">LinkedIn</a>
        </nav>
      </header>
      <div className="max-w-[800px] mx-auto my-5 p-5 bg-white rounded-lg shadow">
        <Image 
          src="/images/logogo.png" // Update this path to your image
          alt="Sample Image" 
          width={80}  // Set width
          height={80}  // Set height
          className="mb-2" // Add margin below the image
        />
        <h1 className="text-3xl font-bold mb-4">WebP.Zip</h1>
        <p className="mb-2">
          Convert JPG, PNG, AVIF, and BMP to WebP. Free and secure!
        </p>
        <p className="mb-6 text-sm text-gray-500">
          Everything happens in your browser. Ensuring your files never touch our server and remain safe!
        </p>
        <FileUpload />
      </div>
      <div className="max-w-[800px] mx-auto p-5">
  <p className=" text-center text-sm text-gray-500">
    Support this project by sharing it on social media!
  </p>
</div>
    </main>
  )
}
