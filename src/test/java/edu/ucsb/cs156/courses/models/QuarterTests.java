package edu.ucsb.cs156.courses.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class QuarterTests {

  @Test
  public void test_constructor_20194() throws Exception {
    Quarter q = new Quarter(20194);
    assertEquals(20194, q.getValue());
    assertEquals("F19", q.toString());
  }

  @Test
  public void test_constructor_F19() throws Exception {
    Quarter q = new Quarter("F19");
    assertEquals(20194, q.getValue());
    assertEquals("F19", q.toString());
  }

  @Test
  public void test_constructor_20201_int() throws Exception {
    Quarter q = new Quarter(20201);
    assertEquals(20201, q.getValue());
    assertEquals("W20", q.toString());
  }

  @Test
  public void test_constructor_20201_String() throws Exception {
    Quarter q = new Quarter("20201");
    assertEquals(20201, q.getValue());
    assertEquals("W20", q.toString());
  }

  @Test
  public void test_constructor_W20() throws Exception {
    Quarter q = new Quarter("W20");
    assertEquals(20201, q.getValue());
    assertEquals("W20", q.toString());
  }

  @Test
  public void test_constructor_bad_input() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter q = new Quarter("foo");
        });
  }

  @Test
  public void test_constructor_bad_input_wrong_digits() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter q = new Quarter("2020");
        });
  }

  @Test
  public void test_setValue_bad_input() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter q = new Quarter(5);
        });
  }

  @Test
  public void test_constructor_S20() throws Exception {
    Quarter q = new Quarter("S20");
    assertEquals(20202, q.getValue());
    assertEquals("S20", q.toString());
  }

  @Test
  public void test_constructor_M20() throws Exception {
    Quarter q = new Quarter("M20");
    assertEquals(20203, q.getValue());
    assertEquals("M20", q.toString());
  }

  @Test
  public void test_constructor_F01() throws Exception {
    Quarter q = new Quarter("F01");
    assertEquals(20014, q.getValue());
    assertEquals("F01", q.toString());
  }

  @Test
  public void test_constructor_S99() throws Exception {
    Quarter q = new Quarter("S99");
    assertEquals(19992, q.getValue());
    assertEquals("S99", q.toString());
  }

  @Test
  public void test_increment_F19() throws Exception {
    Quarter q = new Quarter("F19");
    assertEquals(20201, q.increment());
    assertEquals("W20", q.toString());
  }

  @Test
  public void test_increment_W20() throws Exception {
    Quarter q = new Quarter("W20");
    assertEquals(20202, q.increment());
    assertEquals("S20", q.toString());
  }

  @Test
  public void test_increment_S20() throws Exception {
    Quarter q = new Quarter("S20");
    assertEquals(20203, q.increment());
    assertEquals("M20", q.toString());
  }

  @Test
  public void test_increment_M20() throws Exception {
    Quarter q = new Quarter("M20");
    assertEquals(20204, q.increment());
    assertEquals("F20", q.toString());
  }

  @Test
  public void test_decrement_F19() throws Exception {
    Quarter q = new Quarter("F19");
    assertEquals(20193, q.decrement());
    assertEquals("M19", q.toString());
  }

  @Test
  public void test_decrement_W20() throws Exception {
    Quarter q = new Quarter("W20");
    assertEquals(20194, q.decrement());
    assertEquals("F19", q.toString());
  }

  @Test
  public void test_decrement_S20() throws Exception {
    Quarter q = new Quarter("S20");
    assertEquals(20201, q.decrement());
    assertEquals("W20", q.toString());
  }

  @Test
  public void test_decrement_M20() throws Exception {
    Quarter q = new Quarter("M20");
    assertEquals(20202, q.decrement());
    assertEquals("S20", q.toString());
  }

  // TEST STATIC METHODS

  @Test
  public void test_yyyyqToInt() throws Exception {
    assertEquals(20194, Quarter.yyyyqToInt("20194"));
  }

  @Test
  public void test_yyyyqToInt__badLastDigit() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.yyyyqToInt("20195");
        });
  }

  @Test
  public void test_yyyyqToInt__notAnInteger() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.yyyyqToInt("foo");
        });
  }

  @Test
  public void test_yyyyqToQyy() throws Exception {
    assertEquals("F19", Quarter.yyyyqToQyy(20194));
  }

  @Test
  public void test_yyyyqToQyy__badLastDigit() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.yyyyqToQyy(20195);
        });
  }

  @Test
  public void test_getQ() throws Exception {
    Quarter q = new Quarter("W20");
    assertEquals("W", q.getQ());
  }

  @Test
  public void test_getYYYYQ() throws Exception {
    Quarter q = new Quarter("W20");
    assertEquals("20201", q.getYYYYQ());
  }

  @Test
  public void test_getQ_badLastDigit() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.getQ(20195);
        });
  }

  @Test
  public void test_getYY() throws Exception {
    Quarter q = new Quarter("W20");
    assertEquals("20", q.getYY());
  }

  @Test
  public void test_getYY_badLastDigit() {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.getYY(20195);
        });
  }

  @Test
  public void test_getYYYY() {
    Quarter q = new Quarter("W20");
    assertEquals("2020", q.getYYYY());
  }

  @Test
  public void test_getYYYY_badLastDigit() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.getYYYY(20195);
        });
  }

  @Test
  public void test_qyyToyyyyQ__F19() throws Exception {
    assertEquals(20194, Quarter.qyyToyyyyQ("F19"));
  }

  @Test
  public void test_qyyToyyyyQ__W20() throws Exception {
    assertEquals(20201, Quarter.qyyToyyyyQ("W20"));
  }

  @Test
  public void test_qyyToyyyyQ__S20() throws Exception {
    assertEquals(20202, Quarter.qyyToyyyyQ("S20"));
  }

  @Test
  public void test_qyyToyyyyQ__M20() throws Exception {
    assertEquals(20203, Quarter.qyyToyyyyQ("M20"));
  }

  @Test
  public void test_qyyToyyyyQ__F99() throws Exception {
    assertEquals(19994, Quarter.qyyToyyyyQ("F99"));
  }

  @Test
  public void test_qyyToyyyyQ__F50() throws Exception {
    assertEquals(20504, Quarter.qyyToyyyyQ("F50"));
  }

  @Test
  public void test_qyyToyyyyQ__W03() throws Exception {
    assertEquals(20031, Quarter.qyyToyyyyQ("W03"));
  }

  @Test
  public void test_qyyToyyyyQ__S89() throws Exception {
    assertEquals(19892, Quarter.qyyToyyyyQ("S89"));
  }

  @Test
  public void test_qyyToyyyyQ_badQuarter() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.qyyToyyyyQ("X20");
        });
  }

  @Test
  public void test_qyyToyyyyQ_wrongLength1() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.qyyToyyyyQ("F");
        });
  }

  @Test
  public void test_qyyToyyyyQ_wrongLength5() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.qyyToyyyyQ("F2019");
        });
  }

  @Test
  public void test_qyyToyyyyQ__badChar() throws Exception {
    Assertions.assertThrows(
        IllegalArgumentException.class,
        () -> {
          Quarter.qyyToyyyyQ("F2X");
        });
  }

  @Test
  public void test_quarterList_S20_F19() throws Exception {
    ArrayList<Quarter> expected = new ArrayList<Quarter>();
    expected.add(new Quarter("S20"));
    expected.add(new Quarter("W20"));
    expected.add(new Quarter("F19"));
    assertEquals(expected, Quarter.quarterList("20202", "20194"));
  }

  @Test
  public void test_quarterList_S20_F19_1() throws Exception {
    ArrayList<Quarter> expected = new ArrayList<Quarter>();
    expected.add(new Quarter("S20"));
    assertEquals(expected, Quarter.quarterList("20202", "20202"));
  }

  @Test
  public void test_quarterList_F19_S20() throws Exception {
    List<Quarter> expected = new ArrayList<Quarter>();
    expected.add(new Quarter("F19"));
    expected.add(new Quarter("W20"));
    expected.add(new Quarter("S20"));

    assertEquals(expected, Quarter.quarterList("20194", "20202"));
  }

  @Test
  public void testQuarter_notEqualNull() {
    Quarter q = new Quarter("W20");
    assertNotEquals(q, null);
  }

  @Test
  public void testQuarter_notEqualDifferentClass() {
    Quarter q = new Quarter("W20");
    assertNotEquals(q, new Object());
  }

  @Test
  public void testQuarter_equalsSelf() {
    Quarter q = new Quarter("W20");
    assertEquals(q, q);
  }

  @Test
  public void testQuarter_equalsCopy() {
    Quarter q1 = new Quarter("W20");
    Quarter q2 = new Quarter("W20");
    assertEquals(q1, q2);
  }

  @Test
  public void testQuarter_notequalsCopy() {
    Quarter q1 = new Quarter("F20");
    Quarter q2 = new Quarter("W20");
    assertNotEquals(q1, q2);
  }

  @Test
  public void test_hashCode() {
    Quarter q1 = new Quarter("W20");
    Quarter q2 = new Quarter("W20");
    assertEquals(q1.hashCode(), q2.hashCode());
  }

  @Test
  public void test_hashCode2() {
    Quarter q1 = new Quarter("W20");
    Quarter q2 = new Quarter("F20");
    assertNotEquals(q1.hashCode(), q2.hashCode());
  }
}
