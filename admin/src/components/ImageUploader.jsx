import React from 'react';
import { Label, Button } from '@windmill/react-ui';
import { TrashIcon, AddIcon } from '../icons';

const ImageUploader = ({ onImageChange, selectedFiles, onRemoveImage, error }) => {
  return (
    <div className="mb-6">
      <Label className="mb-4">
        <span>Product Images</span>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={file.previewUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="cursor-pointer">
            <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <AddIcon className="w-8 h-8 mx-auto text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Add Image</span>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        </div>
        {error && (
          <span className="text-xs text-red-500 mt-1">{error}</span>
        )}
      </Label>
    </div>
  );
};

export default ImageUploader;
