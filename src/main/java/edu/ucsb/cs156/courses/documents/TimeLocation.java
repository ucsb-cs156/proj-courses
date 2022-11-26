package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimeLocation implements Cloneable {
    private String room;
    private String building;
    private String roomCapacity;
    private String days; 
    private String beginTime; 
    private String endTime;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
