import type { RouteConfig } from "@react-router/dev/routes";
import { route ,index, layout} from "@react-router/dev/routes";

export default [
  layout("layouts/sidebar.tsx",[
    index("routes/home.tsx"),
    route("contacts/:contactId", "routes/contact.tsx"),
    route(
      "contacts/:contactId/edit",
      "routes/edit-contact.tsx"
    )
  ]),
  route("about", "routes/about.tsx"),
  // route("login", "routes/login.tsx"),
  // route("register", "routes/register.tsx"),
  // route("favorites", "routes/favorites.tsx"),
  // route("search", "routes/search.tsx"),
] satisfies RouteConfig;
