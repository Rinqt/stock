import { FuseLoadable } from "@fuse";

export const ResetPasswordPageConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/auth/reset-password",
      component: FuseLoadable({
        loader: () => import("./ResetPasswordPage")
      })
    }
  ]
};
