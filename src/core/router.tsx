import React from "react";

export type Route = {
  path: string;
  component: React.FC<any>;
  layout?: React.FC<{ children: React.ReactNode }>;
};

export type RouterConfig = Route[];

type RouterContextType = {
  push: (path: string) => void;
  currentPath: string;
};

const RouterContext = React.createContext<RouterContextType | null>(null);

export function useRouter() {
  const ctx = React.useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside <RouterProvider>");
  return ctx;
}

/* ------------------------------
   Store global router config
--------------------------------*/
let globalRoutes: RouterConfig = [];

export function createRouter(routes: RouterConfig) {
  globalRoutes = routes;
}

/* ------------------------------
   Router provider
--------------------------------*/
export function RouterProvider() {
  const [currentPath, setCurrentPath] = React.useState(
    window.location.pathname
  );

  const push = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  React.useEffect(() => {
    const handler = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const route = globalRoutes.find((r) => r.path === currentPath);

  if (!route)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "#000",
          padding: "20px",
          flexDirection: "row",
        }}
      >
        <h1
          style={{
            display: "inline-block",
            margin: "0 20px 0 0",
            padding: "0 23px 0 0",
            fontSize: "24px",
            fontWeight: 500,
            verticalAlign: "top",
            lineHeight: "49px",
            borderRight: "1px solid rgba(0,0,0,0.3)",
          }}
        >
          404
        </h1>
        <div style={{ display: "inline-block" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "49px",
              margin: 0,
            }}
          >
            This page could not be found.
          </h2>
        </div>
      </div>
    );

  const Page = route.component;
  const Layout = route.layout ?? React.Fragment;

  return (
    <RouterContext.Provider value={{ push, currentPath }}>
      <Layout>
        <Page />
      </Layout>
    </RouterContext.Provider>
  );
}
