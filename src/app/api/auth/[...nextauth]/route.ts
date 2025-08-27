export const runtime = "nodejs";

import { handlers } from "@/features/auth/server/auth";

export const { GET, POST } = handlers;
