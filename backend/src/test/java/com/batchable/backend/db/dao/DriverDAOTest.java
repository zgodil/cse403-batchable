package com.batchable.backend.db.dao;

import com.batchable.backend.db.PostgresTestBase;
import com.batchable.backend.db.TestDataSource;
import com.batchable.backend.db.models.Driver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DriverDAOTest contains unit tests for the DriverDAO class,
 * verifying correct behavior of CRUD operations, batch listings,
 * on-shift status, and token handling.
 */
public class DriverDAOTest extends PostgresTestBase {

  private TestDataSource ds;   // Test datasource for database connection
  private DriverDAO driverDAO; // DAO under test

  /** Sets up the datasource and DAO before each test and cleans the database. */
  @BeforeEach
  void setUp() throws Exception {
    ds = new TestDataSource(conn);
    driverDAO = new DriverDAO(ds);
    cleanDb();
  }

  /**
   * Clears all relevant tables to isolate tests.
   * Truncates tables with RESTART IDENTITY and CASCADE for dependencies.
   */
  private void cleanDb() throws Exception {
    try (Statement st = conn.createStatement()) {
      // Order matters less with CASCADE, but keep Restaurant last-ish for readability.
      st.execute("TRUNCATE TABLE Driver RESTART IDENTITY CASCADE;");
      st.execute("TRUNCATE TABLE Batch RESTART IDENTITY CASCADE;");
      st.execute("TRUNCATE TABLE \"menu_item\" RESTART IDENTITY CASCADE;");
      st.execute("TRUNCATE TABLE \"Order\" RESTART IDENTITY CASCADE;");
      st.execute("TRUNCATE TABLE Restaurant RESTART IDENTITY CASCADE;");
    } catch (Exception ignored) {
      // If some tables don't exist in your schema yet, you can delete their TRUNCATE lines above.
      // (But leave Driver + Restaurant at minimum.)
    }
  }

  /**
   * Inserts a restaurant row and returns its generated ID.
   * @param name the restaurant name
   * @param location the restaurant location
   * @return the auto-generated ID of the restaurant
   */
  private long insertRestaurant(String name, String location) throws Exception {
    final String sql = "INSERT INTO Restaurant(name, location) VALUES (?, ?) RETURNING id;";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
      ps.setString(1, name);
      ps.setString(2, location);
      try (ResultSet rs = ps.executeQuery()) {
        assertTrue(rs.next());
        return rs.getLong("id");
      }
    }
  }

  /**
   * Tests that creating a driver returns a valid ID and that
   * getDriver retrieves the correct driver data.
   */
  @Test
  void createDriver_returnsId_andGetDriverWorks() throws Exception {
    long rid = insertRestaurant("A", "Seattle");

    long id = driverDAO.createDriver(rid, "Sam", "206-555-0000", false);
    assertTrue(id > 0);

    Optional<Driver> got = driverDAO.getDriver(id);
    assertTrue(got.isPresent());
    Driver d = got.get();

    assertEquals(id, d.id);
    assertEquals(rid, d.restaurantId);
    assertEquals("Sam", d.name);
    assertEquals("206-555-0000", d.phoneNumber);
    assertFalse(d.onShift);
  }

  /** Tests that getDriver returns empty when the driver ID does not exist. */
  @Test
  void getDriver_missing_returnsEmpty() throws Exception {
    assertTrue(driverDAO.getDriver(999999).isEmpty());
  }

  /**
   * Tests listDriversForRestaurant returns all drivers for a restaurant,
   * and correctly filters by on-shift status when requested.
   */
  @Test
  void listDriversForRestaurant_returnsAll_andRespectsOnShiftOnly() throws Exception {
    long r1 = insertRestaurant("R1", "Loc1");
    long r2 = insertRestaurant("R2", "Loc2");

    long a = driverDAO.createDriver(r1, "A", "111", false);
    long b = driverDAO.createDriver(r1, "B", "222", true);
    long c = driverDAO.createDriver(r1, "C", "333", true);
    driverDAO.createDriver(r2, "X", "999", true); // other restaurant

    List<Driver> allR1 = driverDAO.listDriversForRestaurant(r1, false);
    assertEquals(3, allR1.size());
    assertEquals(List.of(a, b, c), allR1.stream().map(d -> d.id).toList());

    List<Driver> onShiftR1 = driverDAO.listDriversForRestaurant(r1, true);
    assertEquals(2, onShiftR1.size());
    assertEquals(List.of(b, c), onShiftR1.stream().map(d -> d.id).toList());
    assertTrue(onShiftR1.stream().allMatch(d -> d.onShift));
  }

  /** Tests setDriverShift correctly updates the onShift flag for a driver. */
  @Test
  void setDriverShift_updatesOnShiftFlag() throws Exception {
    long rid = insertRestaurant("A", "Seattle");
    long id = driverDAO.createDriver(rid, "Sam", "206", false);

    Driver d1 = driverDAO.getDriver(id).orElseThrow();
    assertFalse(d1.onShift);

    driverDAO.setDriverShift(id, true);
    Driver d2 = driverDAO.getDriver(id).orElseThrow();
    assertTrue(d2.onShift);

    driverDAO.setDriverShift(id, false);
    Driver d3 = driverDAO.getDriver(id).orElseThrow();
    assertFalse(d3.onShift);
  }

  /**
   * Tests updateDriver correctly updates the name and phone number,
   * without modifying onShift or restaurantId.
   */
  @Test
  void updateDriver_updatesNameAndPhone_only() throws Exception {
    long rid = insertRestaurant("A", "Seattle");
    long id = driverDAO.createDriver(rid, "Sam", "206", true);

    boolean ok = driverDAO.updateDriver(id, "Samuel", "425");
    assertTrue(ok);

    Driver d = driverDAO.getDriver(id).orElseThrow();
    assertEquals("Samuel", d.name);
    assertEquals("425", d.phoneNumber);
    assertTrue(d.onShift); // unchanged
    assertEquals(rid, d.restaurantId); // unchanged
  }

  /** Tests that updateDriver returns false when the driver ID does not exist. */
  @Test
  void updateDriver_missing_returnsFalse() throws Exception {
    boolean ok = driverDAO.updateDriver(123456, "N", "P");
    assertFalse(ok);
  }

  /**
   * Tests that deleteDriver removes the driver and that subsequent getDriver
   * calls return empty. Also verifies deleting again returns false.
   */
  @Test
  void deleteDriver_deletes_andGetReturnsEmpty() throws Exception {
    long rid = insertRestaurant("A", "Seattle");
    long id = driverDAO.createDriver(rid, "Sam", "206", false);

    assertTrue(driverDAO.deleteDriver(id));
    assertTrue(driverDAO.getDriver(id).isEmpty());

    // deleting again should be false
    assertFalse(driverDAO.deleteDriver(id));
  }

  /**
   * Tests that hasOnShiftDrivers returns true if any driver is on shift,
   * false otherwise.
   */
  @Test
  void hasOnShiftDrivers_trueWhenAnyOnShift_falseOtherwise() throws Exception {
    long rid = insertRestaurant("A", "Seattle");

    assertFalse(driverDAO.hasOnShiftDrivers(rid));

    driverDAO.createDriver(rid, "A", "111", false);
    assertFalse(driverDAO.hasOnShiftDrivers(rid));

    driverDAO.createDriver(rid, "B", "222", true);
    assertTrue(driverDAO.hasOnShiftDrivers(rid));
  }

  /**
   * Tests that getDriverByToken returns empty for a token not present in the database.
   */
  @Test
  void getDriverByToken_returnsEmptyForUnknownToken() throws Exception {
    String unknownToken = "00000000-0000-0000-0000-000000000000";
    Optional<Driver> opt = driverDAO.getDriverByToken(unknownToken);
    assertTrue(opt.isEmpty());
  }

  /** Tests that getDriverToken returns the correct token for an existing driver. */
  @Test
  void getDriverToken_returnsTokenForExistingDriver() throws Exception {
    long rid = insertRestaurant("Test", "Loc");
    long id = driverDAO.createDriver(rid, "Sam", "555-1234", false);

    java.util.UUID uuid = java.util.UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
    try (PreparedStatement ps = conn.prepareStatement("UPDATE Driver SET token = ? WHERE id = ?")) {
      ps.setObject(1, uuid);
      ps.setLong(2, id);
      assertEquals(1, ps.executeUpdate());
    }

    Optional<String> opt = driverDAO.getDriverToken(id);
    assertTrue(opt.isPresent());
    assertEquals(uuid.toString(), opt.get());
  }

  /** Tests that getDriverToken returns empty for a missing driver ID. */
  @Test
  void getDriverToken_returnsEmptyForMissingDriver() throws Exception {
    Optional<String> opt = driverDAO.getDriverToken(999999);
    assertTrue(opt.isEmpty());
  }

  /**
   * Tests that getDriverToken returns a valid token even if it is auto-generated
   * by the database (gen_random_uuid), and that it is a valid UUID format.
   */
  @Test
  void getDriverToken_returnsTokenEvenIfAutoGenerated() throws Exception {
    long rid = insertRestaurant("Test", "Loc");
    long id = driverDAO.createDriver(rid, "Sam", "555-1234", false);

    Optional<String> opt = driverDAO.getDriverToken(id);
    assertTrue(opt.isPresent());
    String token = opt.get();
    assertNotNull(token);
    assertDoesNotThrow(() -> java.util.UUID.fromString(token));
  }
}