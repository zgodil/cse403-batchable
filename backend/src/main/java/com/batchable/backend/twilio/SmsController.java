package com.batchable.backend.twilio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
public class SmsController {

    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send-text")
    public ResponseEntity<String> sendText(@RequestBody SmsRequest request) {

        smsService.sendSms(request.getPhoneNumber(), request.getMessage());

        return ResponseEntity.ok("Message sent!");
    }
}
