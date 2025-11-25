package edu.ucsb.cs156.courses.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for testing the custom error page.
 * This controller intentionally throws exceptions to trigger the error page.
 */
@Controller
public class TestErrorController {

    /**
     * Endpoint that intentionally throws a RuntimeException to test the custom error page.
     * 
     * @return This method never returns normally as it always throws an exception
     * @throws RuntimeException always thrown to trigger the error page
     */
    @GetMapping("/test-error")
    public String testError() {
        throw new RuntimeException("This is a test exception to trigger the custom error page");
    }
}
