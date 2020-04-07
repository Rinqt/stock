import { FuseLoadable } from "@fuse";

export const CompaniesConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/companies",
      component: FuseLoadable({
        loader: () => import("./Companies")
      })
    }
  ]
};
