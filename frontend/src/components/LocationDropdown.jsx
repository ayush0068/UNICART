// components/LocationDropdown.jsx
import React, { useState } from 'react';

const LocationDropdown = ({ location, isLoading, onRefresh, onClose }) => {
  const [manualPincode, setManualPincode] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualPincode.trim()) {
      // Handle manual pincode input
      console.log('Manual pincode:', manualPincode);
      onClose();
    }
  };

  const getStatusIcon = () => {
    switch (location.status) {
      case 'loading':
        return <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>;
      case 'denied':
        return <i className="bi bi-geo-alt-slash text-red-500 text-xl"></i>;
      case 'unavailable':
        return <i className="bi bi-wifi-off text-yellow-500 text-xl"></i>;
      default:
        return <i className="bi bi-check-circle-fill text-green-500 text-xl"></i>;
    }
  };

  const getStatusMessage = () => {
    switch (location.status) {
      case 'loading':
        return 'Fetching your location...';
      case 'denied':
        return 'Location access is turned off';
      case 'unavailable':
        return 'Could not detect your location';
      case 'success':
        return 'Location detected successfully';
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2.5 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-700 text-gray-900">Delivery Location</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="bi bi-x-lg text-sm"></i>
          </button>
        </div>
        
        {/* Current Location Status */}
        <div className={`p-3 rounded-xl mb-3 ${
          location.status === 'success' ? 'bg-green-50 border border-green-200' :
          location.status === 'denied' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className={`text-sm font-600 ${
                location.status === 'success' ? 'text-green-800' :
                location.status === 'denied' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                {getStatusMessage()}
              </p>
              {location.status === 'success' && location.address && (
                <>
                  <p className="text-sm text-gray-700 mt-1 font-500">
                    {location.area && `${location.area}, `}{location.city}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {location.pincode}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <i className="bi bi-geo-alt-fill text-brand-500 text-xs"></i>
                    Accurate to {location.coordinates ? 'GPS coordinates' : 'address'}
                  </p>
                </>
              )}
              {location.status === 'denied' && (
                <button 
                  onClick={() => {
                    alert('Please enable location access in your browser settings and refresh the page.');
                  }}
                  className="text-xs text-brand-600 font-600 mt-2 hover:underline"
                >
                  How to enable location access?
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 border-2 border-brand-400 text-brand-600 hover:bg-brand-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              Detecting...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-repeat text-base"></i>
              Detect my current location
            </>
          )}
        </button>
      </div>

      {/* Manual Entry Toggle */}
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setIsManualMode(!isManualMode)}
          className="w-full flex items-center justify-between text-sm font-600 text-gray-700 hover:text-brand-600 transition-colors"
        >
          <span>Enter address manually</span>
          <i className={`bi bi-chevron-down text-xs transition-transform ${isManualMode ? 'rotate-180' : ''}`}></i>
        </button>
        
        {isManualMode && (
          <form onSubmit={handleManualSubmit} className="mt-3">
            <input
              type="text"
              value={manualPincode}
              onChange={(e) => setManualPincode(e.target.value)}
              placeholder="Enter pincode or city name"
              className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-brand-400 transition-colors mb-2"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 text-white text-sm font-600 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Set Location
            </button>
          </form>
        )}
      </div>

      {/* Location Benefits */}
      <div className="p-4 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          <i className="bi bi-shield-check mr-1"></i>
          Accurate location helps us show delivery options and estimated delivery time
        </p>
      </div>
    </div>
  );
};

export default LocationDropdown;