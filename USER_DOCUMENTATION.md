# Batchable User Documentation

## 1. Description
Batchable is a real-time food delivery batching system designed for medium-sized restaurants. It helps restaurant staff determine whether orders should be dispatched individually or grouped into double or triple batches.

Restaurant dispatching often requires balancing:
* Delivery times
* Food freshness
* Driver availability
* New incoming orders
* Remakes and cancellations

Batchable simplifies this process by automating order handling the batching process.

## 2. How to Run the Software
Visit [batchable.org](https://batchable.org) and create an account. This will create a new restaurant associated with your account, which you can then configure and use for delivery batching. 

**Hint**: Read how to use the software (below) first. There are some important notes that are paramount for avoiding basic errors.

## 3. How to Use the Software

### Adding Drivers
To add drivers, navigate to the Manage Restaurant tab. In this section, you can add new drivers by entering their name and phone number. You can also set their status as either On Shift or Off Shift. Drivers marked as On Shift and not currently out for delivery will be assigned to batches, while those marked Off Shift will not be assigned to batches. 

### Adding Menu Items
Under the Manage Restaurant tab, you can also add menu items that your restaurant offers. Just enter the name of the menu item and save it. You can also edit or remove menu items as needed to keep your menu up to date.

### Modifying Restaurant Information
Within the Manage Restaurant section, you can update your restaurant’s name and location. Editing this information ensures that delivery routes and dispatch calculations are based on the correct starting location.

**Note**: Upon creating an account, the corresponding restaurant location is initialized as "Address not set". This must be changed to an actual adress for most functionality (such as creating orders) to work without errors. Otherwise, there is no way to create a route.

### Creating an Order
To create a new order, click the Add New Order button. Enter the delivery address for the order.. Once submitted, the system will process the order and determine how it should be dispatched, assigning it to an available driver. 

### Acting as a Driver
Once a driver is assigned to a batch, the system sends a text message notification containing a link to the driver route page. This message includes the driver name, batch ID, and a link that opens the driver route interface where the driver can view their assigned batch, see the list of delivery stops, mark orders as delivered, and indicate that they have returned to the restaurant. Keep in mind that orders **must be marked delivered in the order they appear** on the route. Drivers must press **Complete Route** after finishing their deliveries in order to be eligible for assignment to another batch. The route page is driver-specific and can be reused across multiple batches. Because the system currently uses a Twilio trial account, SMS messages are sent only to the configured virtual phone number rather than to the individual phone numbers entered for drivers.

## 4. How to Report a Bug
If you encounter an issue, please open an issue in the [GitHub
repository](https://github.com/zgodil/cse403-batchable/issues).

A good bug report should include:
* Clear title
* Operating system
* Browser and version
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots
* Error messages 

For more information about bug reporting guidelines please visit: https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html

Providing detailed information helps the development team resolve issues more quickly.
