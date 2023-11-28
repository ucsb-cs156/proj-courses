package edu.ucsb.cs156.courses.services;

import edu.ucsb.cs156.courses.models.SystemInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;

// This class relies on property values
// For hints on testing, see: https://www.baeldung.com/spring-boot-testing-configurationproperties

@Slf4j
@Service("systemInfo")
@ConfigurationProperties
public class SystemInfoServiceImpl extends SystemInfoService {

  @Value("${spring.h2.console.enabled:false}")
  private boolean springH2ConsoleEnabled;

  @Value("${app.showSwaggerUILink:false}")
  private boolean showSwaggerUILink;

  @Value("${app.startQtrYYYYQ:20221}")
  private String startQtrYYYYQ;

  @Value("${app.endQtrYYYYQ:20222}")
  private String endQtrYYYYQ;

  @Value("${app.sourceRepo:https://github.com/ucsb-cs156/proj-courses}")
  private String sourceRepo;

  @Value("${git.commit.message.short}")
  private String commitMessage;

  @Value("${git.branch}")
  private String branch;

  @Value("${git.commit.id}")
  private String commitId;

  public SystemInfo getSystemInfo() {
    SystemInfo si =
        SystemInfo.builder()
            .springH2ConsoleEnabled(this.springH2ConsoleEnabled)
            .showSwaggerUILink(this.showSwaggerUILink)
            .startQtrYYYYQ(this.startQtrYYYYQ)
            .endQtrYYYYQ(this.endQtrYYYYQ)
            .sourceRepo(this.sourceRepo)
            .commitMessage(this.commitMessage)
            .branch(this.branch)
            .commitId(this.commitId)
            .build();
    log.info("getSystemInfo returns {}", si);
    return si;
  }
}
