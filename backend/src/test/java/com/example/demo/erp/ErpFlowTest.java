package com.example.demo.erp;

import com.example.demo.erp.dto.Dtos.CounterpartyDTO;
import com.example.demo.erp.dto.Dtos.SalesOrderDTO;
import com.example.demo.erp.service.CounterpartyService;
import com.example.demo.erp.service.SalesOrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ErpFlowTest {
    @Autowired
    private CounterpartyService counterpartyService;
    @Autowired
    private SalesOrderService salesOrderService;

    @Test
    void createSalesOrderFlow() {
        String suffix = UUID.randomUUID().toString();
        CounterpartyDTO cp = new CounterpartyDTO();
        cp.type = "CUSTOMER";
        cp.name = "Customer-" + suffix;
        cp.email = "c" + suffix + "@example.com";
        cp.phone = "0812345678";
        CounterpartyDTO created = counterpartyService.create(cp);
        assertNotNull(created.id);
        assertEquals("CUSTOMER", created.type);

        SalesOrderDTO so = new SalesOrderDTO();
        so.number = "SO-" + suffix;
        so.customerId = created.id;
        so.amount = new BigDecimal("123.45");
        SalesOrderDTO createdSO = salesOrderService.create(so);
        assertNotNull(createdSO.id);
        assertEquals(created.id, createdSO.customerId);
        assertEquals("DRAFT", createdSO.status);

        SalesOrderDTO fetched = salesOrderService.get(createdSO.id);
        assertEquals(createdSO.number, fetched.number);
    }
}

