package com.eyft.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Prop {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "propType")
    @Enumerated(value = EnumType.STRING)
    private PropType propType;

    @Column(name = "cost")
    private Long cost;

    @Column(name = "costType")
    @Enumerated(value = EnumType.STRING)
    private CostType costType;

    @JoinColumn(name = "prop_id")
    @OneToMany(cascade = CascadeType.ALL)
    private List<PropOrder> propOrders;
}
