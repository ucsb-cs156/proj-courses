package edu.ucsb.cs156.courses.errors;

public class EntityNotFoundException extends RuntimeException {
  public EntityNotFoundException(Class<?> entityType, Object id) {
    super("%s with id %s not found".formatted(entityType.getSimpleName(), id.toString()));
  }

  public EntityNotFoundException(
      Class<?> entityType,
      String fieldOneName,
      Object fieldOneValue,
      String fieldTwoName,
      Object fieldTwoValue) {
    super(
        "%s with %s %s and %s %s not found"
            .formatted(
                entityType.getSimpleName(),
                fieldOneName,
                fieldOneValue.toString(),
                fieldTwoName,
                fieldTwoValue.toString()));
  }
}
