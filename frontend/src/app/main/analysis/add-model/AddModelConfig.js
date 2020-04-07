import { FuseLoadable } from "@fuse";

export const AddModelConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/analysis/add/:id?",
      component: FuseLoadable({
        loader: () => import("./AddModel")
      })
    }
  ]
};
