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

  if (!route) return <div>404 Not Found</div>;

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
