package edu.ucsb.cs156.courses.filters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class RateLimitFilterTests {

  private RateLimitFilter rateLimitFilter;

  @BeforeEach
  public void setUp() {
    rateLimitFilter = new RateLimitFilter(10, 10);
  }

  @Test
  public void testRequestAllowedWhenUnderRateLimit() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);

    when(request.getRemoteAddr()).thenReturn("192.168.1.1");

    rateLimitFilter.doFilterInternal(request, response, filterChain);

    verify(filterChain, times(1)).doFilter(request, response);
    verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
  }

  @Test
  public void testRequestBlockedWhenOverRateLimit() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter printWriter = new PrintWriter(stringWriter);

    when(request.getRemoteAddr()).thenReturn("10.0.0.1");
    when(response.getWriter()).thenReturn(printWriter);

    // Exhaust the 10-request bucket
    for (int i = 0; i < 10; i++) {
      rateLimitFilter.doFilterInternal(request, response, filterChain);
    }

    // The 11th request should be blocked
    rateLimitFilter.doFilterInternal(request, response, filterChain);

    verify(filterChain, times(10)).doFilter(request, response);
    verify(response, times(1)).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    verify(response, times(1)).setContentType("text/plain");
    printWriter.flush();
    assertEquals("Too many requests. Your IP has been throttled.", stringWriter.toString());
  }

  @Test
  public void testCreateNewBucketReturnsNonNullBucket() {
    Bucket bucket = rateLimitFilter.createNewBucket();
    assertNotNull(bucket);
    // New bucket should allow consuming tokens
    assertTrue(bucket.tryConsume(1));
  }

  @Test
  public void testDifferentIpsHaveIndependentBuckets() throws Exception {
    HttpServletRequest request1 = mock(HttpServletRequest.class);
    HttpServletRequest request2 = mock(HttpServletRequest.class);
    HttpServletResponse response1 = mock(HttpServletResponse.class);
    HttpServletResponse response2 = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter printWriter = new PrintWriter(stringWriter);

    when(request1.getRemoteAddr()).thenReturn("172.16.0.1");
    when(request2.getRemoteAddr()).thenReturn("172.16.0.2");
    when(response1.getWriter()).thenReturn(printWriter);
    when(response2.getWriter()).thenReturn(printWriter);

    // Exhaust ip1's bucket
    for (int i = 0; i < 10; i++) {
      rateLimitFilter.doFilterInternal(request1, response1, filterChain);
    }
    // ip1 should be rate-limited
    rateLimitFilter.doFilterInternal(request1, response1, filterChain);
    verify(response1, times(1)).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());

    // ip2 should still be allowed
    rateLimitFilter.doFilterInternal(request2, response2, filterChain);
    verify(response2, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
  }

  @Test
  public void testXForwardedForHeaderUsedWhenPresent() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter printWriter = new PrintWriter(stringWriter);

    // Simulate a proxied request where X-Forwarded-For contains the real client IP
    when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 10.0.0.1");
    when(response.getWriter()).thenReturn(printWriter);

    // Exhaust the bucket for the real client IP (203.0.113.1)
    for (int i = 0; i < 10; i++) {
      rateLimitFilter.doFilterInternal(request, response, filterChain);
    }
    rateLimitFilter.doFilterInternal(request, response, filterChain);

    verify(filterChain, times(10)).doFilter(request, response);
    verify(response, times(1)).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
  }

  @Test
  public void testRemoteAddrUsedWhenXForwardedForIsAbsent() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);

    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getRemoteAddr()).thenReturn("198.51.100.1");

    rateLimitFilter.doFilterInternal(request, response, filterChain);

    verify(filterChain, times(1)).doFilter(request, response);
    verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
  }

  @Test
  public void testRemoteAddrUsedWhenXForwardedForIsBlank() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain filterChain = mock(FilterChain.class);

    when(request.getHeader("X-Forwarded-For")).thenReturn("   ");
    when(request.getRemoteAddr()).thenReturn("198.51.100.2");

    rateLimitFilter.doFilterInternal(request, response, filterChain);

    verify(filterChain, times(1)).doFilter(request, response);
    verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
  }
}
