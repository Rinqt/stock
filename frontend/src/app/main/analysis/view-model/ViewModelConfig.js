import { FuseLoadable } from "@fuse";

export const ViewModelConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/analysis/view/:id",
      component: FuseLoadable({
        loader: () => import("./ViewModel")
      })
    }
  ]
};
