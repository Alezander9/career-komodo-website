import React from 'react';

const Squares = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Squares Grid</h1>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
            >
              <span className="text-2xl text-gray-500">#{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Squares; 