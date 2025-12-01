import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/quiz", "routes/quiz.tsx"),
  route("/score", "routes/score.tsx"),
] satisfies RouteConfig;
