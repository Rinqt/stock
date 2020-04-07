import { FuseLoadable } from "@fuse";

export const LoginPageConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/auth/login",
      component: FuseLoadable({
        loader: () => import("./LoginPage")
      })
    }
  ]
};
