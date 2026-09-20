package edu.ucsb.cs156.courses.documents;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;

public class PrimaryTests {

  ConvertedSection makeConvertedSection(String quarter, String courseId, String sectionNumber) {
    CourseInfo courseInfo =
        CourseInfo.builder()
            .quarter(quarter)
            .courseId(courseId)
            .title("Title for " + courseId)
            .description("Description for " + courseId)
            .generalEducation(new ArrayList<GeneralEducation>())
            .build();
    Section section =
        Section.builder().enrollCode("enrollCode-" + sectionNumber).section(sectionNumber).build();
    return ConvertedSection.builder().courseInfo(courseInfo).section(section).build();
  }

  @Test
  public void test_fromConvertedSections_emptyList() {
    List<Primary> result = Primary.fromConvertedSections(new ArrayList<>());
    assertEquals(new ArrayList<Primary>(), result);
  }

  @Test
  public void test_fromConvertedSections_groupsSecondariesUnderPrimary() {
    ConvertedSection primary = makeConvertedSection("20222", "CMPSC   130A ", "0100");
    ConvertedSection secondary1 = makeConvertedSection("20222", "CMPSC   130A ", "0101");
    ConvertedSection secondary2 = makeConvertedSection("20222", "CMPSC   130A ", "0102");

    // pass in out of order to check sorting by section number within a quarter
    List<Primary> result =
        Primary.fromConvertedSections(Arrays.asList(secondary2, primary, secondary1));

    Primary expected =
        Primary.builder()
            .quarter("20222")
            .courseId("CMPSC   130A ")
            .title("Title for CMPSC   130A ")
            .description("Description for CMPSC   130A ")
            .primary(primary.getSection())
            .subRows(
                new ArrayList<>(Arrays.asList(secondary1.getSection(), secondary2.getSection())))
            .generalEducation(new ArrayList<>())
            .build();

    assertEquals(Arrays.asList(expected), result);
  }

  @Test
  public void test_fromConvertedSections_multiplePrimariesInOneQuarter() {
    ConvertedSection primary1 = makeConvertedSection("20222", "CMPSC   130A ", "0100");
    ConvertedSection secondary1 = makeConvertedSection("20222", "CMPSC   130A ", "0101");
    ConvertedSection primary2 = makeConvertedSection("20222", "CMPSC   130A ", "0200");
    ConvertedSection secondary2 = makeConvertedSection("20222", "CMPSC   130A ", "0201");

    List<Primary> result =
        Primary.fromConvertedSections(Arrays.asList(primary2, secondary2, primary1, secondary1));

    assertEquals(2, result.size());
    assertEquals(primary1.getSection(), result.get(0).getPrimary());
    assertEquals(Arrays.asList(secondary1.getSection()), result.get(0).getSubRows());
    assertEquals(primary2.getSection(), result.get(1).getPrimary());
    assertEquals(Arrays.asList(secondary2.getSection()), result.get(1).getSubRows());
  }

  @Test
  public void test_fromConvertedSections_sortsQuartersDescending() {
    ConvertedSection older = makeConvertedSection("20221", "CMPSC   130A ", "0100");
    ConvertedSection newer = makeConvertedSection("20224", "CMPSC   130A ", "0100");

    List<Primary> result = Primary.fromConvertedSections(Arrays.asList(older, newer));

    assertEquals(2, result.size());
    assertEquals("20224", result.get(0).getQuarter());
    assertEquals("20221", result.get(1).getQuarter());
  }

  @Test
  public void test_fromConvertedSections_secondaryWithoutPrimaryBecomesOwnRow() {
    ConvertedSection lonelySecondary = makeConvertedSection("20222", "CMPSC   130A ", "0101");

    List<Primary> result = Primary.fromConvertedSections(Arrays.asList(lonelySecondary));

    assertEquals(1, result.size());
    assertEquals(lonelySecondary.getSection(), result.get(0).getPrimary());
    assertEquals(new ArrayList<Section>(), result.get(0).getSubRows());
  }

  @Test
  public void test_fromConvertedSections_secondaryFromDifferentQuarterNotGrouped() {
    ConvertedSection primary = makeConvertedSection("20224", "CMPSC   130A ", "0100");
    ConvertedSection secondaryOtherQuarter = makeConvertedSection("20222", "CMPSC   130A ", "0101");

    List<Primary> result =
        Primary.fromConvertedSections(Arrays.asList(primary, secondaryOtherQuarter));

    assertEquals(2, result.size());
    assertEquals("20224", result.get(0).getQuarter());
    assertEquals(new ArrayList<Section>(), result.get(0).getSubRows());
    assertEquals("20222", result.get(1).getQuarter());
    assertEquals(secondaryOtherQuarter.getSection(), result.get(1).getPrimary());
  }

  @Test
  public void test_fromConvertedSections_secondaryFromDifferentCourseNotGrouped() {
    ConvertedSection primary = makeConvertedSection("20222", "CMPSC   130A ", "0100");
    ConvertedSection secondaryOtherCourse = makeConvertedSection("20222", "CMPSC   130B ", "0101");

    List<Primary> result =
        Primary.fromConvertedSections(Arrays.asList(primary, secondaryOtherCourse));

    assertEquals(2, result.size());
    assertEquals("CMPSC   130A ", result.get(0).getCourseId());
    assertEquals(new ArrayList<Section>(), result.get(0).getSubRows());
    assertEquals("CMPSC   130B ", result.get(1).getCourseId());
    assertEquals(secondaryOtherCourse.getSection(), result.get(1).getPrimary());
  }

  @Test
  public void test_fromConvertedSections_nullQuarterSortsLast() {
    ConvertedSection nullQuarter = makeConvertedSection(null, "CMPSC   130A ", "0100");
    ConvertedSection withQuarter = makeConvertedSection("20221", "CMPSC   130A ", "0100");

    List<Primary> result = Primary.fromConvertedSections(Arrays.asList(nullQuarter, withQuarter));

    assertEquals(2, result.size());
    assertEquals("20221", result.get(0).getQuarter());
    assertEquals(null, result.get(1).getQuarter());
  }

  @Test
  public void test_fromConvertedSections_nullSectionNumberSortsLast() {
    ConvertedSection primary = makeConvertedSection("20222", "CMPSC   130A ", "0100");
    ConvertedSection nullSection = makeConvertedSection("20222", "CMPSC   130A ", null);

    List<Primary> result = Primary.fromConvertedSections(Arrays.asList(nullSection, primary));

    assertEquals(1, result.size());
    assertEquals(primary.getSection(), result.get(0).getPrimary());
    assertEquals(Arrays.asList(nullSection.getSection()), result.get(0).getSubRows());
  }
}
