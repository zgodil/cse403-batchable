## High Level Goal
Debug the front and backend apis for the Gamma release. Expand the functionality of Auth and Twilio. Add menu-item page for the front end.

## Original Goals for the Week
- Emily: Skeleton for Backend Webserver & Batching manager: 2-3 hrs, Basic batching algorithm and integrating it with google api: 3-4 hrs, keep adding to these components: Unknown
- Qalid: Fill in the skeleton for the Twilio Manager. 3 hours
- Zane: Fill in skeleton for batching manager, and finish off CI tests for DB Manager. 3 hours
- Ben: Dashboard: Add Order, View Orders, View Routes, View Drivers. Adding UI for Restaurant Page. Time estimate: Sunday night.
- Delano: Fill in the skeleton for the Backend Web Server. Time estimate: 3 hours
- H: Restaurant Page (View/Edit Restaurant, View/Edit Drivers, View/Edit Menu Items) based on Ben's design. Time estimate: 5-6 hours 

## Progress and Issues
- We were able to achieve the most of our goals of connecting the front-end and back-end. However, some of the APIs between the front-end and back-end still have bugs in it so not all the communication paths work yet. 

## Questions for the Product Owner
Is there an expected minimum per person (# of PRs, # of comments, # of review cycles), or is it purely judged by meaningful attempt and effort?

## Goals for Next Week
We have noticed that a lot of our work this week is debugging the different components. 
- Emily: Fix bugs in API controllers and the batching manager to connect the front end: Unknown

- Qalid: Expand twilio functionality to allow texts: 3 hrs

- Zane: Debug the database objects, the services, and rename the database objects for alignment with JSON form from the front end: 5 hours

- Ben: Dashboard: Fixing minor issues in the restaurant page. If needed, helping H with dashboard page workload. Implementing notifications for dashboard page whenever events happen. If possible, adding a map to display orders and routes: 5 hours

- Delano: Expand the authentication functionality and debug it: 5 hours

- H: Removing as many type assertions as possible, 
Verifying JSON format matching with some back-end team member(s), Adding menu items to the "add order" modal, Replacing the 1500ms "websocket" with a real one: 5 hours
