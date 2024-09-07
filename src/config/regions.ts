export interface RegionConfig {
    region: string;
    services: string[];
  }

  export const multiRegionConfig: RegionConfig[] = [
    {
      region: 'us-east-1',
      services: ['service-a', 'service-b', 'service-c'],
    },
    {
      region: 'us-west-2',
      services: ['service-a', 'service-b', 'service-c', 'service-d'],
    },
    {
      region: 'eu-west-1',
      services: ['service-a', 'service-b'],
    },
    {
      region: 'ap-southeast-1',
      services: ['service-a', 'service-c'],
    },
  ];

  // Helper function to get services for a specific region
  export function getServicesForRegion(region: string): string[] {
    const regionData = multiRegionConfig.find(r => r.region === region);
    return regionData ? regionData.services : [];
  }

  // Helper function to get all unique regions
  export function getAllRegions(): string[] {
    return multiRegionConfig.map(r => r.region);
  }