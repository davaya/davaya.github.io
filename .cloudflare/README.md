# GitHub Pages Hosting

W3C [recommends](https://www.w3.org/guide/editor/namespaces) that namespaces
used in its Recommendations be "available for retrieval using a corresponding
namespace URI". Information Model namespaces are location-independent identifiers
but providing a name-to-URL resolver makes them more easily accessible.
Content for the **jadn-im.cc** DNS domain is hosted on GitHub Pages, but because
Pages does not support direct web server control, the resolver is implemented
using this [index.js](index.js) route worker on the Cloudflare web proxy.