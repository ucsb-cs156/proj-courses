package edu.ucsb.cs156.courses.filters;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

public class RateLimitFilter extends OncePerRequestFilter {

  private final int initialBucketSize;
  private final int refillPerMinute;

  public RateLimitFilter(int initialBucketSize, int refillPerMinute) {
    this.initialBucketSize = initialBucketSize;
    this.refillPerMinute = refillPerMinute;
  }

  // Caffeine cache: Keys are IP addresses, Values are Bucket objects.
  // Entries expire 1 hour after the last access.
  private final Cache<String, Bucket> cache =
      Caffeine.newBuilder()
          .expireAfterAccess(1, TimeUnit.HOURS)
          .maximumSize(10000) // Protects against memory exhaustion from botnets
          .build();

  Bucket createNewBucket() {
    Bandwidth limit =
        Bandwidth.classic(
            initialBucketSize, Refill.intervally(refillPerMinute, Duration.ofMinutes(1)));
    return Bucket.builder().addLimit(limit).build();
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // Prefer X-Forwarded-For when behind a proxy like Nginx or AWS load balancers
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    String ip =
        (xForwardedFor != null && !xForwardedFor.isBlank())
            ? xForwardedFor.split(",")[0].trim()
            : request.getRemoteAddr();

    // Get or create the bucket for this IP
    Bucket bucket = cache.get(ip, key -> createNewBucket());

    if (bucket.tryConsume(1)) {
      // Success: Continue to the next filter/controller
      filterChain.doFilter(request, response);
    } else {
      // Failure: Too many requests
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
      response.setContentType("text/plain");
      response.getWriter().write("Too many requests. Your IP has been throttled.");
    }
  }
}
