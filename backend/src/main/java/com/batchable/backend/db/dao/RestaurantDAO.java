package com.batchable.backend.db.dao;

import com.batchable.backend.db.models.Restaurant;

import javax.sql.DataSource;

import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class RestaurantDAO {

    // Spring-managed connection pool
    private final DataSource dataSource;

    public RestaurantDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public long createRestaurant(String name, String location) throws SQLException {
        return createRestaurant(name, location, null);
    }

    public long createRestaurant(String name, String location, String auth0UserId) throws SQLException {
        final String sql = "INSERT INTO Restaurant(name, location, auth0_user_id) VALUES (?, ?, ?) RETURNING id;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, location);
            ps.setString(3, auth0UserId);

            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong("id");
            }
        }
    }

    public Optional<Restaurant> getRestaurant(long id) throws SQLException {
        final String sql = "SELECT id, name, location, auth0_user_id FROM Restaurant WHERE id = ?;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                return Optional.of(mapRestaurant(rs));
            }
        }
    }

    public Optional<Restaurant> getRestaurantByAuth0UserId(String auth0UserId) throws SQLException {
        if (auth0UserId == null || auth0UserId.isBlank()) return Optional.empty();
        final String sql = "SELECT id, name, location, auth0_user_id FROM Restaurant WHERE auth0_user_id = ?;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, auth0UserId);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                return Optional.of(mapRestaurant(rs));
            }
        }
    }

    public List<Restaurant> listRestaurants() throws SQLException {
        final String sql = "SELECT id, name, location, auth0_user_id FROM Restaurant ORDER BY id;";
        List<Restaurant> out = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                out.add(mapRestaurant(rs));
            }
        }

        return out;
    }

    public boolean updateRestaurant(long restaurantId, String name, String location) throws SQLException {
        final String sql = "UPDATE Restaurant SET name = ?, location = ? WHERE id = ?;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, location);
            ps.setLong(3, restaurantId);

            return ps.executeUpdate() == 1;
        }
    }

    public boolean deleteRestaurant(long restaurantId) throws SQLException {
        final String sql = "DELETE FROM Restaurant WHERE id = ?;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, restaurantId);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean restaurantExists(long restaurantId) throws SQLException {
        final String sql = "SELECT 1 FROM Restaurant WHERE id = ? LIMIT 1;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, restaurantId);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public boolean restaurantExistsByName(String name) throws SQLException {
        final String sql = "SELECT 1 FROM Restaurant WHERE name = ? LIMIT 1;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public boolean restaurantExistsByNameExcludingId(long excludedRestaurantId, String name) throws SQLException {
        final String sql = "SELECT 1 FROM Restaurant WHERE name = ? AND id <> ? LIMIT 1;";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setLong(2, excludedRestaurantId);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    private static Restaurant mapRestaurant(ResultSet rs) throws SQLException {
        String auth0UserId = rs.getString("auth0_user_id");
        if (rs.wasNull()) auth0UserId = null;
        return new Restaurant(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getString("location"),
            auth0UserId
        );
    }
}
