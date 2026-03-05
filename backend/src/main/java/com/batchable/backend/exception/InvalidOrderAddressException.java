package com.batchable.backend.exception;

/**
 * Thrown when an order cannot be created or added to batching because the restaurant or delivery
 * address is invalid (e.g. Google Routes API cannot compute a route). Allows the API to return
 * 400 Bad Request with a clear message instead of 500.
 */
public class InvalidOrderAddressException extends RuntimeException {

  public InvalidOrderAddressException(String message) {
    super(message);
  }

  public InvalidOrderAddressException(String message, Throwable cause) {
    super(message, cause);
  }
}
