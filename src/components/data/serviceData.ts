// Define all valid category keys
export type CategoryType =
  | "website"
  | "application"
  | "uiux"
  | "seo"
  | "fullstack";

// Export list of categories
export const categories: CategoryType[] = [
  "website",
  "application",
  "uiux",
  "seo",
  "fullstack",
];

// Define the service data object with proper typing
export const serviceData: Record<
  CategoryType,
  {
    title: string;
    duration: string;
    price: string;
    image: string;
  }
> = {
  website: {
    title: "Website Development",
    duration: "30 Minutes",
    price: "$100,000",
    image: "/websitebg.png",
  },
  application: {
    title: "Application Development",
    duration: "30 Minutes",
    price: "$150,000",
    image: "/applicationbg.png",
  },
  uiux: {
    title: "UI/UX Design",
    duration: "30 Minutes",
    price: "$70,000",
    image: "/uiuxbg.png",
  },
  seo: {
    title: "SEO Optimization",
    duration: "30 Minutes",
    price: "$50,000",
    image: "/seobg.png",
  },
  fullstack: {
    title: "Full Stack Development",
    duration: "30 Minutes",
    price: "$200,000",
    image: "/fullstackbg.png",
  },
};
