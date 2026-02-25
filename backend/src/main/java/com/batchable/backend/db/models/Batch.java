package com.batchable.backend.db.models;

import java.time.Instant;

public final class Batch {
    public final long id;
    public final long driverId;
    public final String route; // Google encoded polyline
    public final Instant dispatchTime;
    public final Instant completionTime;
    public final boolean finished;

    public Batch(
            long id,
            long driverId,
            String route,
            Instant dispatchTime,
            Instant completionTime,
            boolean finished

    ) {
        this.id = id;
        this.driverId = driverId;
        this.route = route;
        this.dispatchTime = dispatchTime;
        this.completionTime = completionTime;
        this.finished = finished;
    }
}
