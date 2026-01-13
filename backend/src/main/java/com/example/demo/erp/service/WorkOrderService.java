package com.example.demo.erp.service;

import com.example.demo.erp.dto.Dtos.WorkOrderDTO;
import com.example.demo.erp.entity.WorkOrder;
import com.example.demo.erp.repository.WorkOrderRepository;
import com.example.demo.inventory.entity.Product;
import com.example.demo.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkOrderService {
    private final WorkOrderRepository repository;
    private final ProductRepository productRepository;

    public WorkOrderService(WorkOrderRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    public WorkOrderDTO create(WorkOrderDTO dto) {
        if (dto.number == null || dto.number.isBlank()) {
            throw new RuntimeException("Work order number is required");
        }
        Product product = productRepository.findById(dto.productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        WorkOrder entity = new WorkOrder();
        entity.setNumber(dto.number);
        entity.setProduct(product);
        entity.setQuantity(dto.quantity);
        if (dto.status != null) entity.setStatus(WorkOrder.Status.valueOf(dto.status));
        repository.save(entity);
        return toDto(entity);
    }

    public List<WorkOrderDTO> list() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public WorkOrderDTO get(Long id) {
        return repository.findById(id).map(this::toDto).orElseThrow(() -> new RuntimeException("Work order not found"));
    }

    public WorkOrderDTO updateStatus(Long id, String status) {
        WorkOrder entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Work order not found"));
        entity.setStatus(WorkOrder.Status.valueOf(status));
        repository.save(entity);
        return toDto(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private WorkOrderDTO toDto(WorkOrder entity) {
        WorkOrderDTO dto = new WorkOrderDTO();
        dto.id = entity.getId();
        dto.number = entity.getNumber();
        dto.productId = entity.getProduct().getId();
        dto.quantity = entity.getQuantity();
        dto.status = entity.getStatus().name();
        return dto;
    }
}

