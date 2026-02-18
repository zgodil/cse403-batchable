package com.batchable.backend.service;

import com.batchable.backend.db.dao.BatchDAO;
import com.batchable.backend.db.dao.OrderDAO;
import com.batchable.backend.db.models.Batch;
import com.batchable.backend.db.models.Order;
import com.batchable.backend.websocket.OrderWebSocketPublisher;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Business logic layer for orders. Enforces valid lifecycle transitions,
 * domain invariants, and coordinates persistence and downstream effects.
 * All order mutations must go through this service.
 */
@Service
public class OrderService {
  private final DbOrderService dbOrderService;
  private final BatchingManager batchingManager;
  private final OrderDAO orderDAO;
  private final BatchDAO batchDAO;
  private final OrderWebSocketPublisher publisher;

  public OrderService(DbOrderService dbOrderService, BatchingManager batchingManager,
      OrderDAO orderDAO, BatchDAO batchDAO, OrderWebSocketPublisher publisher) {
    this.dbOrderService = dbOrderService;
    this.batchingManager = batchingManager;
    this.orderDAO = orderDAO;
    this.batchDAO = batchDAO;
    this.publisher = publisher;
  }

  /**
   * Creates a new order.
   *
   * @param order the order to create (ID must be <= 0)
   * @return the generated order ID
   */
  public long createOrder(Order order) {
    long id = dbOrderService.createOrder(order);
    batchingManager.addOrder(dbOrderService.getOrder(id));
    return id;
  }

  /**
   * Advances order state (e.g., COOKING → COOKED).
   *
   * @param orderId ID of the order to advance
   */
  public void advanceOrderState(long orderId) {
    dbOrderService.advanceOrderState(orderId);
    batchingManager.updateOrder(orderId, false);
  }

  /**
   * Updates the cooked time of an order.
   *
   * @param orderId    ID of the order
   * @param cookedTime new cooked time
   */
  public void updateOrderCookedTime(long orderId, Instant cookedTime) {
    dbOrderService.updateOrderCookedTime(orderId, cookedTime);
    batchingManager.updateOrder(orderId, true);
  }

  /**
   * Updates the delivery time of an order.
   *
   * @param orderId      ID of the order
   * @param deliveryTime new delivery time
   */
  public void updateOrderDeliveryTime(long orderId, Instant deliveryTime) {
    dbOrderService.updateOrderDeliveryTime(orderId, deliveryTime);
    batchingManager.updateOrder(orderId, true);
  }

  /**
   * Resets an order to be remade (cooking state, high priority).
   *
   * @param orderId ID of the order to remake
   */
  public void remakeOrder(long orderId) {
    dbOrderService.remakeOrder(orderId);
    batchingManager.updateOrder(orderId, true);
  }

  /**
   * Returns the order with the given ID.
   *
   * @param orderId ID of the order
   * @return the order
   * @throws IllegalArgumentException if not found
   */
  public Order getOrder(long orderId) {
    return dbOrderService.getOrder(orderId);
  }

  /**
   * Creates a new batch.
   *
   * @param batch the batch to create (ID must be <= 0)
   * @return the generated batch ID
   */
  public long createBatch(Batch batch) {
    return dbOrderService.createBatch(batch);
  }


  /**
   * Gets batch by ID.
   *
   * @param batchId ID of the batch
   * @return list of orders in that batch
   */
  public Batch getBatch(long batchId) {
    return dbOrderService.getBatch(batchId);
  }

  /**
   * Lists all orders belonging to a batch.
   *
   * @param batchId ID of the batch
   * @return list of orders in that batch
   */
  public List<Order> getBatchOrders(long batchId) {
    return dbOrderService.getBatchOrders(batchId);
  }

  /**
   * Removes an order (if not delivered) and notifies the batching manager.
   *
   * @param orderId ID of the order to remove
   */
  public void removeOrder(long orderId) {
    dbOrderService.removeOrder(orderId);
    batchingManager.removeOrder(orderId);
  }

  /**
   * Assigns an order to a batch.
   *
   * @param orderId ID of the order
   * @param batchId ID of the batch
   */
  public void setOrderBatchId(long orderId, long batchId) {
    dbOrderService.setOrderBatchId(orderId, batchId);
  }
}
