package com.eyft.server.controller.bank;

import com.eyft.server.balance.kafka.dto.UserBalanceDeltaDto;
import com.eyft.server.dto.out.SuccessfulOutDTO;
import com.eyft.server.service.BankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/bank")
@RequiredArgsConstructor
@ConditionalOnProperty(value = "bank.embedded.enabled", havingValue = "true")
public class BankController {

    private final BankService bankService;

    @PostMapping("/withdraw")
    public SuccessfulOutDTO withdraw(@RequestBody UserBalanceDeltaDto userBalanceDeltaDto){
        log.info("Received a withdraw request {}", userBalanceDeltaDto);

        bankService.withdraw(userBalanceDeltaDto.getLogin(), userBalanceDeltaDto.getDelta());

        return new SuccessfulOutDTO("Withdrawn successfully");
    }

    @PostMapping("/deposit")
    public SuccessfulOutDTO deposit(@RequestBody UserBalanceDeltaDto userBalanceDeltaDto){
        log.info("Received a deposit request {}", userBalanceDeltaDto);

        bankService.deposit(userBalanceDeltaDto.getLogin(), userBalanceDeltaDto.getDelta());

        return new SuccessfulOutDTO("Deposited successfully");
    }
}
