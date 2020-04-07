import { FuseLoadable } from "@fuse";

export const MailConfirmPageConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: "/auth/mail-confirm/:username/:email",
      component: FuseLoadable({
        loader: () => import("./MailConfirmPage")
      })
    }
  ]
};
