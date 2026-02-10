package com.batchable.backend.db.dao;

import com.batchable.backend.db.PostgresTestBase;
import com.batchable.backend.db.models.Batch;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class BatchDAOTest extends PostgresTestBase {

  private long restaurantId;
  private long driverId;

  @BeforeEach
  void seedRestaurantAndDriver() throws Exception {
    restaurantId = insertRestaurant("R1", "47.6062,-122.3321");
    driverId = new DriverDAO(conn).createDriver(restaurantId, "Driver1", "206-555-0101", true);
  }

  private long insertRestaurant(String name, String location) throws Exception {
    final String sql = "INSERT INTO Restaurant(name, location) VALUES (?, ?) RETURNING id;";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, name);
      ps.setString(2, location);
      try (ResultSet rs = ps.executeQuery()) {
        rs.next();
        return rs.getLong("id");
      }
    }
  }

  @Test
  void createBatch_thenGetBatch_roundTrip() throws Exception {
    BatchDAO dao = new BatchDAO(conn);

    String route = "encoded_polyline_here";
    Instant dispatch = Instant.parse("2026-02-10T23:00:00Z");
    Instant expected = Instant.parse("2026-02-10T23:30:00Z");

    long batchId = dao.createBatch(driverId, route, dispatch, expected);

    Optional<Batch> got = dao.getBatch(batchId);
    assertTrue(got.isPresent());

    Batch b = got.get();
    assertEquals(batchId, b.id);
    assertEquals(driverId, b.driverId);
    assertEquals(route, b.route);
    assertEquals(dispatch, b.dispatchTime);
    assertEquals(expected, b.expectedCompletionTime);
  }

  @Test
  void createBatch_requiresBothTimes() throws Exception {
    BatchDAO dao = new BatchDAO(conn);

    Instant dispatch = Instant.parse("2026-02-10T23:00:00Z");
    Instant expected = Instant.parse("2026-02-10T23:30:00Z");

    long batchId = dao.createBatch(driverId, "r", dispatch, expected);

    Batch b = dao.getBatch(batchId).orElseThrow();
    assertEquals("r", b.route);
    assertEquals(dispatch, b.dispatchTime);
    assertEquals(expected, b.expectedCompletionTime);
  }



  @Test
  void getBatch_missing_returnsEmpty() throws Exception {
    BatchDAO dao = new BatchDAO(conn);

    Optional<Batch> got = dao.getBatch(999999L);
    assertTrue(got.isEmpty());
  }
}
