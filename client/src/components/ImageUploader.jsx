import  { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiRefreshCw } from "react-icons/fi";

const  ImageUploader = ({ onChange, maxFiles = 5, multiple = true, accept = "image/*" })  => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(list) {
    const arr = Array.from(list || []);
    const sliced = arr.slice(0, maxFiles);
    setFiles(sliced);
    if (onChange) onChange(sliced);
  }

  function handleInputChange(e) {
    handleFiles(e.target.files);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  function clearSelection() {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
    if (onChange) onChange([]);
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload images</label>

      <div
        onClick={openFileDialog}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors duration-150 ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        aria-label="Image upload dropzone"
      >
        <div className="text-center text-gray-600">
          <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
          <p className="mt-2 text-sm">Drag & drop images here, or click to select</p>
          <p className="mt-1 text-xs text-gray-500">Allowed: {accept}. Max files: {maxFiles}.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="mt-3 flex flex-col md:flex-row md:items-start md:justify-between gap-3 ">
        <div className="flex-1" >
          <p className="text-sm text-gray-700">Selected: <span className="font-semibold">{files.length}</span></p>
          {files.length > 0 && (
            <ul className="mt-2 max-h-28 overflow-auto text-sm text-gray-600">
              {files.map((f, i) => (
                <li key={i} className="truncate">{i + 1}. {f.name} <span className="text-xs text-gray-400">({Math.round(f.size / 1024)} KB)</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openFileDialog}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:shadow-sm"
          >
            <FiRefreshCw /> Change
          </button>

          <button
            type="button"
            onClick={clearSelection}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50"
          >
            <FiTrash2 /> Clear
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-400">Note: Images are not previewed in this component.</p>
    </div>
  );
}

export default ImageUploader ;