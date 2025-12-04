export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  website_url?: string;
}

export type BreweryList = Brewery[];