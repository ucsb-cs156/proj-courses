package edu.ucsb.cs156.courses;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CoursesApplication {

  public static void main(String[] args) {
    SpringApplication.run(CoursesApplication.class, args);
  }

}
