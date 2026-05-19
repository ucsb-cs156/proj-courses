package edu.ucsb.cs156.courses.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "rate_limited_ips")
public class RateLimitedIP {
  @Id private String ipAddress;

  private long requestCount;

  private ZonedDateTime lastRequestAt;
}
