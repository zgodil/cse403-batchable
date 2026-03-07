package com.batchable.backend.twilio;

import com.batchable.backend.EventSource.DriverSsePublisher;
import com.batchable.backend.db.models.Batch;
import com.batchable.backend.db.models.Driver;
import com.batchable.backend.db.models.Order;
import com.batchable.backend.db.models.Order.State;
import com.batchable.backend.service.BatchingManager;
import com.batchable.backend.service.DbOrderService;
import com.batchable.backend.service.DriverService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Twilio-backed implementation of {@link TwilioManager}.
 *
 * <p>
 * This service is responsible for sending SMS notifications via the Twilio API. It reacts to
 * batch-related events (e.g., a batch becoming active) and constructs human-readable messages,
 * including Google Maps route links, for drivers.
 *
 * <p>
 * This class should NOT control batching logic itself; it only reacts to events emitted elsewhere
 * (e.g., by a BatchingManager).
 */
@Service
public class TwilioManager {

  private final DriverSsePublisher driverSsePublisher;

  private final DriverService driverService;

  /** Used to fetch batch and order data needed to construct messages. */
  private final DbOrderService dbOrderService;

  /** Twilio configuration (e.g., "from" phone number). */
  private final TwilioConfig config;

  private final String driverLinkPrefix = "http://localhost:5173/route/";

  public TwilioManager(TwilioConfig config, DbOrderService dbOrderService,
      DriverService driverService, DriverSsePublisher driverSsePublisher) {
    this.config = config;
    this.dbOrderService = dbOrderService;
    this.driverService = driverService;
    this.driverSsePublisher = driverSsePublisher;
  }

  /**
   * Handler invoked when an existing batch changes (e.g., route updates).
   */
  public void handleBatchChange(long batchId, String restaurantAddress) {
    Batch batch = dbOrderService.getBatch(batchId);
    Driver driver = driverService.getDriver(batch.driverId);
    String batchRouteLink = getBatchRouteLink(batchId, restaurantAddress);
    driverSsePublisher.refreshOrderData(driver.id, batchRouteLink);
  }

  /**
   * Handler invoked when a new batch becomes active.
   *
   * <p>
   * Fetches the batch, constructs a Google Maps route for the batch, and prepares an SMS
   * notification for the assigned driver.
   *
   * @param batchId ID of the newly active batch
   * @param restaurantAddress address used as both route origin and destination
   */
  public void handleNewBatch(long batchId, String restaurantAddress) {
    Batch batch = dbOrderService.getBatch(batchId);
    Driver driver = driverService.getDriver(batch.driverId);
    String driverPhoneNumber = config.getDriverPhoneNumber();
    String message = "Driver named " + driver.name + " with id " + driver.id + 
        " you have been assigned a new batch. View here " + driverLinkPrefix + driverService.getDriverToken(driver.id);

    sendMessage(driverPhoneNumber, message);
    handleBatchChange(batchId, restaurantAddress);
  }

  /**
   * Constructs a Google Maps directions link for the remaining (i.e., undelivered) orders in a batch. 
   * Starts at the driver's current location and visits each remaining
   * order destination in batch order, then returns to the restaurant
   *
   * @param batchId ID of the batch
   * @param restaurantAddress address of the restaurant this is a batch for
   * @return a Google Maps directions URL
   */
  public String getBatchRouteLink(long batchId, String restaurantAddress) {
    List<Order> orders = dbOrderService.getBatchOrders(batchId);
    orders = orders.stream()
      .filter(order -> order.state != State.DELIVERED)
      .toList();

    StringBuilder linkBuilder = new StringBuilder("https://www.google.com/maps/dir/?api=1");
    linkBuilder.append("&origin=Current+Location");
    linkBuilder.append("&destination=").append(urlEncodeAddress(restaurantAddress));
    if (!orders.isEmpty()) {
      linkBuilder.append("&waypoints=").append(urlEncodeAddress(orders.get(0).destination));
    }
    for (int i = 1; i < orders.size(); i++) {
      linkBuilder.append("|").append(urlEncodeAddress(orders.get(i).destination));
    }
    return linkBuilder.toString();
  }

  /**
   * URL-encodes an address string using UTF-8 so it is safe to include as a query parameter in a
   * Google Maps URL.
   */
  private String urlEncodeAddress(String address) {
    return URLEncoder.encode(address, StandardCharsets.UTF_8);
  }

  /**
   * Sends an SMS message via the Twilio API.
   *
   * @param toPhoneNumber recipient phone number
   * @param message message body
   */
  public void sendMessage(String toPhoneNumber, String message) {
    Message
        .creator(new PhoneNumber(toPhoneNumber), new PhoneNumber(config.getPhoneNumber()), message)
        .create();
  }
}
