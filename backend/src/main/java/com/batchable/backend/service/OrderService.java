package com.batchable.backend.service;

import com.batchable.backend.db.models.Batch;
import com.batchable.backend.db.models.Driver;
import com.batchable.backend.db.models.Order;
import com.batchable.backend.db.models.Order.State;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import org.springframework.stereotype.Service;

/**
 * Business logic layer for orders. Enforces valid lifecycle transitions, domain invariants, and
 * coordinates persistence and downstream effects. All order mutations must go through this service.
 */
@Service
public class OrderService {

  private final DriverService driverService;
  private final DbOrderService dbOrderService;
  private final BatchingManager batchingManager;

  // Service-level lock protects multi-step business invariants
  // across dbOrderService, driverService, and batchingManager calls.
  private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
  private final Lock readLock = rwLock.readLock();
  private final Lock writeLock = rwLock.writeLock();

  public OrderService(DbOrderService dbOrderService, BatchingManager batchingManager,
      DriverService driverService) {
    this.dbOrderService = dbOrderService;
    this.batchingManager = batchingManager;
    this.driverService = driverService;
  }

  /**
   * Creates a new order.
   *
   * @param order the order to create (ID must be <= 0)
   * @return the generated order ID
   */
  public long createOrder(Order order) {
    writeLock.lock();
    try {
      long id = dbOrderService.createOrder(order);
      batchingManager.addOrder(dbOrderService.getOrder(id));
      return id;
    } finally {
      writeLock.unlock();
    }
  }

  /**
   * Advances order state (e.g., COOKING → COOKED).
   *
   * @param orderId ID of the order to advance
   * @throws IllegalArgumentException if this would advance the order state past COOKED
   */
  public void advanceOrderState(long orderId) {
    writeLock.lock();
    try {
      Order order = dbOrderService.getOrder(orderId);
      if (order.state.getRank() >= State.COOKED.getRank()) {
        throw new IllegalArgumentException(
            "Front-end cannot advance order state past cooked. Order id " + order.id);
      }
      dbOrderService.advanceOrderState(orderId);
      batchingManager.updateOrder(orderId, false);
    } finally {
      writeLock.unlock();
    }
  }

  /**
   * Marks an order as delivered.
   *
   * @param orderId ID of the order to mark delivered
   * @param token UUID identifying the driver delivering the order
   * @throws IllegalArgumentException if the driver is not delivering the order or the current order
   *         they are delivering does not match the given one
   */
  public void markDelivered(long orderId, String token) {
    writeLock.lock();
    try {
      Order order = dbOrderService.getOrder(orderId);
      Driver driver = driverService.getDriverByToken(token);
      Order currentOrderToDeliver = driverService.getCurrentOrderToDeliver(driver.id);
      if (currentOrderToDeliver == null || currentOrderToDeliver.id != orderId) {
        throw new IllegalArgumentException("Driver specified has delivered all batch orders or "
            + "their next order to deliver does not match the given id " + orderId);
      }

      if (order.state != State.DRIVING) {
        throw new IllegalStateException(
            "Order id " + orderId + " is being delivered but has non-driving state");
      }

      dbOrderService.advanceOrderState(orderId);
      batchingManager.updateOrder(orderId, false);
    } finally {
      writeLock.unlock();
    }
  }

  /**
   * Updates the cooked time of an order.
   *
   * @param orderId ID of the order
   * @param cookedTime new cooked time
   */
  public void updateOrderCookedTime(long orderId, Instant cookedTime) {
    writeLock.lock();
    try {
      dbOrderService.updateOrderCookedTime(orderId, cookedTime);
      batchingManager.updateOrder(orderId, true);
    } finally {
      writeLock.unlock();
    }
  }

  /**
   * Resets an order to be remade (cooking state, high priority).
   *
   * @param orderId ID of the order to remake
   */
  public void remakeOrder(long orderId) {
    writeLock.lock();
    try {
      dbOrderService.remakeOrder(orderId);
      batchingManager.updateOrder(orderId, true);
    } finally {
      writeLock.unlock();
    }
  }

  /**
   * Returns the order with the given ID.
   *
   * @param orderId ID of the order
   * @return the order
   * @throws IllegalArgumentException if not found
   */
  public Order getOrder(long orderId) {
    readLock.lock();
    try {
      return dbOrderService.getOrder(orderId);
    } finally {
      readLock.unlock();
    }
  }

  /**
   * Creates a new batch.
   *
   * @param batch the batch to create (ID must be <= 0)
   * @return the generated batch ID
   */
  public long createBatch(Batch batch) {
    writeLock.lock();
    try {
      return dbOrderService.createBatch(batch);
    } finally {
      writeLock.unlock();
    }
  }


  /**
   * Gets batch by ID.
   *
   * @param batchId ID of the batch
   * @return list of orders in that batch
   */
  public Batch getBatch(long batchId) {
    readLock.lock();
    try {
      return dbOrderService.getBatch(batchId);
    } finally {
      readLock.unlock();
    }
  }

  /**
   * Lists all orders belonging to a batch.
   *
   * @param batchId ID of the batch
   * @return list of orders in that batch
   */
  public List<Order> getBatchOrders(long batchId) {
    readLock.lock();
    try {
      return dbOrderService.getBatchOrders(batchId);
    } finally {
      readLock.unlock();
    }
  }

  /**
   * Removes an order (if not delivered) and notifies the batching manager.
   *
   * @param orderId ID of the order to remove
   */
  public void removeOrder(long orderId) {
    writeLock.lock();
    try {
      Order order = dbOrderService.getOrder(orderId);
      dbOrderService.removeOrder(orderId);
      batchingManager.removeOrder(order);
    } finally {
      writeLock.unlock();
    }
  }

  /**
   * Assigns an order to a batch.
   *
   * @param orderId ID of the order
   * @param batchId ID of the batch
   */
  public void setOrderBatchId(long orderId, long batchId) {
    writeLock.lock();
    try {
      dbOrderService.setOrderBatchId(orderId, batchId);
    } finally {
      writeLock.unlock();
    }
  }
}