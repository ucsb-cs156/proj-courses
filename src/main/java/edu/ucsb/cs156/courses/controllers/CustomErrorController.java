package edu.ucsb.cs156.courses.controllers;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {

        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int status = (statusObj != null) ? Integer.parseInt(statusObj.toString()) : 500;

        String message = switch (status) {
            case 404 -> "The page you’re looking for was not found.";
            case 403 -> "You do not have permission to access this resource.";
            case 500 -> "Something went wrong on our end.";
            default -> "An unexpected error occurred.";
        };

        Throwable throwable = (Throwable) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        String exceptionMessage = (throwable != null ? throwable.getMessage() : "No exception details available");

        String stackTrace = "";
        if (throwable != null) {
            for (StackTraceElement e : throwable.getStackTrace()) {
                stackTrace += e.toString() + "\n";
            }
        }

        model.addAttribute("status", status);
        model.addAttribute("error", HttpStatus.valueOf(status).getReasonPhrase());
        model.addAttribute("message", message);
        model.addAttribute("exceptionMessage", exceptionMessage);
        model.addAttribute("stackTrace", stackTrace);
        model.addAttribute("path", request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI));
        model.addAttribute("timestamp", java.time.LocalDateTime.now());

        return "error";
    }
}
