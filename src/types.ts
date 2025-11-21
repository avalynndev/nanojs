import type { ReactNode, FC } from "react";
import type { Request, Response } from "express";

export type PageComponent<P = {}> = (props: P) => ReactNode;

export type LayoutComponent = FC<{ children?: ReactNode }>;

export type APIRequest = Request & {
  params: Record<string, string>;
};

export type APIResponse<T = any> = Response<T>;

export type APIHandler<T = any> = (
  req: APIRequest,
  res: APIResponse<T>
) => void | Promise<void>;
