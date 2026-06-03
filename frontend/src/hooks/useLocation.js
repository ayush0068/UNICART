// hooks/useLocation.js
import { useState, useEffect, useCallback } from 'react';

const REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';

export const useLocation = () => {
  const [location, setLocation] = useState({
    status: 'idle', // idle | loading | success | denied | unavailable
    coordinates: null,
    address: null,
    city: '',
    area: '',
    pincode: '',
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Convert coordinates to address using reverse geocoding
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const url = `${REVERSE_GEOCODING_API}?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=en`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'MediCart App (contact@medicart.com)'
        }
      });
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      const address = data.address || {};
      
      return {
        fullAddress: data.display_name || '',
        city: address.city || address.town || address.village || address.county || '',
        area: address.suburb || address.neighbourhood || address.city_district || '',
        pincode: address.postcode || '',
        state: address.state || '',
        country: address.country || '',
        lat: lat,
        lon: lon,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Could not resolve address');
    }
  }, []);

  // Get current position using Geolocation API
  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    });
  }, []);

  // Fetch location with GPS
  const fetchLocation = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
      setLocation(prev => ({ ...prev, status: 'loading', error: null }));
    }

    try {
      // Request permission and get position
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      setLocation(prev => ({
        ...prev,
        coordinates: { lat: latitude, lon: longitude },
        status: 'loading',
      }));

      // Reverse geocode to get address
      const addressData = await reverseGeocode(latitude, longitude);
      
      setLocation({
        status: 'success',
        coordinates: { lat: latitude, lon: longitude },
        address: addressData.fullAddress,
        city: addressData.city,
        area: addressData.area,
        pincode: addressData.pincode,
        state: addressData.state,
        country: addressData.country,
        error: null,
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify({
        ...addressData,
        timestamp: Date.now(),
      }));
      
    } catch (error) {
      console.error('Location fetch error:', error);
      
      let errorStatus = 'unavailable';
      let errorMessage = 'Location unavailable';
      
      if (error.code === 1) {
        errorStatus = 'denied';
        errorMessage = 'Location access denied';
      } else if (error.code === 2) {
        errorMessage = 'Position unavailable';
      } else if (error.code === 3) {
        errorMessage = 'Location request timeout';
      }
      
      setLocation({
        status: errorStatus,
        coordinates: null,
        address: null,
        city: '',
        area: '',
        pincode: '',
        error: errorMessage,
      });
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [getCurrentPosition, reverseGeocode]);

  // Try to load cached location on mount
  useEffect(() => {
    const cachedLocation = localStorage.getItem('userLocation');
    if (cachedLocation) {
      try {
        const parsed = JSON.parse(cachedLocation);
        const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000; // 24 hours
        
        if (!isExpired) {
          setLocation({
            status: 'success',
            coordinates: { lat: parsed.lat, lon: parsed.lon },
            address: parsed.fullAddress,
            city: parsed.city,
            area: parsed.area,
            pincode: parsed.pincode,
            state: parsed.state,
            country: parsed.country,
            error: null,
          });
          return;
        }
      } catch (e) {
        console.error('Error parsing cached location:', e);
      }
    }
    
    // No valid cached location, fetch new one
    fetchLocation(true);
  }, [fetchLocation]);

  return {
    location,
    isLoading,
    fetchLocation,
    isLocationAvailable: location.status === 'success',
    locationDisplay: location.status === 'success' 
      ? `${location.area ? location.area + ', ' : ''}${location.city}${location.pincode ? ' ' + location.pincode : ''}`
      : '',
  };
};