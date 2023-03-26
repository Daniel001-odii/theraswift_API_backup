import { ExpressArgs } from "../types/generalTypes";

// signup users
const login = ({ req, res }: ExpressArgs) => {
  res.status(200).send("yoroshku to login");
};

export default login;
