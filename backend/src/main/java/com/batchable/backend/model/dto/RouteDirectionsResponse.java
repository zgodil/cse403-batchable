package com.batchable.backend.model.dto;

import java.util.List;

/**
 * DTO (Data Transfer Object) representing a simplified response from the Google Routes API.
 *
 * Responsibilities: - Holds the encoded polyline, total distance, and total duration of a route. -
 * Provides a flattened structure suitable for returning JSON responses to clients. - Parses
 * Google's nested response structure into simple fields.
 */
public class RouteDirectionsResponse {

  /** Encoded polyline representing the full route for mapping on clients */
  private String polyline;

  /** Total distance of the route in meters */
  private int distanceMeters;

  /** Total travel duration of the route in seconds */
  private int durationSeconds;

  /** Default constructor required by Spring / Jackson for deserialization */
  public RouteDirectionsResponse() {}

  /**
   * Constructs a RouteDirectionsResponse by parsing Google’s nested response.
   *
   * @param googleResponse the parsed Google API response object
   */
  public RouteDirectionsResponse(GoogleResponse googleResponse) {
    if (googleResponse != null && googleResponse.getRoutes() != null
        && !googleResponse.getRoutes().isEmpty()) {

      GoogleResponse.Route firstRoute = googleResponse.getRoutes().get(0);

      if (firstRoute.getPolyline() != null) {
        this.polyline = firstRoute.getPolyline().getEncodedPolyline();
      }

      this.distanceMeters = firstRoute.getDistanceMeters();

      // Parse duration string of the form "<seconds>s"
      String durationString = firstRoute.getDuration();
      if (durationString != null && durationString.endsWith("s")) {
        this.durationSeconds =
            Integer.parseInt(durationString.substring(0, durationString.length() - 1));
      }

      if (distanceMeters < 0 || durationSeconds < 0) {
        throw new IllegalStateException(
            "Parsed distance or duration from Google API was negative.");
      }
    }
  }

  /** Returns the encoded polyline of the route */
  public String getPolyline() {
    return polyline;
  }

  /** Sets the encoded polyline of the route */
  public void setPolyline(String polyline) {
    this.polyline = polyline;
  }

  /** Returns the total distance of the route in meters */
  public int getDistanceMeters() {
    return distanceMeters;
  }

  /** Sets the total distance of the route in meters */
  public void setDistanceMeters(int distanceMeters) {
    if (distanceMeters < 0) {
      throw new IllegalArgumentException("Distance must be nonnegative.");
    }
    this.distanceMeters = distanceMeters;
  }

  /** Returns the total duration of the route in seconds */
  public int getDurationSeconds() {
    return durationSeconds;
  }

  /** Sets the total duration of the route in seconds */
  public void setDurationSeconds(int durationSeconds) {
    if (durationSeconds < 0) {
      throw new IllegalArgumentException("Duration must be nonnegative.");
    }
    this.durationSeconds = durationSeconds;
  }

  /**
   * Nested DTO representing the structure of Google's Routes API response. Contains routes, each
   * with polyline, distance, and duration fields.
   */
  public static class GoogleResponse {

    /** List of routes returned by the Google API */
    private List<Route> routes;

    /** Returns the list of routes */
    public List<Route> getRoutes() {
      return routes;
    }

    /** Sets the list of routes */
    public void setRoutes(List<Route> routes) {
      this.routes = routes;
    }

    /**
     * Represents a single route returned by Google. Contains polyline, distance, and duration
     * information.
     */
    public static class Route {

      /** Polyline object containing encoded path */
      private Polyline polyline;

      /** Total distance of this route in meters */
      private int distanceMeters;

      /** Duration string formatted as "<seconds>s" */
      private String duration;

      /** Returns the polyline object */
      public Polyline getPolyline() {
        return polyline;
      }

      /** Sets the polyline object */
      public void setPolyline(Polyline polyline) {
        this.polyline = polyline;
      }

      /** Returns the total distance in meters */
      public int getDistanceMeters() {
        return distanceMeters;
      }

      /** Sets the total distance in meters */
      public void setDistanceMeters(int distanceMeters) {
        if (distanceMeters < 0)
          throw new IllegalArgumentException("Distance must be nonnegative.");
        this.distanceMeters = distanceMeters;
      }

      /** Returns the duration string "<seconds>s" */
      public String getDuration() {
        return duration;
      }

      /** Sets the duration string "<seconds>s" */
      public void setDuration(String duration) {
        this.duration = duration;
      }

      /**
       * Represents the polyline object in Google’s API. Encodes the sequence of points along the
       * route.
       */
      public static class Polyline {

        /** Encoded polyline string */
        private String encodedPolyline;

        /** Returns the encoded polyline string */
        public String getEncodedPolyline() {
          return encodedPolyline;
        }

        /** Sets the encoded polyline string */
        public void setEncodedPolyline(String encodedPolyline) {
          this.encodedPolyline = encodedPolyline;
        }
      }
    }
  }
}
