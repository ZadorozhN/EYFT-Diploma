package com.eyft.server.repository;

import com.eyft.server.model.PropOrder;
import com.eyft.server.model.PropOrderStatus;
import com.eyft.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropOrderRepository extends JpaRepository<PropOrder, Long> {
    List<PropOrder> getAllByUser(User user);

    List<PropOrder> getAllByStatusIn(List<PropOrderStatus> propOrderStatuses);
}
