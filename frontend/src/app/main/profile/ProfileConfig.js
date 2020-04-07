import { FuseLoadable } from "@fuse";

export const ProfileConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/profile",
      component: FuseLoadable({
        loader: () => import("./Profile")
      })
    }
  ]
};
