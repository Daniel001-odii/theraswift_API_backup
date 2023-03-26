import { ExpressArgs } from "../types/generalTypes";

// root route controller
const rootRoute = ({ req, res }: ExpressArgs) => {
  res.status(200).json({
    welcome: "welcome to theraswift api",
  });
};

export default rootRoute;
