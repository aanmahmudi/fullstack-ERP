package com.example.demo.erp.service;

import com.example.demo.erp.dto.Dtos.SalesOrderDTO;
import com.example.demo.erp.entity.Counterparty;
import com.example.demo.erp.entity.SalesOrder;
import com.example.demo.erp.repository.CounterpartyRepository;
import com.example.demo.erp.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalesOrderService {
    private final SalesOrderRepository repository;
    private final CounterpartyRepository counterpartyRepository;

    public SalesOrderService(SalesOrderRepository repository, CounterpartyRepository counterpartyRepository) {
        this.repository = repository;
        this.counterpartyRepository = counterpartyRepository;
    }

    public SalesOrderDTO create(SalesOrderDTO dto) {
        if (dto.number == null || dto.number.isBlank()) {
            throw new RuntimeException("Order number is required");
        }
        if (repository.existsByNumber(dto.number)) {
            throw new RuntimeException("Sales order number already exists");
        }
        Counterparty customer = counterpartyRepository.findById(dto.customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        SalesOrder entity = new SalesOrder();
        entity.setNumber(dto.number);
        entity.setDate(dto.date != null ? dto.date : LocalDate.now());
        entity.setCustomer(customer);
        if (dto.amount != null) entity.setAmount(dto.amount);
        if (dto.status != null) entity.setStatus(SalesOrder.Status.valueOf(dto.status));
        repository.save(entity);
        return toDto(entity);
    }

    public List<SalesOrderDTO> list() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public SalesOrderDTO get(Long id) {
        return repository.findById(id).map(this::toDto).orElseThrow(() -> new RuntimeException("Sales order not found"));
    }

    public SalesOrderDTO updateStatus(Long id, String status) {
        SalesOrder entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Sales order not found"));
        entity.setStatus(SalesOrder.Status.valueOf(status));
        repository.save(entity);
        return toDto(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private SalesOrderDTO toDto(SalesOrder entity) {
        SalesOrderDTO dto = new SalesOrderDTO();
        dto.id = entity.getId();
        dto.number = entity.getNumber();
        dto.date = entity.getDate();
        dto.customerId = entity.getCustomer().getId();
        dto.amount = entity.getAmount();
        dto.status = entity.getStatus().name();
        return dto;
    }
}

