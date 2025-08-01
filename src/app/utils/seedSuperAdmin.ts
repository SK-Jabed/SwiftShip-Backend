/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super Admin Already Exist....");
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
      phone: "+8801869696969",
      address: {
        district: "xyz",
        city: "xyz",
        area: "xyz",
      },
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);

    console.log("Super Admin Created Successfully", superAdmin);
  } catch (error) {
    console.log(error);
  }
};
