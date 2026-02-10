package com.batchable.backend.db.dao;

import com.batchable.backend.db.PostgresTestBase;
import com.batchable.backend.db.models.Order;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class OrderDAOTest extends PostgresTestBase {

  private long restaurantId;
  private long driverId;
  private long batchId;

  @BeforeEach
  void seedRestaurantDriverBatch() throws Exception {
    RestaurantDAO restaurantDAO = new RestaurantDAO(conn);
    DriverDAO driverDAO = new DriverDAO(conn);
    BatchDAO batchDAO = new BatchDAO(conn);

    restaurantId = restaurantDAO.createRestaurant("R1", "47.6062,-122.3321");
    driverId = driverDAO.createDriver(restaurantId, "D1", "206-555-0101", true);

    // Batch times appear to be NOT NULL in your schema, so always set both
    Instant dispatch = Instant.parse("2026-02-10T23:00:00Z");
    Instant expected = Instant.parse("2026-02-10T23:30:00Z");
    batchId = batchDAO.createBatch(driverId, "polyline", dispatch, expected);
  }

  @Test
  void createOrder_thenGetOrder_roundTrip_unassigned() throws Exception {
    OrderDAO dao = new OrderDAO(conn);

    Instant t0 = Instant.parse("2026-02-10T22:00:00Z");
    Instant t1 = Instant.parse("2026-02-10T22:15:00Z");
    Instant t2 = Instant.parse("2026-02-10T22:20:00Z");

    long id = dao.createOrder(
        restaurantId,
        "123 Main St",
        "[\"Burger\",\"Fries\"]",
        t0, t1, t2,
        Order.State.COOKING,
        true,
        null
    );

    Order o = dao.getOrder(id).orElseThrow();
    assertEquals(id, o.id);
    assertEquals(restaurantId, o.restaurantId);
    assertEquals("123 Main St", o.destination);
    assertEquals("[\"Burger\",\"Fries\"]", o.itemNamesJson);
    assertEquals(t0, o.initialTime);
    assertEquals(t1, o.deliveryTime);
    assertEquals(t2, o.cookedTime);
    assertEquals(Order.State.COOKING, o.state);
    assertTrue(o.highPriority);
    assertNull(o.batchId);
  }

  @Test
  void updateOrderState_changesState() throws Exception {
    OrderDAO dao = new OrderDAO(conn);

    long id = dao.createOrder(
        restaurantId,
        "dest",
        "[\"A\"]",
        Instant.parse("2026-02-10T22:00:00Z"),
        Instant.parse("2026-02-10T22:10:00Z"),
        Instant.parse("2026-02-10T22:15:00Z"),
        Order.State.COOKING,
        false,
        null
    );

    dao.updateOrderState(id, Order.State.COOKED);

    Order o = dao.getOrder(id).orElseThrow();
    assertEquals(Order.State.COOKED, o.state);
  }

  @Test
  void assignAndUnassignOrderFromBatch_updatesBatchId() throws Exception {
    OrderDAO dao = new OrderDAO(conn);

    long id = dao.createOrder(
        restaurantId,
        "dest",
        "[\"A\"]",
        Instant.parse("2026-02-10T22:00:00Z"),
        Instant.parse("2026-02-10T22:10:00Z"),
        Instant.parse("2026-02-10T22:15:00Z"),
        Order.State.COOKING,
        false,
        null
    );

    dao.assignOrderToBatch(id, batchId);
    assertEquals(batchId, dao.getOrder(id).orElseThrow().batchId);

    dao.unassignOrderFromBatch(id);
    assertNull(dao.getOrder(id).orElseThrow().batchId);
  }

  @Test
  void listOrdersInBatch_returnsOnlyThoseOrders_inOrder() throws Exception {
    OrderDAO dao = new OrderDAO(conn);

    long o1 = dao.createOrder(
        restaurantId, "d1", "[\"A\"]",
        Instant.parse("2026-02-10T22:00:00Z"),
        Instant.parse("2026-02-10T22:10:00Z"),
        Instant.parse("2026-02-10T22:15:00Z"),
        Order.State.COOKED, false, batchId
    );

    long o2 = dao.createOrder(
        restaurantId, "d2", "[\"B\"]",
        Instant.parse("2026-02-10T22:01:00Z"),
        Instant.parse("2026-02-10T22:11:00Z"),
        Instant.parse("2026-02-10T22:16:00Z"),
        Order.State.DRIVING, true, batchId
    );

    // Not in batch
    dao.createOrder(
        restaurantId, "d3", "[\"C\"]",
        Instant.parse("2026-02-10T22:02:00Z"),
        Instant.parse("2026-02-10T22:12:00Z"),
        Instant.parse("2026-02-10T22:17:00Z"),
        Order.State.COOKING, false, null
    );

    List<Order> inBatch = dao.listOrdersInBatch(batchId);
    assertEquals(2, inBatch.size());

    assertEquals(o1, inBatch.get(0).id);
    assertEquals(o2, inBatch.get(1).id);
    assertTrue(inBatch.stream().allMatch(o -> o.batchId != null && o.batchId == batchId));
  }

  @Test
  void listOpenOrdersForRestaurant_excludesDelivered() throws Exception {
    OrderDAO dao = new OrderDAO(conn);

    long open1 = dao.createOrder(
        restaurantId, "o1", "[\"A\"]",
        Instant.parse("2026-02-10T22:00:00Z"),
        Instant.parse("2026-02-10T22:10:00Z"),
        Instant.parse("2026-02-10T22:15:00Z"),
        Order.State.COOKING, false, null
    );

    long open2 = dao.createOrder(
        restaurantId, "o2", "[\"B\"]",
        Instant.parse("2026-02-10T22:01:00Z"),
        Instant.parse("2026-02-10T22:11:00Z"),
        Instant.parse("2026-02-10T22:16:00Z"),
        Order.State.DRIVING, false, null
    );

    dao.createOrder(
        restaurantId, "del", "[\"C\"]",
        Instant.parse("2026-02-10T22:02:00Z"),
        Instant.parse("2026-02-10T22:12:00Z"),
        Instant.parse("2026-02-10T22:17:00Z"),
        Order.State.DELIVERED, false, null
    );

    List<Order> open = dao.listOpenOrdersForRestaurant(restaurantId);
    assertTrue(open.stream().noneMatch(o -> o.state == Order.State.DELIVERED));

    // Should contain the two open ones
    assertTrue(open.stream().anyMatch(o -> o.id == open1));
    assertTrue(open.stream().anyMatch(o -> o.id == open2));
  }
}
