import { FuseLoadable } from "@fuse";

export const CompanyDetailsConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/company/:companySymbol",
      component: FuseLoadable({
        loader: () => import("./CompanyDetails")
      })
    }
  ]
};
