const emptyTags = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(/\s+/);
const eventHandlerAttrs =
  `onabort onanimationcancel onanimationend onanimationiteration onanimationstart onauxclick onblur oncanplay
oncanplaythrough onchange onclick onclose oncontextmenu oncuechange ondblclick ondrag ondragend ondragenter ondragleave
ondragover ondragstart ondrop ondurationchange onemptied onended onerror OnErrorEventHandler onfocus onformdata
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

type HTMLChildren = (boolean | number | string | HTMLElement | HTMLChildren | '' | null | undefined)[];

function h(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tagName: string | (<T extends HTMLElement>(attrs: Record<string, any>) => T),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attrs: Record<string, any> = {},
  ...children: HTMLChildren
): Node {
  if (typeof tagName === 'function') return tagName({ ...attrs, children });

  let element: HTMLElement | null = null;
  if (tagName) element = document.createElement(tagName);

  const elementLike: HTMLElement | DocumentFragment = element || document.createDocumentFragment();

  if (attrs) {
    Object.entries(attrs).forEach(([i, value]) => {
      if (!element) return;
      if (eventHandlerAttrs.indexOf(i.toLowerCase()) !== -1) {
        element.addEventListener(i.substring(2), value);
      } else if (value !== false && value !== null && i !== setInnerHTMLAttr) {
        element?.setAttribute(DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i), value);
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
          else
            elementLike.appendChild(
              typeof child === 'string' || typeof child === 'number' || child === true
                ? document.createTextNode(`${child}`)
                : child,
            );
        }
      }
    }
  }

  return elementLike;
}

export default h;
