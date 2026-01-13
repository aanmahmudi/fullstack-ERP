package com.example.demo.erp.repository;

import com.example.demo.erp.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    boolean existsByNumber(String number);
}

