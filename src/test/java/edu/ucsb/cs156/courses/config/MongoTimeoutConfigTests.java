package edu.ucsb.cs156.courses.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.mongodb.MongoClientSettings;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;

public class MongoTimeoutConfigTests {

  @Test
  public void driver_default_is_thirty_seconds() {
    // documents what we are overriding; if the driver's default changes, revisit the config
    MongoClientSettings settings = MongoClientSettings.builder().build();
    assertEquals(30, settings.getClusterSettings().getServerSelectionTimeout(TimeUnit.SECONDS));
  }

  @Test
  public void customizer_sets_server_selection_timeout() {
    MongoClientSettingsBuilderCustomizer customizer =
        new MongoTimeoutConfig().mongoServerSelectionTimeout(5);

    MongoClientSettings.Builder builder = MongoClientSettings.builder();
    customizer.customize(builder);

    assertEquals(
        5, builder.build().getClusterSettings().getServerSelectionTimeout(TimeUnit.SECONDS));
  }

  @Test
  public void customizer_uses_the_value_it_is_given() {
    MongoClientSettingsBuilderCustomizer customizer =
        new MongoTimeoutConfig().mongoServerSelectionTimeout(12);

    MongoClientSettings.Builder builder = MongoClientSettings.builder();
    customizer.customize(builder);

    assertEquals(
        12, builder.build().getClusterSettings().getServerSelectionTimeout(TimeUnit.SECONDS));
  }
}
