import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          FFXI Project
        </h1>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Full Stack App with React + TypeScript
          </p>
          <button
            onClick={() => setCount(count => count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Count: {count}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            TailwindCSS is working! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
