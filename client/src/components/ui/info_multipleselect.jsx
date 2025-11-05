import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchMultipartSelector = ({ onSelectionComplete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  // Mock API call - replace with your actual backend call
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Simulate API call
        const mockResults = await mockSearchAPI(searchQuery);
        setSearchResults(mockResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOptionSelect = (category, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category.id]: {
        ...category,
        selectedOption: option
      }
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveOption = (categoryId) => {
    const newOptions = { ...selectedOptions };
    delete newOptions[categoryId];
    setSelectedOptions(newOptions);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for options..."
          className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isSearching ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Selected Options */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {Object.values(selectedOptions).map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center bg-blue-50 rounded-full px-4 py-2"
            >
              <span className="text-sm font-medium text-blue-700">
                {category.label}: {category.selectedOption.label}
              </span>
              <button
                onClick={() => handleRemoveOption(category.id)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            {searchResults.map((category) => (
              <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{category.label}</span>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeCategory === category.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {category.options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOptionSelect(category, option)}
                          className="p-3 text-left rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-medium text-gray-800">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion State */}
      {Object.keys(selectedOptions).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button
            onClick={() => onSelectionComplete(selectedOptions)}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01]"
          >
            Complete Selection
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Mock API function - replace with your actual API call
const mockSearchAPI = async (query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data - in a real app, this would come from your backend
  const allCategories = [
    {
      id: 'color',
      label: 'Colors',
      options: [
        { value: 'red', label: 'Red', description: 'Vibrant red color' },
        { value: 'blue', label: 'Blue', description: 'Deep blue color' },
        { value: 'green', label: 'Green', description: 'Natural green' }
      ]
    },
    {
      id: 'size',
      label: 'Sizes',
      options: [
        { value: 's', label: 'Small', description: 'Perfect for kids' },
        { value: 'm', label: 'Medium', description: 'Standard adult size' },
        { value: 'l', label: 'Large', description: 'For taller people' }
      ]
    },
    {
      id: 'material',
      label: 'Materials',
      options: [
        { value: 'cotton', label: 'Cotton', description: '100% organic cotton' },
        { value: 'polyester', label: 'Polyester', description: 'Durable synthetic' },
        { value: 'wool', label: 'Wool', description: 'Natural and warm' }
      ]
    }
  ];

  // Filter based on search query
  return allCategories
    .map(category => ({
      ...category,
      options: category.options.filter(option => 
        option.label.toLowerCase().includes(query.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(query.toLowerCase())))
    }))
    .filter(category => category.options.length > 0);
};

export default SearchMultipartSelector;