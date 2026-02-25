package com.batchable.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Maps invalid-order-address exceptions to 400 Bad Request so the client can show a clear message
 * instead of a generic 500.
 */
@RestControllerAdvice
public class InvalidOrderAddressHandler {

  @ExceptionHandler(InvalidOrderAddressException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public String handleInvalidOrderAddress(InvalidOrderAddressException e) {
    return e.getMessage();
  }
}
