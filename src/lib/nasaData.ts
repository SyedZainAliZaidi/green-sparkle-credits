export interface SolarData {
  solarIrradiance: string;
  solarPotential: 'Excellent' | 'Good' | 'Moderate';
  recommendation: string;
}

export interface CityCoordinates {
  lat: number;
  lng: number;
}

// Default Pakistan cities coordinates
export const PAKISTAN_CITIES: Record<string, CityCoordinates> = {
  'Islamabad': { lat: 33.6844, lng: 73.0479 },
  'Lahore': { lat: 31.5204, lng: 74.3587 },
  'Karachi': { lat: 24.8607, lng: 67.0011 },
  'Peshawar': { lat: 34.0151, lng: 71.5249 },
  'Quetta': { lat: 30.1798, lng: 66.9750 },
  'Multan': { lat: 30.1575, lng: 71.5249 },
  'Faisalabad': { lat: 31.4504, lng: 73.1350 },
  'Rawalpindi': { lat: 33.5651, lng: 73.0169 },
};

// Fallback data for Islamabad (in case API fails)
const FALLBACK_DATA: SolarData = {
  solarIrradiance: '5.2',
  solarPotential: 'Excellent',
  recommendation: 'Pakistan has excellent solar potential! Consider solar cooking alongside your clean cookstove.',
};

export async function getNASAPowerData(
  latitude: number,
  longitude: number
): Promise<SolarData | null> {
  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude}&latitude=${latitude}&format=JSON`;

  try {
    console.log(`Fetching NASA POWER data for (${latitude}, ${longitude})`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NASA POWER API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.properties?.parameter?.ALLSKY_SFC_SW_DWN) {
      throw new Error('Invalid data structure from NASA POWER API');
    }

    const solarData = data.properties.parameter.ALLSKY_SFC_SW_DWN;
    
    // Calculate annual average from monthly data
    const monthlyValues = Object.values(solarData) as number[];
    const annualAverage = monthlyValues.reduce((a, b) => a + b, 0) / 12;
    
    // Determine solar potential rating
    let solarPotential: 'Excellent' | 'Good' | 'Moderate';
    let recommendation: string;

    if (annualAverage > 5) {
      solarPotential = 'Excellent';
      recommendation = 'Pakistan has excellent solar potential! Consider solar cooking alongside your clean cookstove.';
    } else if (annualAverage > 4) {
      solarPotential = 'Good';
      recommendation = 'Good solar potential in this region. Solar energy can supplement your clean cooking technologies.';
    } else {
      solarPotential = 'Moderate';
      recommendation = 'Solar energy is viable in Pakistan as a supplement to clean cooking technologies.';
    }

    console.log('NASA POWER data fetched successfully:', {
      solarIrradiance: annualAverage.toFixed(2),
      solarPotential,
    });

    return {
      solarIrradiance: annualAverage.toFixed(2),
      solarPotential,
      recommendation,
    };
  } catch (error) {
    console.error('NASA POWER API error:', error);
    return null;
  }
}

export function getFallbackData(): SolarData {
  return FALLBACK_DATA;
}

export async function getSolarDataForCity(cityName: string): Promise<SolarData> {
  const coordinates = PAKISTAN_CITIES[cityName];
  
  if (!coordinates) {
    console.warn(`City ${cityName} not found, using Islamabad as default`);
    return getFallbackData();
  }

  const data = await getNASAPowerData(coordinates.lat, coordinates.lng);
  
  // Return fallback data if API fails
  return data || getFallbackData();
}
