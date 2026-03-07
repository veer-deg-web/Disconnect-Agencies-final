export type SeoCity = {
  name: string;
  slug: string;
  aliases?: string[];
};

export const seoCities: SeoCity[] = [
  { name: "Delhi", slug: "delhi" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Bengaluru", slug: "bengaluru", aliases: ["bangalore"] },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Chennai", slug: "chennai" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Jaipur", slug: "jaipur" },
  { name: "Lucknow", slug: "lucknow" },
  { name: "Bhopal", slug: "bhopal" },
  { name: "Patna", slug: "patna" },
  { name: "Raipur", slug: "raipur" },
  { name: "Ranchi", slug: "ranchi" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Shimla", slug: "shimla" },
  { name: "Dehradun", slug: "dehradun" },
  { name: "Gangtok", slug: "gangtok" },
  { name: "Aizawl", slug: "aizawl" },
  { name: "Agartala", slug: "agartala" },
  { name: "Kohima", slug: "kohima" },
  { name: "Itanagar", slug: "itanagar" },
  { name: "Dispur", slug: "dispur" },
  { name: "Panaji", slug: "panaji" },
  { name: "Thiruvananthapuram", slug: "thiruvananthapuram", aliases: ["trivandrum"] },
  { name: "Amaravati", slug: "amaravati" },
  { name: "Gandhinagar", slug: "gandhinagar" },
  { name: "Shillong", slug: "shillong" },
  { name: "Imphal", slug: "imphal" },
  { name: "Bhubaneswar", slug: "bhubaneswar" },
  { name: "Srinagar", slug: "srinagar" },
  { name: "Leh", slug: "leh" },
  { name: "Pune", slug: "pune" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Surat", slug: "surat" },
  { name: "Noida", slug: "noida" },
  { name: "Gurgaon", slug: "gurgaon" },
  { name: "Faridabad", slug: "faridabad" },
  { name: "Ghaziabad", slug: "ghaziabad" },
  { name: "Indore", slug: "indore" },
  { name: "Nagpur", slug: "nagpur" },
  { name: "Kanpur", slug: "kanpur" },
  { name: "Varanasi", slug: "varanasi" },
  { name: "Ludhiana", slug: "ludhiana" },
  { name: "Coimbatore", slug: "coimbatore" },
  { name: "Madurai", slug: "madurai" },
  { name: "Vijayawada", slug: "vijayawada" },
  { name: "Visakhapatnam", slug: "visakhapatnam" },
  { name: "Mysuru", slug: "mysuru" },
  { name: "Trivandrum", slug: "trivandrum", aliases: ["thiruvananthapuram"] },
];

export const getSeoCityBySlug = (slug: string): SeoCity | undefined => {
  const normalized = slug.trim().toLowerCase();
  return seoCities.find(
    (city) => city.slug === normalized || (city.aliases ?? []).includes(normalized),
  );
};

