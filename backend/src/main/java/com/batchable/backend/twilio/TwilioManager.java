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
import com.batchable.backend.config.ServerLocationConfig;

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

  private final ServerLocationConfig locationConfig;

  public TwilioManager(TwilioConfig config, ServerLocationConfig locationConfig,
      DbOrderService dbOrderService, DriverService driverService, DriverSsePublisher driverSsePublisher) {
    this.locationConfig = locationConfig;
    this.config = config;
    this.dbOrderService = dbOrderService;
    this.driverService = driverService;
    this.driverSsePublisher = driverSsePublisher;
  }

  /**
   * Handler invoked when an existing batch changes (e.g., route updates).
   */
  public void handleBatchChange(long batchId) {
    Batch batch = dbOrderService.getBatch(batchId);
    Driver driver = driverService.getDriver(batch.driverId);
    driverSsePublisher.refreshDriverData(driver.id);
  }

  /**
   * Handler invoked when a new batch becomes active.
   *
   * <p>
   * Fetches the batch, constructs a Google Maps route for the batch, and prepares an SMS
   * notification for the assigned driver.
   *
   * @param batchId ID of the newly active batch
   */
  public void handleNewBatch(long batchId) {
    Batch batch = dbOrderService.getBatch(batchId);
    Driver driver = driverService.getDriver(batch.driverId);
    String driverPhoneNumber = config.getDriverPhoneNumber();
    String message = "Driver " + driver.name + " (id " + driver.id + 
        ") you have been assigned a new batch. View here " + locationConfig.getUrl() + "/route/" + driverService.getDriverToken(driver.id);
    
    sendMessage(driverPhoneNumber, message);
    System.out.println("SENT TWILIO MESSAGE: " + message);
    handleBatchChange(batchId);
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
