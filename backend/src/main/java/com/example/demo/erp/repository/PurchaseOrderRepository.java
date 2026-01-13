package com.example.demo.erp.repository;

import com.example.demo.erp.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    boolean existsByNumber(String number);
}

