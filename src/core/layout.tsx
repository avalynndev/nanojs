import React from "react";
import type { LayoutComponent, PageComponent } from "../types.js";

export function withLayout(Layout: LayoutComponent, Page: PageComponent) {
  return function Wrapped(props: any) {
    return (
      <Layout>
        <Page {...props} />
      </Layout>
    );
  };
}
