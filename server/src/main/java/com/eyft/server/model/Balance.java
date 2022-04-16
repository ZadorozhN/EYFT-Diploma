package com.eyft.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "accountId", unique = true)
    private String accountId;

    @Column(name = "cents")
    private long cents;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private Balance(String accountId){
        this.accountId = accountId;
    }

    public static Balance newInstance() {
        String accountId = UUID.randomUUID().toString();

        return new Balance(accountId);
    }
}
