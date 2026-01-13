package com.example.demo.erp.repository;

import com.example.demo.erp.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    boolean existsByNumber(String number);
}

