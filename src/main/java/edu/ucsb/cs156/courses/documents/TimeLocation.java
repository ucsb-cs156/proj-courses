package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeLocation {
    private String room;
    private String building;
    private String roomCapacity;
    private String days; 
    private String beginTime; 
    private String endTime;
}
