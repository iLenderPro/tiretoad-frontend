import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locations = await getLocations();
  const map = locations
    .map((state: { code: string; name: string; cities: { name: string }[] }) => [
      {
        url: `https://tiretoad.com/location/${state.code}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
      },
      ...state.cities.map((city) => ({
        url: `https://tiretoad.com/location/${state.code}/${city.name}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
      })),
    ])
    .reduce((acc: any, cur: any) => acc.concat(cur), []);
  return map;
}

async function getLocations() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/geo/locations`);
  return await response.json();
}
