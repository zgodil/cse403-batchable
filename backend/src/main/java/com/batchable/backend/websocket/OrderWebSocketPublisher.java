package com.batchable.backend.websocket;

import org.springframework.stereotype.Service;

@Service
public class OrderWebSocketPublisher {
  private final SseController sseController;

  public OrderWebSocketPublisher(SseController sseController) {
    this.sseController = sseController;
  }

  // Notify SSE clients to refresh order data for the restaurant specified by the given id
  public void refreshOrderData(Long restaurantId) {
    sseController.refreshOrderData(restaurantId);
  }
}
