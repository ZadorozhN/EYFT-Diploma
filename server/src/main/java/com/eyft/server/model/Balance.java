package com.eyft.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    public Balance(String accountId){
        this.accountId = accountId;
    }
}
