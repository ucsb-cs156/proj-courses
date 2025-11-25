package edu.ucsb.courses.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping({ "/{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
    public String forwardToFrontend() {
        // This tells Spring Boot: for any path that doesn't contain a dot,
        // and doesn't match an API route, return the frontend index.html
        return "forward:/index.html";
    }
}
