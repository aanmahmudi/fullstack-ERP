package com.example.demo.erp.service;

import com.example.demo.erp.dto.Dtos.TaskItemDTO;
import com.example.demo.erp.entity.TaskItem;
import com.example.demo.erp.repository.TaskItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskItemService {
    private final TaskItemRepository repository;

    public TaskItemService(TaskItemRepository repository) {
        this.repository = repository;
    }

    public TaskItemDTO create(TaskItemDTO dto) {
        TaskItem entity = new TaskItem();
        entity.setTitle(dto.title);
        if (dto.status != null) {
            entity.setStatus(TaskItem.Status.valueOf(dto.status));
        }
        repository.save(entity);
        return toDto(entity);
    }

    public List<TaskItemDTO> list() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TaskItemDTO get(Long id) {
        return repository.findById(id).map(this::toDto).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public TaskItemDTO updateStatus(Long id, String status) {
        TaskItem entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        entity.setStatus(TaskItem.Status.valueOf(status));
        repository.save(entity);
        return toDto(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private TaskItemDTO toDto(TaskItem entity) {
        TaskItemDTO dto = new TaskItemDTO();
        dto.id = entity.getId();
        dto.title = entity.getTitle();
        dto.status = entity.getStatus().name();
        return dto;
    }
}

