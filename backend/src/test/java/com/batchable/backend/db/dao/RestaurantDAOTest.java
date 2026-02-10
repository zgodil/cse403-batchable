package com.batchable.backend.db.dao;

import com.batchable.backend.db.PostgresTestBase;
import com.batchable.backend.db.models.Restaurant;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class RestaurantDAOTest extends PostgresTestBase {

  @Test
  void createRestaurant_thenGetRestaurant_roundTrip() throws Exception {
    RestaurantDAO dao = new RestaurantDAO(conn);

    long id = dao.createRestaurant("R1", "47.6062,-122.3321");

    Optional<Restaurant> got = dao.getRestaurant(id);
    assertTrue(got.isPresent());

    Restaurant r = got.get();
    assertEquals(id, r.id);
    assertEquals("R1", r.name);
    assertEquals("47.6062,-122.3321", r.location);
  }

  @Test
  void getRestaurant_missing_returnsEmpty() throws Exception {
    RestaurantDAO dao = new RestaurantDAO(conn);

    Optional<Restaurant> got = dao.getRestaurant(999999L);
    assertTrue(got.isEmpty());
  }

  @Test
  void listRestaurants_returnsAllInIdOrder() throws Exception {
    RestaurantDAO dao = new RestaurantDAO(conn);

    long id1 = dao.createRestaurant("A", "locA");
    long id2 = dao.createRestaurant("B", "locB");
    long id3 = dao.createRestaurant("C", "locC");

    List<Restaurant> all = dao.listRestaurants();
    assertTrue(all.size() >= 3);

    // only look at the last 3 we inserted (since DB might already have seed data later)
    List<Restaurant> tail = all.subList(all.size() - 3, all.size());
    assertEquals(id1, tail.get(0).id);
    assertEquals(id2, tail.get(1).id);
    assertEquals(id3, tail.get(2).id);

    assertEquals("A", tail.get(0).name);
    assertEquals("B", tail.get(1).name);
    assertEquals("C", tail.get(2).name);
  }
}
