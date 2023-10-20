package edu.ucsb.cs156.courses.models;

import lombok.*;

/**
 * This class represents the public information about the application.
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SystemInfo {
    private Boolean springH2ConsoleEnabled;
    private Boolean showSwaggerUILink;
    private String startQtrYYYYQ;
    private String endQtrYYYYQ;
    private String sourceRepo;
}
