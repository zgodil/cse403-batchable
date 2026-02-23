package com.batchable.backend.controller;

import com.batchable.backend.db.models.Driver;
import com.batchable.backend.db.models.MenuItem;
import com.batchable.backend.db.models.Order;
import com.batchable.backend.db.models.Restaurant;
import com.batchable.backend.service.BatchingManager;
import com.batchable.backend.service.RestaurantService;
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
@RequestMapping("/api/restaurant")
public class RestaurantController {

  private final RestaurantService restaurantService;
  private final BatchingManager batchingManager;

  /**
   * Constructor injection: Spring automatically provides a RestaurantService instance because it is
   * annotated with @Service
   */
  public RestaurantController(RestaurantService restaurantService, BatchingManager batchingManager) {
    this.restaurantService = restaurantService;
    this.batchingManager = batchingManager;
  }

  /**
   * Get the current user's restaurant (from JWT sub). Creates one if none exists.
   *
   * GET /api/restaurant/me
   */
  @GetMapping("/me")
  @ResponseStatus(HttpStatus.OK)
  public Restaurant getMyRestaurant(@AuthenticationPrincipal Jwt jwt) {
    String sub = jwt == null ? null : jwt.getSubject();
    return restaurantService.getOrCreateRestaurantForUser(sub);
  }

  /**
   * Update the current user's restaurant (name and location). Restaurant is identified by JWT.
   *
   * PUT /api/restaurant/me
   *
   * @param jwt the authenticated user's JWT
   * @param body restaurant payload with name and location (id ignored)
   */
  @PutMapping("/me")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void updateMyRestaurant(
      @AuthenticationPrincipal Jwt jwt,
      @RequestBody Restaurant body) {
    String sub = jwt == null ? null : jwt.getSubject();
    restaurantService.updateMyRestaurantForUser(sub, body);
    Restaurant updated = restaurantService.getOrCreateRestaurantForUser(sub);
    batchingManager.updateManagerAddress(updated);
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
   * GET /api/restaurant/{restaurantId}
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