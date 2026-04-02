export type SeoCountry = {
  name: string;
  slug: string;
  code?: string;
};

export const seoCountries: SeoCountry[] = [
  { name: "Monaco", slug: "monaco" },
  { name: "Liechtenstein", slug: "liechtenstein" },
  { name: "Singapore", slug: "singapore" },
  { name: "Luxembourg", slug: "luxembourg" },
  { name: "Ireland", slug: "ireland" },
  { name: "Macao (SAR)", slug: "macao" },
  { name: "Qatar", slug: "qatar" },
  { name: "Bermuda", slug: "bermuda" },
  { name: "Guyana", slug: "guyana" },
  { name: "Norway", slug: "norway" },
  { name: "Switzerland", slug: "switzerland" },
  { name: "Brunei", slug: "brunei" },
  { name: "United States", slug: "united-states" },
  { name: "UAE", slug: "uae" },
  { name: "Taiwan", slug: "taiwan" },
  { name: "Denmark", slug: "denmark" },
  { name: "Cayman Islands", slug: "cayman-islands" },
  { name: "Netherlands", slug: "netherlands" },
  { name: "San Marino", slug: "san-marino" },
  { name: "Iceland", slug: "iceland" },
  { name: "Malta", slug: "malta" },
  { name: "Hong Kong (SAR)", slug: "hong-kong" },
  { name: "Faroe Islands", slug: "faroe-islands" },
  { name: "Belgium", slug: "belgium" },
  { name: "Saudi Arabia", slug: "saudi-arabia" },
  { name: "Austria", slug: "austria" },
  { name: "Germany", slug: "germany" },
  { name: "Sweden", slug: "sweden" },
  { name: "Australia", slug: "australia" },
  { name: "Andorra", slug: "andorra" },
  { name: "Bahrain", slug: "bahrain" },
  { name: "Finland", slug: "finland" },
  { name: "Cyprus", slug: "cyprus" },
  { name: "Canada", slug: "canada" },
  { name: "France", slug: "france" },
  { name: "South Korea", slug: "south-korea" },
  { name: "United Kingdom", slug: "united-kingdom" },
  { name: "Italy", slug: "italy" },
  { name: "Czech Republic", slug: "czech-republic" },
  { name: "Slovenia", slug: "slovenia" },
  { name: "Lithuania", slug: "lithuania" },
  { name: "Poland", slug: "poland" },
  { name: "Spain", slug: "spain" },
  { name: "Israel", slug: "israel" },
  { name: "New Zealand", slug: "new-zealand" },
  { name: "Japan", slug: "japan" },
  { name: "Kuwait", slug: "kuwait" },
  { name: "Croatia", slug: "croatia" },
  { name: "Puerto Rico", slug: "puerto-rico" },
  { name: "Portugal", slug: "portugal" },
];

export const getSeoCountryBySlug = (slug: string): SeoCountry | undefined => {
  const normalized = slug.trim().toLowerCase();
  return seoCountries.find((country) => country.slug === normalized);
};
