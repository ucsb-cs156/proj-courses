package edu.ucsb.cs156.courses.controllers;

import edu.ucsb.cs156.courses.models.SystemInfo;
import edu.ucsb.cs156.courses.services.SystemInfoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(description = "System Information")
@RequestMapping("/api/systemInfo")
@RestController
public class SystemInfoController extends ApiController {

    @Autowired
    private SystemInfoService systemInfoService;

    @ApiOperation(value = "Get global public information about the application")
    @GetMapping("")
    public SystemInfo getSystemInfo() {
        return systemInfoService.getSystemInfo();
    }

}