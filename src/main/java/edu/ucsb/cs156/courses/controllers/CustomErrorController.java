package edu.ucsb.cs156.courses.controllers;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Custom error controller that replaces the default white label error page
 * with a more user-friendly error page.
 */
@Controller
public class CustomErrorController implements ErrorController {

    /**
     * Handles error requests and returns a custom error page.
     * 
     * @param request the HTTP request
     * @param model the model to pass attributes to the view
     * @return the name of the error view template
     */
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        // Get error status
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = (status != null) ? Integer.parseInt(status.toString()) : 500;  // Default to internal server error

        // Get error message
        String message = switch (statusCode) {
            case 404 -> "The page you are looking for might have been removed or is temporarily unavailable";
            case 403 -> "You don't have permission to access this resource";
            case 500 -> "We're sorry, something went wrong on our end";
            default -> "An unexpected error occurred";
        };

        // Get exception details for debugging
        Throwable throwable = (Throwable) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        // Add attributes to the model
        model.addAttribute("status", statusCode);
        model.addAttribute("error", HttpStatus.valueOf(statusCode).getReasonPhrase());
        model.addAttribute("message", message);
        model.addAttribute("exceptionMessage", throwable != null ? throwable.getMessage() : "No exception details available");
        model.addAttribute("stackTrace", throwable != null ? stackToString(throwable) : "");
        model.addAttribute("timestamp", java.time.LocalDateTime.now());
        model.addAttribute("path", request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI));

        return "error";
    }

    /**
     * Converts a Throwable's stack trace to a single string with line breaks.
     *
     * @param t the Throwable whose stack trace is to be converted
     * @return a String representation of the stack trace
     */
    private String stackToString(Throwable t) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement e : t.getStackTrace()) {
            sb.append(e.toString()).append("\n");
        }
        return sb.toString();
    }
}

