import { Props } from "../../types";

export const deleteUser = ({ req, res }: Props) => {
    res.status(500).json({
      status: "error",
      message: "This route is not defined yet",
    });
  };