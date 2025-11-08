import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    let data;

    if (type === 'solar') {
      // NASA POWER API for solar data
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      const endDate = new Date();
      
      const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
      const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

      const nasaUrl = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude}&latitude=${latitude}&start=${startDateStr}&end=${endDateStr}&format=JSON`;
      
      console.log('Fetching NASA POWER data:', nasaUrl);
      
      const response = await fetch(nasaUrl);
      
      if (!response.ok) {
        throw new Error(`NASA POWER API error: ${response.status}`);
      }

      const nasaData = await response.json();
      
      // Calculate average and monthly data
      const monthlyData = nasaData.properties.parameter.ALLSKY_SFC_SW_DWN;
      const values = Object.values(monthlyData) as number[];
      const average = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      
      // Get last 12 months for chart
      const months = Object.keys(monthlyData).slice(-12);
      const chartData = months.map(month => ({
        month: month.substring(4, 6),
        value: monthlyData[month]
      }));

      // Determine rating based on average
      let rating = 'Poor';
      if (average > 5) rating = 'Excellent';
      else if (average > 4) rating = 'Good';
      else if (average > 3) rating = 'Fair';

      data = {
        average: average.toFixed(1),
        rating,
        monthlyData: chartData,
        location: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`
      };

    } else if (type === 'airquality') {
      // OpenAQ API for air quality data
      const openaqUrl = `https://api.openaq.org/v2/latest?coordinates=${latitude},${longitude}&radius=50000&limit=1`;
      
      console.log('Fetching OpenAQ data:', openaqUrl);
      
      const response = await fetch(openaqUrl);
      
      if (!response.ok) {
        throw new Error(`OpenAQ API error: ${response.status}`);
      }

      const aqData = await response.json();
      
      if (!aqData.results || aqData.results.length === 0) {
        throw new Error('No air quality data available for this location');
      }

      const pm25Measurement = aqData.results[0].measurements.find((m: any) => m.parameter === 'pm25');
      
      if (!pm25Measurement) {
        throw new Error('PM2.5 data not available');
      }

      const pm25Value = pm25Measurement.value;
      
      // Determine quality level based on WHO guidelines
      let quality = 'Good';
      let qualityColor = 'green';
      if (pm25Value > 55) {
        quality = 'Unhealthy';
        qualityColor = 'red';
      } else if (pm25Value > 35) {
        quality = 'Moderate';
        qualityColor = 'orange';
      } else if (pm25Value > 15) {
        quality = 'Fair';
        qualityColor = 'yellow';
      }

      // Generate mock trend data (in real app, would fetch historical data)
      const trendData = Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        value: pm25Value * (0.8 + Math.random() * 0.4)
      }));

      data = {
        pm25: pm25Value.toFixed(1),
        quality,
        qualityColor,
        trendData,
        location: aqData.results[0].location
      };
    } else {
      throw new Error('Invalid data type requested');
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in climate-data function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
