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
    final DatabaseReader databaseReader = getDatabaseReader();

    return (record, ipAddress) -> {
      try {
        InetAddress inetAddress = InetAddress.getByName(ipAddress);
        record.setHostname(getResolvedHostName(inetAddress));
        if (databaseReader == null) {
          return;
        }

        CityResponse response = databaseReader.city(inetAddress);
        record.setCountry(getEnglishName(response.country().names()));
        record.setCity(getEnglishName(response.city().names()));
        record.setState(getEnglishName(response.mostSpecificSubdivision().names()));
        record.setPostalCode(response.postal().code());
        record.setLatitude(response.location().latitude());
        record.setLongitude(response.location().longitude());
      } catch (Exception e) {
        log.debug("Unable to populate metadata for IP address {}", ipAddress, e);
      }
    };
  }

  private DatabaseReader getDatabaseReader() {
    if (geoIpDatabasePath == null || geoIpDatabasePath.isBlank()) {
      log.info("No GeoIP database path configured; rate-limited IP geolocation will be skipped.");
      return null;
    }

    File databaseFile = new File(geoIpDatabasePath);
    if (!databaseFile.exists()) {
      log.warn(
          "GeoIP database file {} was not found; rate-limited IP geolocation will be skipped.",
          geoIpDatabasePath);
      return null;
    }

    try {
      return new DatabaseReader.Builder(databaseFile).build();
    } catch (IOException e) {
      log.warn(
          "Unable to read GeoIP database file {}; rate-limited IP geolocation will be skipped.",
          geoIpDatabasePath,
          e);
      return null;
    }
  }

  private String getEnglishName(Map<String, String> names) {
    return names == null ? null : names.get("en");
  }

  private String getResolvedHostName(InetAddress inetAddress) {
    String hostName = inetAddress.getCanonicalHostName();
    return hostName.equals(inetAddress.getHostAddress()) ? null : hostName;
  }
}
