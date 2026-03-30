import { IoMdPaperPlane } from "react-icons/io";
import { GiTeamIdea } from "react-icons/gi";
import { CiCloudOn } from "react-icons/ci";
import { GrSecure } from "react-icons/gr";
import { SiGoogleanalytics, SiVercel } from "react-icons/si";
export const featureItems = [
  {
    title: "Project Planning",
    description:
      "Create, assign, and manage tasks with a drag-and-drop interface or calendar views.",
    logo: <IoMdPaperPlane size={20} color="#D9FF3F" />,
  },
  {
    title: "Team Collaboration",
    description:
      "Powerful Team Collaboration Tools to boost Streamline Communication for you.",
    logo: <GiTeamIdea size={20} color="#D9FF3F" />,
  },
  {
    title: "Live Insights",
    description:
      "Track performance instantly with accurate insights for smarter business decisions.",
    logo: <SiGoogleanalytics size={20} color="#D9FF3F" />,
  },
  {
    title: "Easy to Use",
    description:
      "Intuitive design lets anyone navigate, manage, and operate effortlessly.",
    logo: <CiCloudOn size={20} color="#D9FF3F" />,
  },
  {
    title: "Limitless Flexibility",
    description:
      "Adaptable platform empowers teams to customize workflows and scale effortlessly.",
    logo: <SiVercel size={20} color="#D9FF3F" />,
  },
  {
    title: "Secure at Scale",
    description:
      "Enterprise-level infrastructure built for reliability and scalability.",
    logo: <GrSecure size={20} color="#D9FF3F" />,
  },
];