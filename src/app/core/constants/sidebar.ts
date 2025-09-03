import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import type { Icon as TablerIcon } from "@tabler/icons-react";

interface NavItemBase {
  title: string;
  url: string;
  icon?: TablerIcon;
  isActive?: boolean;
}

type SimpleNavItem = NavItemBase & {
  icon: TablerIcon;
};

interface DocumentItem {
  name: string;
  url: string;
  icon: TablerIcon;
}

interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

interface SidebarItems {
  user: SidebarUser;
  navMain: SimpleNavItem[];
  navSecondary: SimpleNavItem[];
  documents: DocumentItem[];
}

export const SIDEBAR_ITEMS: SidebarItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard }, // Vue synthèse : réservations du jour, revenus, taux d’occupation.
    { title: "Reservations", url: "#", icon: IconListDetails }, // Gestion des bookings (salles, bureaux, équipements)
    { title: "Resources", url: "#", icon: IconChartBar }, // Configuration des ressources (ajouter salle, bureau, capacity)
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
  documents: [
    { name: "Reports", url: "#", icon: IconDatabase }, // Exports PDF/CSV, historiques.
    { name: "Documents", url: "#", icon: IconReport }, // Contrats, conditions, onboarding docs.
  ],
};
