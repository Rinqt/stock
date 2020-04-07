import { FuseLoadable } from "@fuse";

export const HistoryConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/app/history",
      component: FuseLoadable({
        loader: () => import("./History")
      })
    }
  ]
};
