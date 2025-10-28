import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Layout from "./Layout";

const Page1 = lazy(() => import("@pages/Page1"));
const Page2 = lazy(() => import("@pages/Page2"));
const Page3 = lazy(() => import("@pages/Page3"));

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Page1,
      },
      {
        path: "/page2",
        Component: Page2,
      },
      {
        path: "/page3",
        Component: Page3,
      },
    ],
  },
]);

export default router;
