package com.batchable.backend.EventSource;

import org.springframework.stereotype.Service;

@Service
public class DriverSsePublisher {
  private final DriverSseController driverSseController;

  public DriverSsePublisher(DriverSseController driverSseController) {
    this.driverSseController = driverSseController;
  }

  // Notify SSE clients to refresh order data for the driver specified by the given id
  public void refreshOrderData(Long driverId, String routeLink) {
    driverSseController.refreshOrderData(driverId, routeLink);
  }
}
