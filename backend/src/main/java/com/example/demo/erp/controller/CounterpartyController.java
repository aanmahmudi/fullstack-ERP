package com.example.demo.erp.controller;

import com.example.demo.erp.dto.Dtos.CounterpartyDTO;
import com.example.demo.erp.service.CounterpartyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/counterparties")
public class CounterpartyController {
    private final CounterpartyService service;

    public CounterpartyController(CounterpartyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CounterpartyDTO> create(@RequestBody CounterpartyDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<CounterpartyDTO>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CounterpartyDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CounterpartyDTO> update(@PathVariable Long id, @RequestBody CounterpartyDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

