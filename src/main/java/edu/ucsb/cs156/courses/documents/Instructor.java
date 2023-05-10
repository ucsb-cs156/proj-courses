package edu.ucsb.cs156.courses.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Instructor implements Cloneable {
    private String instructor;
    private String functionCode;
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
