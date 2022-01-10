/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXInternal, NodeChild, NodeChildren } from './src/jsx.d';
import { FunctionComponent } from './src/main';

export { JSXInternal as JSX };

export function Fragment(attrs?: Record<string, any> & { children?: NodeChild }): DocumentFragment;

export function jsx(
  type: string,
  props: JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Record<string, any> & { children?: NodeChild },
): Node;

export function jsx<P>(type: FunctionComponent<P>, props: P & { children?: NodeChild }): Node;

export function jsxs(
  type: string,
  props: JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Record<string, any> & { children?: NodeChild[] },
): Node;

export function jsxs<P>(type: FunctionComponent<P>, props: P & { children?: NodeChild[] }): Node;

export function jsxDEV(
  type: string,
  props: JSXInternal.HTMLAttributes & JSXInternal.SVGAttributes & Record<string, any> & { children?: NodeChildren },
): Node;

export function jsxDEV<P>(type: FunctionComponent<P>, props: P & { children?: NodeChildren }): Node;
