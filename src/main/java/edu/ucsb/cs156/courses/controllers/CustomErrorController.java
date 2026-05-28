package edu.ucsb.cs156.courses.controllers;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
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

    int statusCode = 500;
    if (statusObj != null) {
      statusCode = Integer.parseInt(statusObj.toString());
    }

    HttpStatus httpStatus = HttpStatus.resolve(statusCode);
    String error = httpStatus == null ? "Unknown Error" : httpStatus.getReasonPhrase();

    Object messageObj = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
    String message = messageObj == null ? "" : messageObj.toString();

    Object pathObj = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
    String path = pathObj == null ? "" : pathObj.toString();

    Throwable throwable = (Throwable) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

    String exceptionMessage = "";
    String stackTrace = "";

    if (throwable != null) {
      exceptionMessage = throwable.getMessage();

      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      throwable.printStackTrace(pw);
      stackTrace = sw.toString();
    }

    model.addAttribute("status", statusCode);
    model.addAttribute("error", error);
    model.addAttribute("message", message);
    model.addAttribute("exceptionMessage", exceptionMessage);
    model.addAttribute("stackTrace", stackTrace);
    model.addAttribute("timestamp", LocalDateTime.now());
    model.addAttribute("path", path);

    return "custom-error";
  }
}
