# Batchable
Our product is Batchable, a real-time food delivery batching system. It works as a web application that interfaces with medium-sized restaurants, constantly checking if orders should go out as singles, doubles, or triples, using live updates about new orders, readiness, and remakes. Typically, dispatchers have to balance delivery times, food freshness, and how drivers are used–all while handling new orders, remakes, and cancellations. For medium-sized restaurants, this is inevitably done by hand, which leads to inconsistent results and avoidable delivery problems. That’s where Batchable comes in. We will handle this delicate balance for businesses, leading to simpler workflows, fewer headaches, and better resource utilization.

Try it at [batchable.org](https://batchable.org)!

A link to our requirements and plan can be found here: [Batchable](https://docs.google.com/document/d/1lBQPrSYdc8PdP-THlGFKEYEQGw-icpVO-P4352XmHsA/edit?usp=sharing)

## Developer Guidelines
See [`docs/DEVELOPER.md`](./docs/DEVELOPER.md) for details on how to install, run, test, and contribute to Batchable.

## User Documentation
If you are a Batchable user, documentation of the product's features and use can be found in [`docs/USER.md`](./docs/USER.md).

## Final Release
Final Release Tag: `final`
Features:
- Secure login.
- An order and driver overview for the restaurant employee that displays order details, including order time, promised time, prep time, customer information, and driver information. 
- Delivery details are texted to the driver. The driver has a web interface to communicate about order and route completion.
- Ability to add orders, mark orders as remakes, and cancel orders.
- Ability to modify restaurant details, including adding/editing drivers and menu items.
- Robust and efficient batching logic that edits and assigns batched orders to drivers in real-time (with orders rebatched based on new information/order changes).
- A public URL: [batchable.org](https://batchable.org).

## AI credit
We used various genAIs to assist in creating this project.
- DeepSeek for refactoring the Batching Manager and Batching Algorithm, and creating/fixing additional corresponding tests.
- Codex for code reviews on the front-end.
- Cursor integrating Auth0 and Twilio.
