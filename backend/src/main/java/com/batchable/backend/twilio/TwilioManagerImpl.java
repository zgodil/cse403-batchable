package com.batchable.backend.twilio;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class TwilioManagerImpl implements TwilioManager {

    private final TwilioConfig config;

    public TwilioManagerImpl(TwilioConfig config) {
        this.config = config;
    }

    @Override
    public void sendMessage(String toPhoneNumber, String message) {

        Message twilioMessage = Message.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(config.getPhoneNumber()),
                message
        ).create();

        System.out.println("Twilio SID: " + twilioMessage.getSid());
        System.out.println("Twilio Status: " + twilioMessage.getStatus());
    }
}
