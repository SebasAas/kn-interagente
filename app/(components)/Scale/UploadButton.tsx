"use client";
import React, { useState } from 'react';

interface UploadButtonProps {
  onUploadComplete: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUploadComplete }) => {
  const [lastUploadTime, setLastUploadTime] = useState<string | null>(null);

  const handleUpload = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const uploadTime = new Date().toLocaleString();
    setLastUploadTime(uploadTime);
    onUploadComplete();
  };

  return (
    <div className='flex flex-col gap-8 ml-2'>
      <button
        className="bg-[#003369] hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded-full w-4/5"
        onClick={handleUpload}
      >
        Carregar Base
      </button>
      {lastUploadTime && (
        <p className="text-black text-sm">Último upload em: {lastUploadTime}</p>
      )}
    </div>
  );
};

export default UploadButton;
