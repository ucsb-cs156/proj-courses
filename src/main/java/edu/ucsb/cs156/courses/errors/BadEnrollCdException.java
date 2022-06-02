package edu.ucsb.cs156.courses.errors;

public class BadEnrollCdException extends RuntimeException {
  public BadEnrollCdException(String enrollCd) {
    super("EnrollCd: %s is invalid, (enrollCd must be valid, numeric, and no more than five digits)"
      .formatted(enrollCd.toString()));
  }
}