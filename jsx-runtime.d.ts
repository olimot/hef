/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/preactjs/preact/blob/master/jsx-runtime/src/index.d.ts
import { NodeChild, NodeChildren, FunctionComponent } from './lib/main';

export function Fragment(attrs?: Record<string, any> & { children?: NodeChild }): DocumentFragment;

export function jsx(
  type: string,
  props: JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any> & { children?: NodeChild },
): Node;

export function jsx<P>(type: FunctionComponent<P>, props: P & { children?: NodeChild }): Node;

export function jsxs(
  type: string,
  props: JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any> & { children?: NodeChild[] },
): Node;

export function jsxs<P>(type: FunctionComponent<P>, props: P & { children?: NodeChild[] }): Node;

export function jsxDEV(
  type: string,
  props: JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any> & { children?: NodeChildren },
): Node;

export function jsxDEV<P>(type: FunctionComponent<P>, props: P & { children?: NodeChildren }): Node;
