import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { patchDocument, PatchType, ImageRun } from 'docx';
import { Upload, Trash2, FileSignature, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WordDocSigner() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const sigCanvas = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    if (!uploadedFile.name.endsWith('.docx')) {
      setError('Please upload a .docx file');
      return;
    }
    
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setError('');
    setSuccess(false);
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleSign = async () => {
    if (!file) {
      setError('Please upload a document first.');
      return;
    }
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      setError('Please draw a signature.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess(false);

    try {
      const signatureDataUrl = sigCanvas.current.toDataURL('image/png');
      const base64Data = signatureDataUrl.replace(/^data:image\/png;base64,/, '');
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const arrayBuffer = await file.arrayBuffer();

      const doc = await patchDocument({
        outputType: "blob",
        data: arrayBuffer,
        patches: {
          sig_1: {
            type: PatchType.PARAGRAPH,
            children: [
              new ImageRun({
                data: binaryData,
                transformation: {
                  width: 200,
                  height: 100,
                },
              }),
            ],
          },
        },
      });

      const blobUrl = URL.createObjectURL(doc);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `Signed_${fileName}`;
      a.click();
      
      URL.revokeObjectURL(blobUrl);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to patch document. Ensure the document contains the placeholder {{sig_1}}.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link to="/" className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold mb-2">Word Doc Signer</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Sign .docx files locally in the browser by replacing the <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded">{"{{"}sig_1{"}}"}</code> placeholder with your handwritten signature. All processing happens entirely in your browser. No files are uploaded to any server.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Upload Document</h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {fileName ? fileName : 'Click to select a .docx file'}
                  </span>
                  <span className="text-sm text-gray-500">Must contain <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">{"{{"}sig_1{"}}"}</code> placeholder</span>
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Draw Signature</h2>
                <button
                  onClick={clearSignature}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center space-x-1 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden shadow-inner">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    className: 'w-full h-48 cursor-crosshair'
                  }}
                  backgroundColor="rgba(0,0,0,0)"
                  penColor="black"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Draw your signature above. It will be resized automatically.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit space-y-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Process & Download</h2>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">
                Document signed and downloaded successfully!
              </div>
            )}

            <button
              onClick={handleSign}
              disabled={isProcessing || !file}
              className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]"
            >
              <FileSignature className="w-6 h-6" />
              <span>{isProcessing ? 'Processing...' : 'Sign and Download'}</span>
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
              <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Privacy First</span>
              Your document and signature never leave your device. All processing is done securely in your browser.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}