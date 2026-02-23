package com.batchable.backend.db.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public final class Restaurant {
    public final long id;
    public final String name;
    public final String location;
    /** Auth0 user id (sub claim); null for legacy rows. */
    public final String auth0UserId;

    public Restaurant(long id, String name, String location) {
        this(id, name, location, null);
    }

    @JsonCreator
    public Restaurant(
            @JsonProperty("id") long id,
            @JsonProperty("name") String name,
            @JsonProperty("location") String location,
            @JsonProperty(value = "auth0UserId", required = false) String auth0UserId) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.auth0UserId = auth0UserId;
    }
}
