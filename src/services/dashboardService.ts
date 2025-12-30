import { get } from "@/lib/api";
import type { Dashboard } from "@/types/dashboard";

const dashboardService = {
  getDashboard: async (): Promise<Dashboard> => {
    return get<Dashboard>("/dashboard");
  },
};

export default dashboardService;
