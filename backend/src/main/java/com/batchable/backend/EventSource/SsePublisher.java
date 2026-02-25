package com.batchable.backend.EventSource;

import org.springframework.stereotype.Service;

@Service
public class SsePublisher {
  private final SseController sseController;

  public SsePublisher(SseController sseController) {
    this.sseController = sseController;
  }

  // Notify SSE clients to refresh order data for the restaurant specified by the given id
  public void refreshOrderData(Long restaurantId) {
    sseController.refreshOrderData(restaurantId);
  }
}
