/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXInternal, NodeChildren, Ref } from './jsx.d';

export { JSXInternal as JSX };

const emptyTags = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(/\s+/);
const eventHandlerAttrs =
  `onabort onanimationcancel onanimationend onanimationiteration onanimationstart onauxclick onblur oncanplay
oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave
ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata
ongotpointercapture oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart
onlostpointercapture onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onpause onplay
onplaying onpointercancel onpointerdown onpointerenter onpointerleave onpointermove onpointerout onpointerover
onpointerup onprogress onratechange onreset onresize onscroll onseeked onseeking onselect onselectionchange
onselectstart onstalled onsubmit onsuspend ontimeupdate ontoggle ontouchcancel ontouchend ontouchmove ontouchstart
ontransitioncancel ontransitionend ontransitionrun ontransitionstart onvolumechange onwaiting onanimationend
onwebkitanimationend onanimationiteration onwebkitanimationiteration onanimationstart onwebkitanimationstart
ontransitionend onwebkittransitionend onwheel`.split(/\s+/);

// escape an attribute
const map: Record<string, string> = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' };
const esc = (str: string) => String(str).replace(/[&<>"']/g, (s) => `&${map[s]};`);
const setInnerHTMLAttr = 'dangerouslySetInnerHTML';
const DOMAttributeNames: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
};

export interface FunctionComponent<P = Record<string, never>> {
  (props: P & { children?: NodeChildren; ref?: Ref<any> }, context?: any): Node | null;
  displayName?: string;
  defaultProps?: Partial<P>;
}

export function h(
  tagName: string | (<T extends HTMLElement>(attrs: Record<string, any>) => T),
  attrs: Record<string, any> = {},
  ...children: any[]
): Node {
  if (typeof tagName === 'function') return tagName({ ...attrs, children });

  const element: HTMLElement = document.createElement(tagName);

  let ref = null;

  if (attrs) {
    Object.entries(attrs).forEach(([i, value]) => {
      if (!element) return;
      if (i === 'ref') {
        if (typeof value === 'function') ref = value;
        else if (typeof value === 'object' && value) Object.assign(value, { current: element });
      } else if (i.toLowerCase() === 'style' && value && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (eventHandlerAttrs.indexOf(i.toLowerCase()) !== -1) {
        element.addEventListener(i.substring(2).toLowerCase(), value);
      } else if (value !== false && value !== null && i !== setInnerHTMLAttr) {
        element.setAttribute(DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i), value);
      }
    });
  }

  if (emptyTags.indexOf(tagName) === -1) {
    if (element && attrs && attrs[setInnerHTMLAttr]) {
      // eslint-disable-next-line no-underscore-dangle
      element.innerHTML = attrs[setInnerHTMLAttr].__html;
    } else {
      while (children.length) {
        const child = children.shift();
        if (child) {
          if (child instanceof Array) children.unshift(...child);
          else element.appendChild(child instanceof Node ? child : document.createTextNode(`${child}`));
        }
      }
    }
  }

  if (ref) (ref as any)(element);
  return element;
}

export function Fragment(attrs: Record<string, any> & { ref?: Ref<DocumentFragment>; children?: any[] } = {}) {
  const fragment = document.createDocumentFragment();

  const { children } = attrs;
  while (children && children.length) {
    const child = children.shift();
    if (child) {
      if (child instanceof Array) children.unshift(...child);
      else fragment.appendChild(child instanceof Node ? child : document.createTextNode(`${child}`));
    }
  }

  if (attrs.ref && typeof attrs.ref === 'function') attrs.ref(fragment);
  else if (attrs.ref && typeof attrs.ref === 'object') Object.assign(attrs.ref, { current: fragment });
  return fragment;
}

h.h = h;
h.createElement = h;
h.Fragment = Fragment;

export default h;
