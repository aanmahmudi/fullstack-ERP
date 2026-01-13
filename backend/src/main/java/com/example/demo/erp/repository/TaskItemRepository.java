package com.example.demo.erp.repository;

import com.example.demo.erp.entity.TaskItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {
}

