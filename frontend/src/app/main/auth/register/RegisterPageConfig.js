import { FuseLoadable } from "@fuse";

export const RegisterPageConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/auth/register",
      component: FuseLoadable({
        loader: () => import("./RegisterPage")
      })
    }
  ]
};
