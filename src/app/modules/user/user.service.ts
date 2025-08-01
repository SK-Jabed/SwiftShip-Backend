import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  //   const isUserExist = await User.findOne({ email });
  //   if (isUserExist) {
  //     throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  //   }

  //   const hashedPassword = await bcryptjs.hash(
  //     password as string,
  //     Number(envVars.BCRYPT_SALT_ROUND)
  //   );
  //   // console.log(hashedPassword)

  //   const isPasswordMatched = await bcryptjs.compare(
  //     password as string,
  //     hashedPassword
  //   );
  //   console.log(isPasswordMatched);

  //   const authProvider: IAuthProviders = {
  //     provider: "credentials",
  //     providerId: email as string,
  //   };
  const user = await User.create({
    name,
    email,
    // password: hashedPassword,
    // auths: [authProvider],
    // ...rest,
  });
  return user;
  // return {}
};

// const getAllUsers = async (role: string) => {
//   const query = role ? { role } : {};

//   const users = await User.find(query);

//   const total = await User.countDocuments();
//   return {
//     users,
//     total,
//   };
// };

const getAllUsers = async () => {
  const users = await User.find();
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
