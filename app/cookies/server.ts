import { createCookie } from "react-router";

export const accessTokenCookie = createCookie("accessToken", {
  httpOnly: false,
  sameSite: "strict",
  secure: false,
});
