package com.example.demo.erp.controller;

import com.example.demo.erp.dto.Dtos.SalesOrderDTO;
import com.example.demo.erp.service.SalesOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/sales-orders")
public class SalesOrderController {
    private final SalesOrderService service;

    public SalesOrderController(SalesOrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SalesOrderDTO> create(@RequestBody SalesOrderDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<SalesOrderDTO>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SalesOrderDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

