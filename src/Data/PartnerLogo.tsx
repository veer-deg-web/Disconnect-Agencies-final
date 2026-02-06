import React from "react";
import {
  SiGooglecloud,
  SiAmazon,
  SiOpenai,
  SiStripe,
  SiSlack,
  SiNotion,
  SiSalesforce,
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";

/* =========================
   TYPE (SAFE & LOCAL)
========================= */
export type PartnerLogo = {
  node: React.ReactNode;
  title: string;
  href?: string;
};

/* =========================
   CONFIG
========================= */
const ICON_SIZE = 44;
const ICON_COLOR = "rgba(255,255,255,0.75)";

/* =========================
   DATA
========================= */
export const partnerLogos: PartnerLogo[] = [
  {
    node: <SiGooglecloud size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Google Cloud",
    href: "https://cloud.google.com",
  },
  {
    node: <SiAmazon size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Amazon Web Services",
    href: "https://aws.amazon.com",
  },
  {
    node: <FaMicrosoft size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Microsoft Azure",
    href: "https://azure.microsoft.com",
  },
  {
    node: <SiOpenai size={ICON_SIZE} color={ICON_COLOR} />,
    title: "OpenAI",
    href: "https://openai.com",
  },
  {
    node: <SiStripe size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Stripe",
    href: "https://stripe.com",
  },
  {
    node: <SiSlack size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Slack",
    href: "https://slack.com",
  },
  {
    node: <SiNotion size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Notion",
    href: "https://notion.so",
  },
  {
    node: <SiSalesforce size={ICON_SIZE} color={ICON_COLOR} />,
    title: "Salesforce",
    href: "https://salesforce.com",
  },
];