package com.batchable.backend.controller;

import com.batchable.backend.db.dao.RestaurantDAO;
import com.batchable.backend.db.models.Driver;
import com.batchable.backend.db.models.MenuItem;
import com.batchable.backend.db.models.Order;
import com.batchable.backend.db.models.Restaurant;
import com.batchable.backend.service.BatchingManager;
import com.batchable.backend.service.RestaurantService;
import java.sql.SQLException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/restaurant")
public class RestaurantController {

  private final RestaurantDAO restaurantDAO;
  private final RestaurantService restaurantService;
  private final BatchingManager batchingManager;

  /**
   * Constructor injection: Spring automatically provides a RestaurantService instance because it is
   * annotated with @Service
   */
  public RestaurantController(RestaurantService restaurantService, BatchingManager batchingManager, RestaurantDAO restaurantDAO) {
    this.restaurantService = restaurantService;
    this.batchingManager = batchingManager;
    this.restaurantDAO = restaurantDAO;
  }

  /**
   * Get the current user's restaurant id (from JWT sub). Creates one if none exists.
   *
   * GET /restaurant/me
   */
  @GetMapping("/me")
  @ResponseStatus(HttpStatus.OK)
  public long getMyRestaurantId(@AuthenticationPrincipal Jwt jwt) {
    String auth0UserId = jwt == null ? null : jwt.getSubject();

    if (auth0UserId == null || auth0UserId.isBlank())
      throw new IllegalArgumentException("auth0UserId is required");

    try {
      return restaurantDAO.getRestaurantByAuth0UserId(auth0UserId)
          .map(restaurant -> restaurant.id)
          .orElseGet(() -> {
            try {
              long restaurantId = restaurantDAO.createRestaurant(
                  "My Restaurant",
                  "Address not set",
                  auth0UserId);
              batchingManager.addManager(restaurantId);
              return restaurantId;
            } catch (SQLException e) {
              throw new RuntimeException("Failed to create restaurant for user", e);
            }
          });
    } catch (SQLException e) {
      throw new RuntimeException("Failed to get restaurant for user", e);
    }
  }

  /**
   * Update mutable fields of an existing restaurant.
   *
   * PUT /restaurant
   *
   * @param restaurant Restaurant object containing updated fields
   */
  @PutMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updateRestaurant(@RequestBody Restaurant restaurant) {
    restaurantService.updateRestaurant(restaurant);
    batchingManager.updateManagerAddress(restaurant);
  }

  /**
   * Get a restaurant by ID.
   *
   * GET /restaurant/{restaurantId}
   *
   * @param restaurantId the ID of the restaurant
   * @return the Restaurant object
   */
  @GetMapping("/{restaurantId}")
  @ResponseStatus(HttpStatus.OK)
  public Restaurant getRestaurant(@PathVariable long restaurantId) {
    return restaurantService.getRestaurant(restaurantId);
  }

  /**
   * Delete a restaurant by ID.
   *
   * DELETE /restaurant/{restaurantId}
   *
   * @param restaurantId the ID of the restaurant to delete
   */
  @DeleteMapping("/{restaurantId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeRestaurant(@PathVariable long restaurantId) {
    restaurantService.removeRestaurant(restaurantId);
    batchingManager.removeManager(restaurantId);
  }

  /**
   * Get all active orders for a restaurant.
   *
   * GET restaurant/{restaurantId}/orders
   *
   * @param restaurantId the restaurant ID
   * @return list of Orders
   */
  @GetMapping("/{restaurantId}/orders")
  @ResponseStatus(HttpStatus.OK)
  public List<Order> getRestaurantOrders(@PathVariable long restaurantId) {
    return restaurantService.getRestaurantOrders(restaurantId);
  }

  /**
   * Get all drivers associated with a restaurant.
   *
   * GET /restaurant/{restaurantId}/drivers
   *
   * @param restaurantId the restaurant ID
   * @return array of Driver objects
   */
  @GetMapping("/{restaurantId}/drivers")
  @ResponseStatus(HttpStatus.OK)
  public List<Driver> getRestaurantDrivers(@PathVariable long restaurantId) {
    return restaurantService.getRestaurantDrivers(restaurantId);
  }

  /**
   * Get all menu items associated with a restaurant.
   *
   * GET /restaurant/{restaurantId}/menu
   *
   * @param restaurantId the restaurant ID
   * @return array of MenuItem objects
   */
  @GetMapping("/{restaurantId}/menu")
  @ResponseStatus(HttpStatus.OK)
  public List<MenuItem> getRestaurantMenuItems(@PathVariable long restaurantId) {
    return restaurantService.getRestaurantMenuItems(restaurantId);
  }
}