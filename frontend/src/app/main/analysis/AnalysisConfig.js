import { FuseLoadable } from "@fuse";

export const AnalysisConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/analysis",
      component: FuseLoadable({
        loader: () => import("./Analysis")
      })
    }
  ]
};
