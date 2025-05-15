package edu.ucsb.cs156.courses.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "ucsb_ge_areas")


/*
 * Definitions
 * 
 * Areas of GE: 
 * 
 * Area A - English Reading and Composition
 * Area B - Foreign Language
 * Area C - Science, Mathematics, and Technology
 * Area D - Social Science
 * Area E - Culture and Thought
 * Area F - Arts
 * Area G - Literature
 * 
 * Writing (A1 & A2)  -->> This is different from Area A
 * European Traditions
 * World Cultures
 * Quantitative Relationships
 * Ethnicity
 * American History and Institutions
 * 
 * One course can fufill multiple GE requirements 
 * 
 * @def
 * geAreaCode: The code of the specific GE
 * geAreaName: The name of the specific GE
 * 
 */

public class UCSBGE {
    @Id

    private String geAreaCode;  // e.g. "A", "B", "A1", 
    private String geAreaName;  // e.g. "Arts & Humanities"
}
