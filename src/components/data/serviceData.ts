// Define all valid category keys
export type CategoryType =
  | "aimodels"
  | "appdev"
  | "webdev"
  | "uiux"
  | "seo"
  | "cloud";

// Export list of categories
export const categories: CategoryType[] = [
  "aimodels",
  "appdev",
  "webdev",
  "uiux",
  "seo",
  "cloud",
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
  aimodels: {
    title: "AI Models & Automation",
    duration: "30 Minutes",
    price: "$120,000",
    image: "/assets/Home/serviceData/photo/fullstackbg.png",
  },
  appdev: {
    title: "App Development",
    duration: "30 Minutes",
    price: "$150,000",
    image: "/assets/Home/serviceData/photo/applicationbg.png",
  },
  webdev: {
    title: "Web Development",
    duration: "30 Minutes",
    price: "$100,000",
    image: "/assets/Home/serviceData/photo/websitebg.png",
  },
  uiux: {
    title: "UI/UX Design",
    duration: "30 Minutes",
    price: "$70,000",
    image: "/assets/Home/serviceData/photo/uiuxbg.png",
  },
  seo: {
    title: "SEO & Growth Optimization",
    duration: "30 Minutes",
    price: "$50,000",
    image: "/assets/Home/serviceData/photo/seobg.png",
  },
  cloud: {
    title: "Cloud Services",
    duration: "30 Minutes",
    price: "$130,000",
    image: "/assets/Home/serviceData/photo/fullstackbg.png",
  },
};
