package com.example.demo.erp.service;

import com.example.demo.erp.dto.Dtos.PurchaseOrderDTO;
import com.example.demo.erp.entity.Counterparty;
import com.example.demo.erp.entity.PurchaseOrder;
import com.example.demo.erp.repository.CounterpartyRepository;
import com.example.demo.erp.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderService {
    private final PurchaseOrderRepository repository;
    private final CounterpartyRepository counterpartyRepository;

    public PurchaseOrderService(PurchaseOrderRepository repository, CounterpartyRepository counterpartyRepository) {
        this.repository = repository;
        this.counterpartyRepository = counterpartyRepository;
    }

    public PurchaseOrderDTO create(PurchaseOrderDTO dto) {
        if (dto.number == null || dto.number.isBlank()) {
            throw new RuntimeException("Order number is required");
        }
        Counterparty vendor = counterpartyRepository.findById(dto.vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        PurchaseOrder entity = new PurchaseOrder();
        entity.setNumber(dto.number);
        entity.setDate(dto.date != null ? dto.date : LocalDate.now());
        entity.setVendor(vendor);
        if (dto.amount != null) entity.setAmount(dto.amount);
        if (dto.status != null) entity.setStatus(PurchaseOrder.Status.valueOf(dto.status));
        repository.save(entity);
        return toDto(entity);
    }

    public List<PurchaseOrderDTO> list() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public PurchaseOrderDTO get(Long id) {
        return repository.findById(id).map(this::toDto).orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    public PurchaseOrderDTO updateStatus(Long id, String status) {
        PurchaseOrder entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Purchase order not found"));
        entity.setStatus(PurchaseOrder.Status.valueOf(status));
        repository.save(entity);
        return toDto(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private PurchaseOrderDTO toDto(PurchaseOrder entity) {
        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.id = entity.getId();
        dto.number = entity.getNumber();
        dto.date = entity.getDate();
        dto.vendorId = entity.getVendor().getId();
        dto.amount = entity.getAmount();
        dto.status = entity.getStatus().name();
        return dto;
    }
}

