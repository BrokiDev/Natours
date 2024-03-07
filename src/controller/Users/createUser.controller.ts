import { Props } from "../../types";

export const createNewUser = ({ req, res }: Props) => {
    res.status(500).json({
      status: "error",
      message: "This route is not defined yet",
    });
  };