package edu.ucsb.cs156.courses.models;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A user-facing system message, shown as a banner under the navbar. {@code variant} is one of the
 * React Bootstrap Alert variants this app uses: "danger", "warning", "success", or "info".
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SystemMessage {
  private String variant;
  private String message;
}
