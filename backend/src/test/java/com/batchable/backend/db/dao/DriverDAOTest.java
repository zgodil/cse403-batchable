package com.batchable.backend.db.dao;

import com.batchable.backend.db.PostgresTestBase;
import com.batchable.backend.db.models.Driver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class DriverDAOTest extends PostgresTestBase {

  private long r1;
  private long r2;

  @BeforeEach
  void seedRestaurants() throws Exception {
    r1 = insertRestaurant("R1", "47.6062,-122.3321"); // Seattle-ish
    r2 = insertRestaurant("R2", "47.6205,-122.3493"); // also Seattle-ish
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
  void createDriver_thenGetDriver_roundTrip() throws Exception {
    DriverDAO dao = new DriverDAO(conn);

    long id = dao.createDriver(r1, "Zane", "206-555-0101", true);

    Optional<Driver> got = dao.getDriver(id);
    assertTrue(got.isPresent());

    Driver d = got.get();
    assertEquals(id, d.id);
    assertEquals(r1, d.restaurantId);
    assertEquals("Zane", d.name);
    assertEquals("206-555-0101", d.phoneNumber);
    assertTrue(d.onShift);
  }

  @Test
  void getDriver_missing_returnsEmpty() throws Exception {
    DriverDAO dao = new DriverDAO(conn);
    Optional<Driver> got = dao.getDriver(999999L);
    assertTrue(got.isEmpty());
  }

  @Test
  void setDriverShift_updatesFlag() throws Exception {
    DriverDAO dao = new DriverDAO(conn);

    long id = dao.createDriver(r1, "A", "111", true);
    dao.setDriverShift(id, false);

    Driver d = dao.getDriver(id).orElseThrow();
    assertFalse(d.onShift);
  }

  @Test
  void listDriversForRestaurant_filtersOnShiftOnly() throws Exception {
    DriverDAO dao = new DriverDAO(conn);

    dao.createDriver(r1, "D1", "p1", true);
    dao.createDriver(r1, "D2", "p2", false);
    dao.createDriver(r2, "D3", "p3", true);

    List<Driver> allR1 = dao.listDriversForRestaurant(r1, false);
    assertEquals(2, allR1.size());
    assertTrue(allR1.stream().allMatch(d -> d.restaurantId == r1));

    List<Driver> onShiftR1 = dao.listDriversForRestaurant(r1, true);
    assertEquals(1, onShiftR1.size());
    assertEquals("D1", onShiftR1.get(0).name);
    assertTrue(onShiftR1.get(0).onShift);
  }
}
