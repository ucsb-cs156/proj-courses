package edu.ucsb.cs156.courses.config;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import edu.ucsb.cs156.courses.filters.RateLimitFilter;
import edu.ucsb.cs156.courses.repositories.RateLimitedIPRepository;
import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class RateLimitConfig {

  @Value("${app.ratelimit.initialBucketSize}")
  private int initialBucketSize;

  @Value("${app.ratelimit.refillPerMinute}")
  private int refillPerMinute;

  @Value("${app.geoip.databasePath:}")
  private String geoIpDatabasePath;

  @Autowired private RateLimitedIPRepository rateLimitedIPRepository;

  @Bean
  public RateLimitFilter rateLimitFilter() {
    return new RateLimitFilter(
        initialBucketSize,
        refillPerMinute,
        rateLimitedIPRepository,
        createGeolocationProvider());
  }

  private RateLimitFilter.GeolocationProvider createGeolocationProvider() {
    if (geoIpDatabasePath == null || geoIpDatabasePath.isBlank()) {
      log.info("No GeoIP database path configured; rate-limited IP geolocation will be skipped.");
      return (record, ipAddress) -> {};
    }

    File databaseFile = new File(geoIpDatabasePath);
    if (!databaseFile.exists()) {
      log.warn(
          "GeoIP database file {} was not found; rate-limited IP geolocation will be skipped.",
          geoIpDatabasePath);
      return (record, ipAddress) -> {};
    }

    final DatabaseReader databaseReader;
    try {
      databaseReader = new DatabaseReader.Builder(databaseFile).build();
    } catch (IOException e) {
      log.warn(
          "Unable to read GeoIP database file {}; rate-limited IP geolocation will be skipped.",
          geoIpDatabasePath,
          e);
      return (record, ipAddress) -> {};
    }

    return (record, ipAddress) -> {
      try {
        CityResponse response = databaseReader.city(InetAddress.getByName(ipAddress));
        record.setCountry(getEnglishName(response.country().names()));
        record.setCity(getEnglishName(response.city().names()));
        record.setState(getEnglishName(response.mostSpecificSubdivision().names()));
        record.setPostalCode(response.postal().code());
        record.setLatitude(response.location().latitude());
        record.setLongitude(response.location().longitude());
      } catch (Exception e) {
        log.debug("Unable to geolocate IP address {}", ipAddress, e);
      }
    };
  }

  private String getEnglishName(Map<String, String> names) {
    return names == null ? null : names.get("en");
  }
}
