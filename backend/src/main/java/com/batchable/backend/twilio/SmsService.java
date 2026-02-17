package com.batchable.backend.twilio;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
@Service 
public class SmsService {

    @Value("${twilio.phone-number}")
    private String fromNumber;

    public void sendSms(String toNumber, String message) {

        Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber),
                message
        ).create();
    }
}
