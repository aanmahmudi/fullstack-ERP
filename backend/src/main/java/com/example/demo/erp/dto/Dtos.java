package com.example.demo.erp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Dtos {
    public static class CounterpartyDTO {
        public Long id;
        public String type;
        public String name;
        public String email;
        public String phone;
    }

    public static class SalesOrderDTO {
        public Long id;
        public String number;
        public LocalDate date;
        public Long customerId;
        public BigDecimal amount;
        public String status;
    }

    public static class PurchaseOrderDTO {
        public Long id;
        public String number;
        public LocalDate date;
        public Long vendorId;
        public BigDecimal amount;
        public String status;
    }

    public static class TaskItemDTO {
        public Long id;
        public String title;
        public String status;
    }

    public static class WorkOrderDTO {
        public Long id;
        public String number;
        public Long productId;
        public Integer quantity;
        public String status;
    }
}

