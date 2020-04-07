import { FuseLoadable } from "@fuse";

export const CompareModelConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/analysis/compare/:source/:target",
      component: FuseLoadable({
        loader: () => import("./CompareModels")
      }),
      exact: true
    }
  ]
};
