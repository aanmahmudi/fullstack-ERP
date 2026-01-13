package com.example.demo.erp.controller;

import com.example.demo.erp.dto.Dtos.TaskItemDTO;
import com.example.demo.erp.service.TaskItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erp/tasks")
public class TaskItemController {
    private final TaskItemService service;

    public TaskItemController(TaskItemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TaskItemDTO> create(@RequestBody TaskItemDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<TaskItemDTO>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskItemDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskItemDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

