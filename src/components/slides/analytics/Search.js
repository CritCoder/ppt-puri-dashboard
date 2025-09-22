import { useState } from 'react';
import { MdPeople, MdDirectionsCar } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

const Search = () => {
  const [searchType, setSearchType] = useState('people'); // people, vehicle, object
  
  return (
    <div className="w-full h-full bg-gray-900/50 p-6 rounded-lg mt-16">
      <div className="flex gap-4 mb-6">
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            searchType === 'people' ? 'bg-blue-500' : 'bg-gray-700'
          }`}
          onClick={() => setSearchType('people')}
        >
          <MdPeople /> People
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            searchType === 'vehicle' ? 'bg-blue-500' : 'bg-gray-700'
          }`}
          onClick={() => setSearchType('vehicle')}
        >
          <MdDirectionsCar /> Vehicle
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            searchType === 'object' ? 'bg-blue-500' : 'bg-gray-700'
          }`}
          onClick={() => setSearchType('object')}
        >
          <BiSearch /> Object
        </button>
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder={`Search for ${searchType}...`}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg pl-10"
        />
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {/* Example results - you can modify these based on searchType */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-gray-800 p-4 rounded-lg">
            <div className="w-full aspect-video bg-gray-700 rounded mb-2"></div>
            <div className="text-sm text-gray-300">Result {item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search; 