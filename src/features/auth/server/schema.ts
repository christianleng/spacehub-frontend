import { z } from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export { schema };
