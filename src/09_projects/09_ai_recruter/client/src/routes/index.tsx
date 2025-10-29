import { lazy, Suspense, type ElementType } from "react";
import { RouterProvider, createHashRouter, Navigate } from "react-router";
import MainLayout from "@/components/layout/MainLayout";
import chatHistoryLoader from "@/pages/chat/chatHistoryLoader";

const Loader = () => <div>Loading...</div>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

const ANY_MATCH = "*";
export default function Routes() {
  const router = createHashRouter([
    {
      Component: MainLayout,
      children: [
        { index: true, element: <Navigate to={"/chat"} replace /> },
        {
          path: "/chat/:conversationId?",
          loader: chatHistoryLoader,
          Component: ChatPge,
        },
      ],
    },
    { path: "not-found", element: <Page404 /> },

    { path: ANY_MATCH, element: <Navigate to={"/not-found"} replace /> },
  ]);

  return <RouterProvider router={router} />;
}

// main layout pages
const ChatPge = Loadable(
  lazy(() => import("@/pages/chat/ChatPage"))
);

const Page404 = () => <div className="">404</div>;
