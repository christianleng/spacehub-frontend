import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { schema } from "./schema";
import { executeAction } from "@/lib/executeAction";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();

      const validatedData = schema.parse({ email, password });
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      await db.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          password: hashedPassword,
        },
      });
    },
  });
};

export { signUp };
