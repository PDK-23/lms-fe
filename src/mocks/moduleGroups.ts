import type { ModuleGroup } from "@/types";

export const MOCK_MODULE_GROUPS: ModuleGroup[] = [
  {
    id: "mg1",
    name: "Content Management",
    description: "Manage courses, modules, and educational content",
    icon: "FolderOpen",
    url: "/admin/content",
    createdById: "user1",
    createdAt: new Date("2024-01-01"),
    updatedById: "user1",
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mg2",
    name: "User Management",
    description: "Manage users, roles, and permissions",
    icon: "UsersRound",
    url: "/admin/user-management",
    createdById: "user1",
    createdAt: new Date("2024-01-15"),
    updatedById: "user1",
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "mg3",
    name: "System Settings",
    description: "System configuration and administration",
    icon: "Cog",
    url: "/admin/system",
    createdById: "user1",
    createdAt: new Date("2024-02-01"),
    updatedById: "user1",
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "mg4",
    name: "Analytics",
    description: "Reports, statistics and analytics",
    icon: "PieChart",
    url: "/admin/analytics",
    createdById: "user1",
    createdAt: new Date("2024-03-01"),
    updatedById: "user1",
    updatedAt: new Date("2024-03-01"),
  },
];

export default MOCK_MODULE_GROUPS;
