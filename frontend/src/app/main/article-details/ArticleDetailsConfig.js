import { FuseLoadable } from "@fuse";

export const ArticleDetailsConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/article/:id",
      component: FuseLoadable({
        loader: () => import("./ArticleDetails")
      })
    }
  ]
};
