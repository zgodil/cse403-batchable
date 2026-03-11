# frontend/app/api/endpoints
This directory contains type-safe async APIs for each kind of domain object in the system. These APIs extend a common interface, `CrudApi<T>`, which provides basic create, read, update, and delete operations. These are the only proper way to send request to the back-end, and `fetch` or even `fetchEndpoint/fetchJSON` should not be used directly.
